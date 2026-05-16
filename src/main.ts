import './index.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createIcons, icons } from 'lucide';
import SplitType from 'split-type';
import { initLenis } from './lib/lenis.ts';
import { renderServices, renderPortfolio, renderPricing, renderTestimonials } from './lib/ui.ts';
import { supabase } from './lib/supabase.ts';
import { fetchMessages, sendMessage, subscribeToMessages } from './lib/chat.ts';

import { fetchFiles, uploadFile } from './lib/storage.ts';

gsap.registerPlugin(ScrollTrigger);

// Initialize Smooth Scroll
const lenis = initLenis();

// State
let currentUser: any = null;
let userProfile: any = null;

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
                initHeroAnimations();
            }
        });
}

function initHeroAnimations() {
    const tl = gsap.timeline();

    tl.to('.reveal-text-line span', {
        y: 0,
        stagger: 0.1,
        duration: 1.5,
        ease: 'expo.out'
    })
        .to('#hero-actions', {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'expo.out'
        }, '-=1');

    gsap.to('#scroll-line', {
        yPercent: 100,
        repeat: -1,
        duration: 1.5,
        ease: 'power2.inOut'
    });

    // Hero Depth Zoom
    gsap.to('#hero .container', {
        scale: 0.8,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    initMouseParallax();
    initMagneticButtons();
}

function initMouseParallax() {
    const hero = document.querySelector('#hero');
    if (!hero) return;

    hero.addEventListener('mousemove', (e: any) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth) - 0.5;
        const yPos = (clientY / window.innerHeight) - 0.5;

        gsap.to('.parallax-layer[data-speed]', {
            x: (i, t) => {
                const speed = parseFloat(t.getAttribute('data-speed') || '0.1');
                return xPos * (speed * 100);
            },
            y: (i, t) => {
                const speed = parseFloat(t.getAttribute('data-speed') || '0.1');
                return yPos * (speed * 100);
            },
            duration: 1,
            ease: 'power2.out'
        });
    });
}

function initMagneticButtons() {
    const magnetics = document.querySelectorAll('.magnetic');

    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', (e: any) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.4,
                ease: 'power2.out'
            });

            const content = btn.querySelector('span, i, div');
            if (content) {
                gsap.to(content, {
                    x: x * 0.2,
                    y: y * 0.2,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.3)'
            });
            const content = btn.querySelector('span, i, div');
            if (content) {
                gsap.to(content, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.3)'
                });
            }
        });
    });
}

function initParallax() {
    // Horizontal Portfolio Scroll
    const portfolioContainer = document.querySelector('#portfolio-container') as HTMLElement;
    if (portfolioContainer) {
        const portfolioItems = gsap.utils.toArray('.portfolio-item');

        gsap.to(portfolioItems, {
            xPercent: -100 * (portfolioItems.length - 1),
            ease: 'none',
            scrollTrigger: {
                id: 'portfolio-scroll',
                trigger: '#portfolio',
                start: 'top top',
                end: () => `+=${portfolioContainer.scrollWidth - window.innerWidth}`,
                pin: true,
                scrub: 1,
                snap: 1 / (portfolioItems.length - 1),
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });

        // Parallax for portfolio images
        gsap.utils.toArray('.portfolio-img').forEach((img: any) => {
            gsap.fromTo(img, {
                xPercent: -15
            }, {
                xPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: img.closest('.portfolio-item'),
                    containerAnimation: gsap.getById('portfolio-scroll'),
                    start: 'left right',
                    end: 'right left',
                    scrub: true
                }
            });
        });
    }

    // Section Entrances
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id === 'hero' || section.id === 'pricing' || section.id === 'services') return;

        gsap.from(section.querySelectorAll('h2, .container > *:not(.pricing-card)'), {
            y: 50,
            stagger: 0.1,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Pricing Entrance
    gsap.from('.pricing-card', {
        y: 50,
        stagger: 0.1,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
            trigger: '#pricing',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    });

    // Services Stagger
    gsap.from('.service-card', {
        y: 40,
        rotateX: -5,
        stagger: 0.05,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#services-grid',
            start: 'top 90%',
            toggleActions: 'play none none none'
        }
    });

    // Services Text Reveal
    gsap.from('#services .reveal-text', {
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#services',
            start: 'top 90%',
            toggleActions: 'play none none none'
        }
    });

    const layers = document.querySelectorAll('.parallax-layer');

    layers.forEach(layer => {
        const speed = parseFloat(layer.getAttribute('data-speed') || '0.1');
        gsap.to(layer, {
            y: (index, target) => {
                const rect = target.getBoundingClientRect();
                return window.innerHeight * speed;
            },
            ease: 'none',
            scrollTrigger: {
                trigger: layer,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // About Image Parallax
    gsap.to('.parallax-wrap .parallax-layer', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    // Sections split text reveal
    gsap.utils.toArray('h2').forEach((title: any) => {
        const split = new SplitType(title, { types: 'chars' });
        gsap.from(split.chars, {
            opacity: 0,
            y: 50,
            stagger: 0.05,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: title,
                start: 'top 85%'
            }
        });
    });

    // Pricing Cards Stagger
    gsap.from('.pricing-card', {
        y: 80,
        opacity: 1,
        stagger: 0.15,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#pricing',
            start: 'top 75%'
        }
    });
}

function initHorizontalScroll() {
    // Handled in initParallax now
}

function initMagneticElements() {
    const elements = document.querySelectorAll('.btn-primary, .btn-secondary, .glass, .portfolio-item, .pricing-card, .service-card');

    elements.forEach((el: any) => {
        el.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: x * 0.15,
                y: y * 0.15,
                rotateX: -y * 0.05,
                rotateY: x * 0.05,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

function initScrollProgress() {
    gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3
        }
    });
}

function initCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const targetValue = parseInt(counter.getAttribute('data-target') || '0');

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 90%',
            onEnter: () => {
                const target = { val: 0 };
                gsap.to(target, {
                    val: targetValue,
                    duration: 2,
                    ease: 'power3.out',
                    onUpdate: () => {
                        counter.innerHTML = Math.floor(target.val).toString();
                    }
                });
            }
        });
    });
}

