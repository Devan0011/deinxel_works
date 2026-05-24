import './index.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createIcons, icons } from 'lucide';
import SplitType from 'split-type';
import { initLenis } from './lib/lenis.ts';
import { renderServices, renderPortfolio, renderPricing, renderTestimonials } from './lib/ui.ts';
import { supabase } from './lib/supabase.ts';
import { fetchMessages, sendMessage, subscribeToMessages } from './lib/chat.ts';
import { fetchAdminSubmissions, submitBookingRequest, submitContactMessage, subscribeToAdminSubmissions, updateBookingStatus } from './lib/submissions.ts';
import { getBookingStatusWhatsAppUrl } from './lib/whatsapp.ts';

import { fetchFiles, getFileUrl, uploadFile } from './lib/storage.ts';

gsap.registerPlugin(ScrollTrigger);

// Initialize Smooth Scroll
const lenis = initLenis();

// State
let currentUser: any = null;
let userProfile: any = null;
let chatSubscription: any = null;
let adminSubscription: any = null;

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
    const authPanelTitle = document.getElementById('auth-panel-title')!;
    const signupNameField = document.getElementById('signup-name-field')!;
    const signupNameInput = document.getElementById('signup-name') as HTMLInputElement;
    const authSubmitLabel = document.getElementById('auth-submit-label')!;
    const authModeToggle = document.getElementById('auth-mode-toggle') as HTMLButtonElement;
    const authHelperCopy = document.getElementById('auth-helper-copy')!;
    const authView = document.getElementById('auth-view')!;
    const dashboardView = document.getElementById('dashboard-view')!;
    const ordersView = document.getElementById('orders-view')!;
    const chatView = document.getElementById('chat-view')!;
    const adminView = document.getElementById('admin-view')!;
    const settingsView = document.getElementById('settings-view')!;
    const logoutBtn = document.getElementById('logout-btn')!;
    let authMode: 'login' | 'signup' = 'login';

    const setAuthMode = (mode: 'login' | 'signup') => {
        authMode = mode;
        const isSignup = authMode === 'signup';

        signupNameField.classList.toggle('hidden', !isSignup);
        signupNameInput.required = isSignup;
        authPanelTitle.innerHTML = isSignup ? 'Client <span class="text-primary-accent">Sign Up</span>' : 'Client <span class="text-primary-accent">Entry</span>';
        authSubmitLabel.textContent = isSignup ? 'Create Client Access' : 'Initiate Synchronisation';
        authModeToggle.textContent = isSignup ? 'Already Have Access?' : 'Create Client Access';
        authHelperCopy.textContent = isSignup ? 'Create your client portal credentials' : 'Use your client credentials or create new access';
    };

    const showOverlay = () => {
        overlay.classList.remove('hidden');
        gsap.fromTo(overlay, { opacity: 0, backdropFilter: 'blur(0px)' }, { opacity: 1, backdropFilter: 'blur(32px)', duration: 1.2, ease: 'expo.out' });
        if (currentUser) {
            showPortalView('dashboard');
        } else {
            setAuthMode('login');
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
        if (viewName === 'dashboard') {
            dashboardView.classList.remove('hidden');
            initClientDashboard();
        }
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
        if (viewName === 'settings') {
            settingsView.classList.remove('hidden');
            initSettingsView();
        }

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

    authModeToggle.addEventListener('click', () => {
        setAuthMode(authMode === 'login' ? 'signup' : 'login');
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (document.getElementById('login-email') as HTMLInputElement).value.trim();
        const password = (document.getElementById('login-password') as HTMLInputElement).value;

        if (authMode === 'signup') {
            const fullName = signupNameInput.value.trim();
            if (!fullName || !email || password.length < 6) {
                alert('Please enter your name, email, and a password with at least 6 characters.');
                return;
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName }
                }
            });

            if (error) {
                alert('Sign Up Failed: ' + error.message);
                return;
            }

            if (data.user && data.session) {
                currentUser = data.user;
                await syncUserProfile(currentUser);
                updateHeaderAuth(currentUser);
                loginForm.reset();
                setAuthMode('login');
                showPortalView('dashboard');
                return;
            }

            alert('Client access created. Please confirm your email if Supabase email confirmation is enabled, then log in.');
            loginForm.reset();
            setAuthMode('login');
            return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert('Access Denied: ' + error.message);
        } else {
            currentUser = data.user;
            await syncUserProfile(currentUser);
            updateHeaderAuth(currentUser);
            loginForm.reset();
            showPortalView('dashboard');
        }
    });

    logoutBtn.addEventListener('click', async () => {
        if (chatSubscription) {
            await supabase.removeChannel(chatSubscription);
            chatSubscription = null;
        }
        if (adminSubscription) {
            await supabase.removeChannel(adminSubscription);
            adminSubscription = null;
        }
        await supabase.auth.signOut();
        currentUser = null;
        userProfile = null;
        document.getElementById('admin-nav-btn')?.classList.add('hidden');
        authBtn.innerText = 'Access';
        loginForm.reset();
        setAuthMode('login');
        showPortalView('auth');
        authView.classList.remove('hidden');
    });

    setAuthMode('login');
}

