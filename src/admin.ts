import './index.css';
import gsap from 'gsap';
import { supabase } from './lib/supabase.ts';
import { createIcons, icons } from 'lucide';

function refreshIcons() {
    createIcons({ icons });
}

function escapeHtml(value: unknown) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatDate(value?: string | null) {
    if (!value) return 'Timeline captured in project brief';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? escapeHtml(value) : parsed.toLocaleDateString();
}

function statusLabel(value?: string | null) {
    return String(value || 'pending').replace(/_/g, ' ');
}

async function updateBookingStatus(bookingId: string, status: 'approved' | 'rejected' | 'completed') {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
    if (error) {
        alert('Status update failed: ' + error.message);
        return false;
    }
    return true;
}

function initLoader() {
    const tl = gsap.timeline();

    tl.to('#loader-logo', { opacity: 1, y: 0, duration: 1, ease: 'expo.out' })
        .to('#loader-progress', { scaleX: 1, duration: 2, ease: 'power4.inOut' }, '-=0.5')
        .to('#loader', {
            yPercent: -100,
            duration: 1.2,
            ease: 'expo.inOut',
            onComplete: () => {
                document.getElementById('loader')?.remove();
                gsap.to('#main-content', { opacity: 1, duration: 1, ease: 'power2.out' });
                initAdminView();
            }
        });
}

async function initAdminView() {
    const inquiriesList = document.getElementById('admin-inquiries-list')!;
    const bookingsList = document.getElementById('admin-bookings-list')!;

    const [{ data: inquiries, error: inqError }, { data: bookings, error: bookError }] = await Promise.all([
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false })
    ]);

    if (inqError) {
        inquiriesList.innerHTML = `<p class="text-[10px] font-accent uppercase tracking-widest opacity-40">Unable to load inquiries: ${escapeHtml(inqError.message)}</p>`;
    } else if (inquiries && inquiries.length > 0) {
        inquiriesList.innerHTML = inquiries.map(m => `
            <div class="p-8 bg-primary-accent/5 rounded-[30px] border border-primary-accent/5 space-y-4">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-display text-xl text-primary-accent">${escapeHtml(m.name)}</h4>
                        <p class="text-[10px] font-accent uppercase tracking-widest opacity-40">${escapeHtml(m.email)}</p>
                    </div>
                    <span class="text-[9px] font-accent font-bold text-gold opacity-60 uppercase">${formatDate(m.created_at)}</span>
                </div>
                <div class="flex gap-4">
                    <span class="text-[8px] font-accent font-bold px-3 py-1 bg-primary-accent/10 rounded-full text-primary-accent uppercase tracking-widest">${escapeHtml(m.service || 'General')}</span>
                    <span class="text-[8px] font-accent font-bold px-3 py-1 bg-gold/10 rounded-full text-gold uppercase tracking-widest">${escapeHtml(m.budget || 'Open')}</span>
                </div>
                <p class="text-[12px] font-display italic opacity-60 leading-relaxed whitespace-pre-line">${escapeHtml(m.message)}</p>
            </div>
        `).join('');
    } else {
        inquiriesList.innerHTML = '<p class="text-[10px] font-accent uppercase tracking-widest opacity-40">No inquiries found.</p>';
    }

    if (bookError) {
        bookingsList.innerHTML = `<p class="text-[10px] font-accent uppercase tracking-widest opacity-40">Unable to load session requests: ${escapeHtml(bookError.message)}</p>`;
    } else if (bookings && bookings.length > 0) {
        bookingsList.innerHTML = bookings.map(b => `
            <div class="p-8 bg-primary-accent/5 rounded-[30px] border border-primary-accent/5 space-y-4">
                <div class="flex justify-between items-center">
                    <h4 class="font-display text-xl text-primary-accent uppercase tracking-tighter">${escapeHtml(b.service_type || b.project_type || 'Custom Project')}</h4>
                    <span class="text-[10px] font-accent font-bold text-gold uppercase tracking-widest">${escapeHtml(statusLabel(b.status))}</span>
                </div>
                <div class="flex items-center gap-4 py-3 border-y border-primary-accent/5">
                    <i data-lucide="calendar" class="w-4 h-4 opacity-40"></i>
                    <span class="text-[10px] font-accent font-bold uppercase tracking-[0.2em] opacity-60">${b.meeting_date ? `Scheduled: ${formatDate(b.meeting_date)}` : escapeHtml(b.timeline || 'Timeline captured in project brief')}</span>
                </div>
                <p class="text-[12px] font-display italic opacity-60 leading-relaxed whitespace-pre-line">${escapeHtml(b.requirements || 'No specific requirements articulated.')}</p>
                <div class="flex gap-4 pt-4">
                    <button data-booking-action="approved" data-booking-id="${b.id}" class="flex-1 py-3 glass rounded-2xl text-[9px] font-accent font-bold uppercase tracking-widest text-primary-accent hover:bg-primary-accent hover:text-white transition-all">Approve</button>
                    <button data-booking-action="rejected" data-booking-id="${b.id}" class="flex-1 py-3 glass rounded-2xl text-[9px] font-accent font-bold uppercase tracking-widest text-red-600 hover:bg-red-500 hover:text-white transition-all">Reject</button>
                </div>
            </div>
        `).join('');
    } else {
        bookingsList.innerHTML = '<p class="text-[10px] font-accent uppercase tracking-widest opacity-40">No session requests found.</p>';
    }

    bookingsList.onclick = async (event) => {
        const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-booking-action]');
        if (!button) return;

        button.disabled = true;
        const updated = await updateBookingStatus(button.dataset.bookingId || '', button.dataset.bookingAction as 'approved' | 'rejected');
        button.disabled = false;
        if (updated) initAdminView();
    };

    refreshIcons();
}

document.addEventListener('DOMContentLoaded', () => {
    refreshIcons();
    initLoader();
});