function initTestimonialScroll() {
    const container = document.querySelector('.testimonials-scroll') as HTMLElement;
    if (!container) return;

    gsap.to(container, {
        xPercent: -50,
        repeat: -1,
        duration: 40,
        ease: 'none'
    });
}

function setupPortalFunctions() {
    const overlay = document.getElementById('portal-overlay')!;
    const authBtn = document.getElementById('auth-btn')!;
    const closeBtn = document.getElementById('close-portal')!;
    const loginForm = document.getElementById('login-form') as HTMLFormElement;
    const authView = document.getElementById('auth-view')!;
    const dashboardView = document.getElementById('dashboard-view')!;
    const ordersView = document.getElementById('orders-view')!;
    const chatView = document.getElementById('chat-view')!;
    const adminView = document.getElementById('admin-view')!;
    const settingsView = document.getElementById('settings-view')!;
    const logoutBtn = document.getElementById('logout-btn')!;

    const showOverlay = () => {
        overlay.classList.remove('hidden');
        gsap.fromTo(overlay, { opacity: 0, backdropFilter: 'blur(0px)' }, { opacity: 1, backdropFilter: 'blur(32px)', duration: 1.2, ease: 'expo.out' });
        if (currentUser) {
            showPortalView('dashboard');
        } else {
            showPortalView('auth');
        }
    };

    const hideOverlay = () => {
        gsap.to(overlay, {
            opacity: 0,
            backdropFilter: 'blur(0px)',
            duration: 0.8,
            ease: 'expo.in',
            onComplete: () => overlay.classList.add('hidden')
        });
    };

    authBtn.addEventListener('click', showOverlay);
    closeBtn.addEventListener('click', hideOverlay);

    const showPortalView = (viewName: string) => {
        authView.classList.add('hidden');
        dashboardView.classList.add('hidden');
        ordersView.classList.add('hidden');
        chatView.classList.add('hidden');
        adminView.classList.add('hidden');
        settingsView.classList.add('hidden');

        if (viewName === 'auth') authView.classList.remove('hidden');
        if (viewName === 'dashboard') dashboardView.classList.remove('hidden');
        if (viewName === 'orders') {
            ordersView.classList.remove('hidden');
            initOrdersView();
        }
        if (viewName === 'chat') {
            chatView.classList.remove('hidden');
            initStudioChat();
        }
        if (viewName === 'admin') {
            adminView.classList.remove('hidden');
            initAdminView();
        }
        if (viewName === 'settings') settingsView.classList.remove('hidden');

        document.querySelectorAll('#portal-nav button').forEach(b => {
            const btn = b as HTMLElement;
            if (btn.dataset.view === viewName) {
                btn.classList.add('bg-primary-accent', 'text-white', 'shadow-xl', 'shadow-primary-accent/20');
                btn.classList.remove('hover:bg-primary-accent/10');
            } else {
                btn.classList.remove('bg-primary-accent', 'text-white', 'shadow-xl', 'shadow-primary-accent/20');
                btn.classList.add('hover:bg-primary-accent/10');
            }
        });
    };

    document.querySelectorAll('#portal-nav button').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = (btn as HTMLElement).dataset.view;
            if (view) showPortalView(view);
        });
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (document.getElementById('login-email') as HTMLInputElement).value;
        const password = (document.getElementById('login-password') as HTMLInputElement).value;

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert('Access Denied: ' + error.message);
        } else {
            currentUser = data.user;
            await syncUserProfile(currentUser);
            updateHeaderAuth(currentUser);
            showPortalView('dashboard');
        }
    });

    logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        currentUser = null;
        userProfile = null;
        document.getElementById('admin-nav-btn')?.classList.add('hidden');
        authBtn.innerText = 'Access';
        showPortalView('auth');
        authView.classList.remove('hidden');
    });
}

