import './index.css';
import gsap from 'gsap';
import { supabase } from './lib/supabase.ts';
import { createIcons, icons } from 'lucide';

function refreshIcons() {
    createIcons({ icons });
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

    try {
        // Fetch Inquiries
        const { data: inquiries, error: inqError } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        
        if (inqError) throw inqError;

        if (inquiries && inquiries.length > 0) {
            inquiriesList.innerHTML = inquiries.map(m => `
                <div class="p-8 bg-primary-accent/5 rounded-[30px] border border-primary-accent/5 space-y-4">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-display text-xl text-primary-accent">${m.name}</h4>
                            <p class="text-[10px] font-accent uppercase tracking-widest opacity-40">${m.email}</p>
                        </div>
                        <span class="text-[9px] font-accent font-bold text-gold opacity-60 uppercase">${new Date(m.created_at).toLocaleDateString()}</span>
                    </div>
                    <div class="flex gap-4">
                        <span class="text-[8px] font-accent font-bold px-3 py-1 bg-primary-accent/10 rounded-full text-primary-accent uppercase tracking-widest">${m.service}</span>
                        <span class="text-[8px] font-accent font-bold px-3 py-1 bg-gold/10 rounded-full text-gold uppercase tracking-widest">${m.budget}</span>
                    </div>
                    <p class="text-[12px] font-display italic opacity-60 leading-relaxed">${m.message}</p>
                </div>
            `).join('');
        } else {
            inquiriesList.innerHTML = '<p class="text-[10px] font-accent uppercase tracking-widest opacity-40">No inquiries found.</p>';
        }

        // Fetch Bookings
        const { data: bookings, error: bookError } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
        
        if (bookError) throw bookError;

        if (bookings && bookings.length > 0) {
            bookingsList.innerHTML = bookings.map(b => `
                <div class="p-8 bg-primary-accent/5 rounded-[30px] border border-primary-accent/5 space-y-4">
                    <div class="flex justify-between items-center">
                        <h4 class="font-display text-xl text-primary-accent uppercase tracking-tighter">${b.service_type}</h4>
                        <span class="text-[10px] font-accent font-bold text-gold uppercase tracking-widest">${b.status}</span>
                    </div>
                    <div class="flex items-center gap-4 py-3 border-y border-primary-accent/5">
                        <i data-lucide="calendar" class="w-4 h-4 opacity-40"></i>
                        <span class="text-[10px] font-accent font-bold uppercase tracking-[0.2em] opacity-60">Scheduled: ${new Date(b.meeting_date).toLocaleDateString()}</span>
                    </div>
                    <p class="text-[12px] font-display italic opacity-60 leading-relaxed">${b.requirements || 'No specific requirements articulated.'}</p>
                    <div class="flex gap-4 pt-4">
                        <button class="flex-1 py-3 glass rounded-2xl text-[9px] font-accent font-bold uppercase tracking-widest text-primary-accent hover:bg-primary-accent hover:text-white transition-all">Approve</button>
                        <button class="flex-1 py-3 glass rounded-2xl text-[9px] font-accent font-bold uppercase tracking-widest text-red-600 hover:bg-red-500 hover:text-white transition-all">Reject</button>
                    </div>
                </div>
            `).join('');
        } else {
            bookingsList.innerHTML = '<p class="text-[10px] font-accent uppercase tracking-widest opacity-40">No session requests found.</p>';
        }

    } catch (err: any) {
        console.error("Database connection error:", err);
        // Fallback mock data since the user said the database is not working
        inquiriesList.innerHTML = `
            <div class="p-8 bg-primary-accent/5 rounded-[30px] border border-primary-accent/5 space-y-4">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-display text-xl text-primary-accent">John Doe (Mock)</h4>
                        <p class="text-[10px] font-accent uppercase tracking-widest opacity-40">john@example.com</p>
                    </div>
                    <span class="text-[9px] font-accent font-bold text-gold opacity-60 uppercase">${new Date().toLocaleDateString()}</span>
                </div>
                <div class="flex gap-4">
                    <span class="text-[8px] font-accent font-bold px-3 py-1 bg-primary-accent/10 rounded-full text-primary-accent uppercase tracking-widest">Web Design</span>
                    <span class="text-[8px] font-accent font-bold px-3 py-1 bg-gold/10 rounded-full text-gold uppercase tracking-widest">$10k+</span>
                </div>
                <p class="text-[12px] font-display italic opacity-60 leading-relaxed">This is mock data because the database connection failed. I am looking forward to working with you.</p>
            </div>
        `;

        bookingsList.innerHTML = `
            <div class="p-8 bg-primary-accent/5 rounded-[30px] border border-primary-accent/5 space-y-4">
                <div class="flex justify-between items-center">
                    <h4 class="font-display text-xl text-primary-accent uppercase tracking-tighter">Immersive UI Experience</h4>
                    <span class="text-[10px] font-accent font-bold text-gold uppercase tracking-widest">pending</span>
                </div>
                <div class="flex items-center gap-4 py-3 border-y border-primary-accent/5">
                    <i data-lucide="calendar" class="w-4 h-4 opacity-40"></i>
                    <span class="text-[10px] font-accent font-bold uppercase tracking-[0.2em] opacity-60">Scheduled: ${new Date().toLocaleDateString()}</span>
                </div>
                <p class="text-[12px] font-display italic opacity-60 leading-relaxed">Mock Requirement: I need a complete revamp of my application interface.</p>
                <div class="flex gap-4 pt-4">
                    <button class="flex-1 py-3 glass rounded-2xl text-[9px] font-accent font-bold uppercase tracking-widest text-primary-accent hover:bg-primary-accent hover:text-white transition-all">Approve</button>
                    <button class="flex-1 py-3 glass rounded-2xl text-[9px] font-accent font-bold uppercase tracking-widest text-red-600 hover:bg-red-500 hover:text-white transition-all">Reject</button>
                </div>
            </div>
        `;
    }

    refreshIcons();
}

document.addEventListener('DOMContentLoaded', () => {
    refreshIcons();
    initLoader();
});