async function syncUserProfile(user: any) {
    if (!user) return;
    const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();

    if (profile) {
        userProfile = profile;
    } else if (!error) {
        const { data: createdProfile } = await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Client',
            role: 'user'
        }).select('*').single();
        userProfile = createdProfile || null;
    } else {
        console.warn('Profile sync failed:', error.message);
        userProfile = null;
    }

    if (userProfile?.role === 'admin') {
        document.getElementById('admin-nav-btn')?.classList.remove('hidden');
    } else {
        document.getElementById('admin-nav-btn')?.classList.add('hidden');
    }
}

function updateHeaderAuth(user: any) {
    const authBtn = document.getElementById('auth-btn')!;
    authBtn.innerText = user.email.split('@')[0].toUpperCase();
}

async function initClientDashboard() {
    if (!currentUser) return;

    const dashboardView = document.getElementById('dashboard-view');
    const statValues = dashboardView?.querySelectorAll('.grid.grid-cols-2 .font-display.group-hover\\:scale-110, .grid.grid-cols-2 .font-display.group-hover\\:scale-110.transition-transform');
    const projectList = document.getElementById('project-list');

    const [{ data: orders }, { data: bookings }, { data: files }] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false }),
        supabase.from('bookings').select('*').or(`user_id.eq.${currentUser.id},email.eq.${currentUser.email}`).order('created_at', { ascending: false }),
        fetchFiles('clients', currentUser.id)
    ]);

    if (statValues?.[0]) statValues[0].textContent = String(files?.length || 0).padStart(2, '0');
    if (statValues?.[1]) statValues[1].textContent = String((orders?.length || 0) + (bookings?.length || 0)).padStart(2, '0');
    if (statValues?.[2]) statValues[2].textContent = (orders?.some((order: any) => order.status !== 'completed' && order.status !== 'delivered') || bookings?.some((booking: any) => booking.status === 'pending')) ? 'Active' : 'Ready';

    if (projectList) {
        const items = [
            ...(orders || []).map((order: any) => ({
                title: order.title || order.project_name || 'Client Project',
                phase: statusLabel(order.status),
                progress: Number(order.progress ?? (order.status === 'completed' || order.status === 'delivered' ? 100 : 50))
            })),
            ...(bookings || []).map((booking: any) => ({
                title: booking.service_type || booking.project_type || 'Session Request',
                phase: statusLabel(booking.status),
                progress: booking.status === 'approved' ? 35 : booking.status === 'completed' ? 100 : 12
            }))
        ];

        projectList.innerHTML = items.length ? items.map(item => `
            <div class="group p-6 sm:p-10 bg-primary-accent/5 rounded-[24px] sm:rounded-[40px] border border-primary-accent/5 hover:border-primary-accent/20 transition-all duration-700">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 sm:gap-10">
                    <div class="flex items-center gap-6 sm:gap-10">
                        <div class="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-[18px] sm:rounded-3xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                            <i data-lucide="layout" class="w-8 h-8 sm:w-10 sm:h-10 text-primary-accent"></i>
                        </div>
                        <div>
                            <h4 class="text-xl sm:text-2xl font-display font-medium tracking-tight">${escapeHtml(item.title)}</h4>
                            <p class="text-[8px] sm:text-[10px] font-accent uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-40 mt-1 sm:mt-2 italic">Phase: ${escapeHtml(item.phase)}</p>
                        </div>
                    </div>
                    <div class="flex flex-col items-end gap-3 sm:gap-4 md:min-w-[240px]">
                        <div class="w-full h-1 bg-primary-accent/10 rounded-full overflow-hidden">
                            <div class="h-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" style="width: ${Math.min(100, Math.max(0, item.progress))}%"></div>
                        </div>
                        <p class="text-[8px] sm:text-[10px] font-accent font-bold text-gold tracking-widest">${Math.round(item.progress)}% SYNCED</p>
                    </div>
                </div>
            </div>
        `).join('') : '<p class="text-[9px] sm:text-[10px] font-accent uppercase tracking-widest opacity-40">No project activity yet. Start an inquiry and it will appear here.</p>';
    }

    refreshIcons();
}