async function syncUserProfile(user: any) {
    if (!user) return;
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (profile) {
        userProfile = profile;
        if (profile.role === 'admin') {
            document.getElementById('admin-nav-btn')?.classList.remove('hidden');
        }
    }
}

function updateHeaderAuth(user: any) {
    const authBtn = document.getElementById('auth-btn')!;
    authBtn.innerText = user.email.split('@')[0].toUpperCase();
}

async function initAdminView() {
    const inquiriesList = document.getElementById('admin-inquiries-list')!;
    const bookingsList = document.getElementById('admin-bookings-list')!;

    // Fetch Inquiries
    const { data: inquiries } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (inquiries) {
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
    }

    // Fetch Bookings
    const { data: bookings } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (bookings) {
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
    }

    refreshIcons();
}

async function initOrdersView() {
    const grid = document.getElementById('assets-grid')!;
    const trigger = document.getElementById('upload-trigger')!;
    const fileInput = document.getElementById('portal-file-input') as HTMLInputElement;

    const renderAssets = async () => {
        const { data } = await fetchFiles();
        // Clear previous assets (except trigger)
        const assets = grid.querySelectorAll('.asset-item');
        assets.forEach(a => a.remove());

        if (data) {
            data.forEach(file => {
                const div = document.createElement('div');
                div.className = 'asset-item glass p-10 rounded-[40px] flex flex-col items-center justify-between group h-full';
                div.innerHTML = `
                    <div class="w-16 h-16 bg-primary-accent/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i data-lucide="file-text" class="w-8 h-8 text-primary-accent"></i>
                    </div>
                    <p class="text-[10px] font-accent font-bold uppercase tracking-widest text-primary-accent opacity-60 truncate w-full text-center mb-4">${file.name}</p>
                    <a href="${supabase.storage.from('clients').getPublicUrl(file.name).data.publicUrl}" target="_blank" class="text-[10px] font-accent font-bold uppercase tracking-widest text-gold hover:opacity-100 opacity-40 transition-opacity">Retrieve</a>
                `;
                grid.appendChild(div);
            });
            refreshIcons();
        }
    };

    trigger.onclick = () => fileInput.click();
    fileInput.onchange = async () => {
        if (fileInput.files?.[0]) {
            await uploadFile(fileInput.files[0]);
            renderAssets();
        }
    };

    renderAssets();
}

async function initStudioChat() {
    const container = document.getElementById('chat-messages-container')!;
    const { data } = await fetchMessages();
    const chatForm = document.getElementById('chat-form') as HTMLFormElement;
    const fileInput = document.getElementById('chat-file-input') as HTMLInputElement;

    const renderMsg = (m: any) => `
        <div class="flex ${m.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}">
            <div class="max-w-[75%] ${m.sender_id === currentUser?.id ? 'bg-primary-accent text-white shadow-xl shadow-primary-accent/20' : 'bg-white border border-primary-accent/5 shadow-lg'} p-10 rounded-[40px]">
                <p class="font-display text-xl leading-relaxed">${m.content}</p>
                <div class="flex items-center justify-between mt-6">
                   <span class="text-[10px] font-accent uppercase tracking-widest opacity-30 block">${new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                   ${m.sender_id === currentUser?.id ? '<i data-lucide="check-check" class="w-4 h-4 opacity-30 text-white"></i>' : ''}
                </div>
            </div>
        </div>
    `;

    if (data) {
        container.innerHTML = data.map(renderMsg).join('');
        container.scrollTop = container.scrollHeight;
        refreshIcons();
    }

    if (chatForm) {
        chatForm.onsubmit = async (e) => {
            e.preventDefault();
            const input = document.getElementById('chat-input') as HTMLInputElement;
            const message = input.value.trim();
            if (!message) return;

            input.value = '';
            await sendMessage(message, currentUser.id);
        };
    }

    fileInput.onchange = async () => {
        if (fileInput.files?.[0]) {
            const { publicUrl } = await uploadFile(fileInput.files[0]);
            if (publicUrl) await sendMessage(`Digital Link Shared: ${publicUrl}`, currentUser.id);
        }
    };

    subscribeToMessages((payload: any) => {
        const m = payload.new;
        const msgDiv = document.createElement('div');
        msgDiv.innerHTML = renderMsg(m);
        container.appendChild(msgDiv.firstElementChild!);
        container.scrollTop = container.scrollHeight;
        refreshIcons();
    });
}

