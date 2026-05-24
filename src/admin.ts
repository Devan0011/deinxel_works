import './index.css';
import gsap from 'gsap';
import type { RealtimeChannel, User } from '@supabase/supabase-js';
import { createIcons, icons } from 'lucide';
import { supabase } from './lib/supabase.ts';
import { fetchAdminSubmissions, subscribeToAdminSubmissions, updateBookingStatus } from './lib/submissions.ts';
import { getBookingStatusWhatsAppUrl } from './lib/whatsapp.ts';

let adminSubscription: RealtimeChannel | null = null;

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

function setAuthMessage(message: string) {
    const messageEl = document.getElementById('admin-auth-message');
    if (messageEl) messageEl.textContent = message;
}

function showAuthView(message = 'Sign in with an admin account to manage live inquiries and session requests.') {
    document.getElementById('admin-dashboard-view')?.classList.add('hidden');
    const authView = document.getElementById('admin-auth-view');
    authView?.classList.remove('hidden');
    authView?.classList.add('flex');
    document.getElementById('admin-logout-btn')?.classList.add('hidden');
    setAuthMessage(message);
}

function showDashboardView(user: User) {
    const authView = document.getElementById('admin-auth-view');
    authView?.classList.add('hidden');
    authView?.classList.remove('flex');
    document.getElementById('admin-dashboard-view')?.classList.remove('hidden');
    document.getElementById('admin-logout-btn')?.classList.remove('hidden');

    const badge = document.getElementById('admin-status-badge');
    if (badge) badge.textContent = `Status: ${user.email?.split('@')[0] || 'Admin'}`;
}

async function getAdminProfile(user: User) {
    const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

    if (error) {
        console.warn('Admin profile lookup failed:', error.message);
    }

    return data;
}

async function requireAdminSession() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        showAuthView();
        return;
    }

    const profile = await getAdminProfile(user);
    if (profile?.role !== 'admin') {
        await supabase.auth.signOut();
        showAuthView('This account is not marked as an admin. Update its profile role in Supabase, then sign in again.');
        return;
    }

    showDashboardView(user);
    initAdminView();
}

function initAuthHandlers() {
    const loginForm = document.getElementById('admin-login-form') as HTMLFormElement | null;
    const logoutBtn = document.getElementById('admin-logout-btn') as HTMLButtonElement | null;

    loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = (document.getElementById('admin-email') as HTMLInputElement).value.trim();
        const password = (document.getElementById('admin-password') as HTMLInputElement).value;
        const submitButton = loginForm.querySelector<HTMLButtonElement>('button[type="submit"]');

        submitButton && (submitButton.disabled = true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        submitButton && (submitButton.disabled = false);

        if (error || !data.user) {
            setAuthMessage('Admin sign in failed: ' + (error?.message || 'Unknown error'));
            return;
        }

        const profile = await getAdminProfile(data.user);
        if (profile?.role !== 'admin') {
            await supabase.auth.signOut();
            showAuthView('Signed in, but this account is not an admin. Set role = admin in the profiles table.');
            return;
        }

        loginForm.reset();
        showDashboardView(data.user);
        initAdminView();
    });

    logoutBtn?.addEventListener('click', async () => {
        if (adminSubscription) {
            await supabase.removeChannel(adminSubscription);
            adminSubscription = null;
        }
        await supabase.auth.signOut();
        showAuthView();
    });
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
                requireAdminSession();
            }
        });
}