function initSettingsView() {
    if (!currentUser) return;
    const settingsView = document.getElementById('settings-view');
    const nameInput = settingsView?.querySelector('input[type="text"]') as HTMLInputElement | null;
    const emailInput = settingsView?.querySelector('input[type="email"]') as HTMLInputElement | null;
    const saveButton = settingsView?.querySelector('button') as HTMLButtonElement | null;

    if (nameInput) nameInput.value = userProfile?.full_name || currentUser.email?.split('@')[0] || '';
    if (emailInput) emailInput.value = currentUser.email || '';

    if (saveButton) {
        saveButton.onclick = async () => {
            const fullName = nameInput?.value.trim() || currentUser.email?.split('@')[0] || 'Client';
            const { data, error } = await supabase.from('profiles').upsert({
                id: currentUser.id,
                email: currentUser.email,
                full_name: fullName,
                role: userProfile?.role || 'user'
            }).select('*').single();

            if (error) {
                alert('Configuration update failed: ' + error.message);
                return;
            }

            userProfile = data;
            alert('Secure configurations updated.');
        };
    }
}

async function initAdminView() {
    const inquiriesList = document.getElementById('admin-inquiries-list')!;
    const bookingsList = document.getElementById('admin-bookings-list')!;

    if (userProfile?.role !== 'admin') {
        inquiriesList.innerHTML = '<p class="text-[9px] sm:text-[10px] font-accent uppercase tracking-widest opacity-40">Admin access is required to view inquiries.</p>';
        bookingsList.innerHTML = '<p class="text-[9px] sm:text-[10px] font-accent uppercase tracking-widest opacity-40">Admin access is required to view session requests.</p>';
        return;
    }

    const { inquiries, inquiriesError, bookings, bookingsError } = await fetchAdminSubmissions();

    if (inquiriesError) {
        inquiriesList.innerHTML = `<p class="text-[9px] sm:text-[10px] font-accent uppercase tracking-widest opacity-40">Unable to load inquiries: ${escapeHtml(inquiriesError.message)}</p>`;
    } else if (inquiries?.length) {
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
        inquiriesList.innerHTML = '<p class="text-[9px] sm:text-[10px] font-accent uppercase tracking-widest opacity-40">No inquiries found.</p>';
    }

    if (bookingsError) {
        bookingsList.innerHTML = `<p class="text-[9px] sm:text-[10px] font-accent uppercase tracking-widest opacity-40">Unable to load session requests: ${escapeHtml(bookingsError.message)}</p>`;
    } else if (bookings?.length) {
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
                    <button data-booking-action="completed" data-booking-id="${b.id}" class="flex-1 py-3 glass rounded-2xl text-[9px] font-accent font-bold uppercase tracking-widest text-gold hover:bg-gold hover:text-white transition-all">Complete</button>
                </div>
            </div>
        `).join('');
    } else {
        bookingsList.innerHTML = '<p class="text-[9px] sm:text-[10px] font-accent uppercase tracking-widest opacity-40">No session requests found.</p>';
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

async function initOrdersView() {
    const grid = document.getElementById('assets-grid')!;
    const trigger = document.getElementById('upload-trigger')!;
    const fileInput = document.getElementById('portal-file-input') as HTMLInputElement;
    if (!currentUser) return;

    const renderAssets = async () => {
        const { data, error } = await fetchFiles('clients', currentUser.id);
        // Clear previous assets (except trigger)
        const assets = grid.querySelectorAll('.asset-item');
        assets.forEach(a => a.remove());

        if (error) {
            const div = document.createElement('div');
            div.className = 'asset-item glass p-10 rounded-[40px] flex flex-col items-center justify-center text-center';
            div.innerHTML = `<p class="text-[10px] font-accent font-bold uppercase tracking-widest text-red-600 opacity-60">Asset sync failed: ${escapeHtml(error.message)}</p>`;
            grid.appendChild(div);
            return;
        }

        if (data?.length) {
            data.forEach(file => {
                const div = document.createElement('div');
                div.className = 'asset-item glass p-10 rounded-[40px] flex flex-col items-center justify-between group h-full';
                const path = `${currentUser.id}/${file.name}`;
                div.innerHTML = `
                    <div class="w-16 h-16 bg-primary-accent/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i data-lucide="file-text" class="w-8 h-8 text-primary-accent"></i>
                    </div>
                    <p class="text-[10px] font-accent font-bold uppercase tracking-widest text-primary-accent opacity-60 truncate w-full text-center mb-4">${escapeHtml(file.name)}</p>
                    <a href="${getFileUrl(path)}" target="_blank" rel="noopener noreferrer" class="text-[10px] font-accent font-bold uppercase tracking-widest text-gold hover:opacity-100 opacity-40 transition-opacity">Retrieve</a>
                `;
                grid.appendChild(div);
            });
            refreshIcons();
        } else {
            const div = document.createElement('div');
            div.className = 'asset-item glass p-10 rounded-[40px] flex flex-col items-center justify-center text-center';
            div.innerHTML = '<p class="text-[10px] font-accent font-bold uppercase tracking-widest text-primary-accent opacity-40">No assets uploaded yet.</p>';
            grid.appendChild(div);
        }
    };

    trigger.onclick = () => fileInput.click();
    fileInput.onchange = async () => {
        if (fileInput.files?.[0]) {
            const { error } = await uploadFile(fileInput.files[0], { userId: currentUser.id });
            if (error) {
                alert('Asset upload failed: ' + error.message);
                return;
            }
            fileInput.value = '';
            renderAssets();
        }
    };

    renderAssets();
}

async function initStudioChat() {
    const container = document.getElementById('chat-messages-container')!;
    const chatForm = document.getElementById('chat-form') as HTMLFormElement;
    const fileInput = document.getElementById('chat-file-input') as HTMLInputElement;
    if (!currentUser) return;
    const isAdmin = userProfile?.role === 'admin';
    const { data, error } = await fetchMessages(currentUser.id, isAdmin);

    const renderMsg = (m: any) => `
        <div class="flex ${m.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}">
            <div class="max-w-[75%] ${m.sender_id === currentUser?.id ? 'bg-primary-accent text-white shadow-xl shadow-primary-accent/20' : 'bg-white border border-primary-accent/5 shadow-lg'} p-10 rounded-[40px]">
                <p class="font-display text-xl leading-relaxed whitespace-pre-line">${escapeHtml(m.content)}</p>
                ${m.file_url ? `<a href="${escapeHtml(m.file_url)}" target="_blank" rel="noopener noreferrer" class="inline-block mt-5 text-[10px] font-accent uppercase tracking-widest ${m.sender_id === currentUser?.id ? 'text-white/70' : 'text-gold'} hover:opacity-100 opacity-70">Open shared file</a>` : ''}
                <div class="flex items-center justify-between mt-6">
                   <span class="text-[10px] font-accent uppercase tracking-widest opacity-30 block">${new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                   ${m.sender_id === currentUser?.id ? '<i data-lucide="check-check" class="w-4 h-4 opacity-30 text-white"></i>' : ''}
                </div>
            </div>
        </div>
    `;

    if (error) {
        container.innerHTML = `<p class="text-[10px] font-accent uppercase tracking-widest opacity-40">Chat sync failed: ${escapeHtml(error.message)}</p>`;
    } else if (data?.length) {
        container.innerHTML = data.map(renderMsg).join('');
        container.scrollTop = container.scrollHeight;
        refreshIcons();
    } else {
        container.innerHTML = '<p class="text-[10px] font-accent uppercase tracking-widest opacity-40">No messages yet. Start the conversation below.</p>';
    }

    if (chatForm) {
        chatForm.onsubmit = async (e) => {
            e.preventDefault();
            const input = document.getElementById('chat-input') as HTMLInputElement;
            const message = input.value.trim();
            if (!message) return;

            input.value = '';
            const { error } = await sendMessage(message, currentUser.id);
            if (error) {
                alert('Message delivery failed: ' + error.message);
                input.value = message;
            } else {
                const msgDiv = document.createElement('div');
                msgDiv.innerHTML = renderMsg({ sender_id: currentUser.id, content: message, created_at: new Date().toISOString() });
                container.appendChild(msgDiv.firstElementChild!);
                container.scrollTop = container.scrollHeight;
                refreshIcons();
            }
        };
    }

    fileInput.onchange = async () => {
        if (fileInput.files?.[0]) {
            const { publicUrl, error } = await uploadFile(fileInput.files[0], { userId: currentUser.id, folder: `${currentUser.id}/chat` });
            if (error) {
                alert('File share failed: ' + error.message);
                return;
            }
            if (publicUrl) {
                const content = `Digital Link Shared: ${publicUrl}`;
                const { error: messageError } = await sendMessage(content, currentUser.id, null, publicUrl);
                if (messageError) {
                    alert('File message delivery failed: ' + messageError.message);
                    return;
                }
                const msgDiv = document.createElement('div');
                msgDiv.innerHTML = renderMsg({ sender_id: currentUser.id, content, file_url: publicUrl, created_at: new Date().toISOString() });
                container.appendChild(msgDiv.firstElementChild!);
                container.scrollTop = container.scrollHeight;
                refreshIcons();
                fileInput.value = '';
            }
        }
    };

    if (chatSubscription) {
        await supabase.removeChannel(chatSubscription);
    }

    chatSubscription = subscribeToMessages((payload: any) => {
        const m = payload.new;
        const msgDiv = document.createElement('div');
        msgDiv.innerHTML = renderMsg(m);
        container.appendChild(msgDiv.firstElementChild!);
        container.scrollTop = container.scrollHeight;
        refreshIcons();
    }, (message) => {
        if (isAdmin) return true;
        return message.sender_id === currentUser.id || message.recipient_id === currentUser.id;
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
    const contactForm = document.querySelector('section#contact form:not(#booking-form)') as HTMLFormElement;
    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const submitButtons = Array.from(contactForm.querySelectorAll<HTMLButtonElement>('button[type="submit"]'));
        submitButtons.forEach(button => button.disabled = true);
        const { error } = await submitContactMessage({
            name: String(formData.get('name') || '').trim(),
            email: String(formData.get('email') || '').trim(),
            service: String(formData.get('service') || '').trim(),
            budget: String(formData.get('budget') || '').trim(),
            message: String(formData.get('message') || '').trim()
        });
        submitButtons.forEach(button => button.disabled = false);

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
        const submitButtons = Array.from(bookingForm.querySelectorAll<HTMLButtonElement>('button[type="submit"]'));
        const getField = (name: string) => String(formData.get(name) || '').trim();
        const projectType = getField('project_type') || 'Custom Project';
        const email = getField('email');
        if (!getField('name') || !email || !getField('project_details')) {
            alert('Please share your name, email, and project details before sending the inquiry.');
            return;
        }
        const inquiryDetails = [
            ['Full Name', getField('name')],
            ['Email Address', email],
            ['Phone Number', getField('phone')],
            ['Company / Brand Name', getField('company')],
            ['Project Type', projectType],
            ['Budget Range', getField('budget')],
            ['Project Details', getField('project_details')],
            ['Timeline', getField('timeline')],
            ['Additional Requirements', getField('additional_requirements')]
        ]
            .filter(([, value]) => value)
            .map(([label, value]) => `${label}: ${value}`)
            .join('\n\n');

        const bookingPayload = {
            user_id: currentUser?.id || null,
            name: getField('name'),
            email,
            phone: getField('phone'),
            company: getField('company'),
            service_type: projectType,
            project_type: projectType,
            budget: getField('budget'),
            timeline: getField('timeline'),
            requirements: inquiryDetails
        };

        submitButtons.forEach(button => button.disabled = true);
        const { bookingError, contactError } = await submitBookingRequest(bookingPayload);
        submitButtons.forEach(button => button.disabled = false);

        if (bookingError) {
            alert('Booking Error: ' + bookingError.message);
        } else if (contactError) {
            alert('Your session request was received, but inquiry mirroring failed: ' + contactError.message);
            bookingForm.reset();
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