function setupGlobalForms() {
    // Mobile Menu
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('[data-mobile-link]');

    const openMenu = () => {
        if (!mobileMenu) return;
        lenis.stop();
        mobileMenu.classList.remove('translate-x-full');
        mobileMenu.classList.add('translate-x-0');
        gsap.from('#mobile-menu a', { x: 50, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'expo.out', delay: 0.2 });
    };

    const closeMenu = () => {
        if (!mobileMenu) return;
        lenis.start();
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('translate-x-full');
    };

    mobileMenuToggle?.addEventListener('click', openMenu);
    mobileMenuClose?.addEventListener('click', closeMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Contact Form
    const contactForm = document.querySelector('section#contact form') as HTMLFormElement;
    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const { error } = await supabase.from('contact_messages').insert([{
            name: formData.get('name'),
            email: formData.get('email'),
            service: formData.get('service'),
            budget: formData.get('budget'),
            message: formData.get('message')
        }]);

        if (error) {
            alert('Communication Interrupted: ' + error.message);
        } else {
            alert('Your inquiry has been synchronized with our servers. We will initiate contact soon.');
            contactForm.reset();
        }
    });

    // Dynamic Booking
    const bookingForm = document.getElementById('booking-form') as HTMLFormElement;
    bookingForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(bookingForm);
        const { error } = await supabase.from('bookings').insert([{
            service_type: formData.get('service'),
            meeting_date: formData.get('date'),
            requirements: formData.get('requirements'),
            status: 'pending'
        }]);

        if (error) {
            alert('Booking Error: ' + error.message);
        } else {
            alert('Your session request has been received. We will contact you shortly.');
            bookingForm.reset();
        }
    });

    // Header Logic
    let lastScroll = 0;
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        if (!header) return;
        const mobileMenu = document.getElementById('mobile-menu');
        const isMenuOpen = mobileMenu && !mobileMenu.classList.contains('pointer-events-none');

        const curr = window.pageYOffset;

        // Hide header on scroll down, show on scroll up
        if (curr > lastScroll && curr > 150 && !isMenuOpen) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        // Shrink header on scroll
        const nav = header.querySelector('nav');
        if (nav) {
            if (curr > 50) {
                nav.classList.add('bg-white/90', 'py-2');
                nav.classList.remove('bg-white/40', 'py-3');
            } else {
                nav.classList.remove('bg-white/90', 'py-2');
                nav.classList.add('bg-white/40', 'py-3');
            }
        }

        lastScroll = curr;
    }, { passive: true });

    // Handle Window Resize for ScrollTrigger
    let resizeTimer: any;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize UI Sections
    const grids = {
        services: document.getElementById('services-grid'),
        portfolio: document.getElementById('portfolio-container'),
        pricing: document.getElementById('pricing-grid'),
        testimonials: document.querySelector('.testimonials-scroll')
    };

    if (grids.services) renderServices(grids.services);
    if (grids.portfolio) renderPortfolio(grids.portfolio);
    if (grids.pricing) renderPricing(grids.pricing);
    if (grids.testimonials) renderTestimonials(grids.testimonials as HTMLElement);

    refreshIcons();

    // Auth Sync
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        currentUser = user;
        await syncUserProfile(user);
        updateHeaderAuth(user);
    }

    // Feature Initialization
    initLoader();
    initParallax();
    initMagneticButtons();
    initMagneticElements();
    initScrollProgress();
    initCounters();
    initTestimonialScroll();
    setupPortalFunctions();
    setupGlobalForms();

    ScrollTrigger.refresh();
});