async function initAdminView() {
    const inquiriesList = document.getElementById('admin-inquiries-list')!;
    const bookingsList = document.getElementById('admin-bookings-list')!;

    const { inquiries, inquiriesError, bookings, bookingsError } = await fetchAdminSubmissions();

    if (inquiriesError) {
        inquiriesList.innerHTML = `<p class="text-[10px] font-accent uppercase tracking-widest opacity-40">Unable to load inquiries: ${escapeHtml(inquiriesError.message)}</p>`;
    } else if (inquiries?.length) {
        inquiriesList.innerHTML = inquiries.map(m => `
            <div class="p-8 bg-primary-accent/5 rounded-[30px] border border-primary-accent/5 space-y-4">
                <div class="flex justify-between items-start gap-6">
                    <div>
                        <h4 class="font-display text-xl text-primary-accent">${escapeHtml(m.name)}</h4>
                        <p class="text-[10px] font-accent uppercase tracking-widest opacity-40">${escapeHtml(m.email)}</p>
                    </div>
                    <span class="text-[9px] font-accent font-bold text-gold opacity-60 uppercase">${formatDate(m.created_at)}</span>
                </div>
                <div class="flex flex-wrap gap-4">
                    <span class="text-[8px] font-accent font-bold px-3 py-1 bg-primary-accent/10 rounded-full text-primary-accent uppercase tracking-widest">${escapeHtml(m.service || 'General')}</span>
                    <span class="text-[8px] font-accent font-bold px-3 py-1 bg-gold/10 rounded-full text-gold uppercase tracking-widest">${escapeHtml(m.budget || 'Open')}</span>
                </div>
                <p class="text-[12px] font-display italic opacity-60 leading-relaxed whitespace-pre-line">${escapeHtml(m.message)}</p>
            </div>
        `).join('');
    } else {
        inquiriesList.innerHTML = '<p class="text-[10px] font-accent uppercase tracking-widest opacity-40">No inquiries found.</p>';
    }

    if (bookingsError) {
        bookingsList.innerHTML = `<p class="text-[10px] font-accent uppercase tracking-widest opacity-40">Unable to load session requests: ${escapeHtml(bookingsError.message)}</p>`;
    } else if (bookings?.length) {
        bookingsList.innerHTML = bookings.map(b => `
            <div class="p-8 bg-primary-accent/5 rounded-[30px] border border-primary-accent/5 space-y-4">
                <div class="flex justify-between items-center gap-6">
                    <h4 class="font-display text-xl text-primary-accent uppercase tracking-tighter">${escapeHtml(b.service_type || b.project_type || 'Custom Project')}</h4>
                    <span class="text-[10px] font-accent font-bold text-gold uppercase tracking-widest">${escapeHtml(statusLabel(b.status))}</span>
                </div>
                <div class="flex items-center gap-4 py-3 border-y border-primary-accent/5">
                    <i data-lucide="calendar" class="w-4 h-4 opacity-40"></i>
                    <span class="text-[10px] font-accent font-bold uppercase tracking-[0.2em] opacity-60">${b.meeting_date ? `Scheduled: ${formatDate(b.meeting_date)}` : escapeHtml(b.timeline || 'Timeline captured in project brief')}</span>
                </div>
                <p class="text-[12px] font-display italic opacity-60 leading-relaxed whitespace-pre-line">${escapeHtml(b.requirements || 'No specific requirements articulated.')}</p>
                <div class="flex flex-col sm:flex-row gap-4 pt-4">
                    <button data-booking-action="approved" data-booking-id="${b.id}" class="flex-1 py-3 glass rounded-2xl text-[9px] font-accent font-bold uppercase tracking-widest text-primary-accent hover:bg-primary-accent hover:text-white transition-all">Approve</button>
                    <button data-booking-action="rejected" data-booking-id="${b.id}" class="flex-1 py-3 glass rounded-2xl text-[9px] font-accent font-bold uppercase tracking-widest text-red-600 hover:bg-red-500 hover:text-white transition-all">Reject</button>
                    <button data-booking-action="completed" data-booking-id="${b.id}" class="flex-1 py-3 glass rounded-2xl text-[9px] font-accent font-bold uppercase tracking-widest text-gold hover:bg-gold hover:text-white transition-all">Complete</button>
                </div>
            </div>
        `).join('');
    } else {
        bookingsList.innerHTML = '<p class="text-[10px] font-accent uppercase tracking-widest opacity-40">No session requests found.</p>';
    }

    bookingsList.onclick = async (event) => {
        const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-booking-action]');
        if (!button) return;

        const status = button.dataset.bookingAction as 'approved' | 'rejected' | 'completed';
        button.disabled = true;
        const { data, error } = await updateBookingStatus(button.dataset.bookingId || '', status);
        button.disabled = false;

        if (error) {
            alert('Status update failed: ' + error.message);
        } else {
            const whatsAppUrl = getBookingStatusWhatsAppUrl(data, status);
            if (whatsAppUrl) {
                window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
            } else {
                alert('Status updated, but no client phone number was available for WhatsApp.');
            }
            initAdminView();
        }
    };

    if (!adminSubscription) {
        adminSubscription = subscribeToAdminSubmissions(() => initAdminView());
    }

    refreshIcons();
}

document.addEventListener('DOMContentLoaded', () => {
    refreshIcons();
    initAuthHandlers();
    initLoader();
});
