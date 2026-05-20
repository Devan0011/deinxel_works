export const renderServices = (container: HTMLElement) => {
  const services = [
    {
      icon: 'Monitor',
      title: 'Premium Website Design & Development',
      desc: 'Modern websites designed to create a strong digital presence with visually immersive layouts and smooth user experiences.',
      sections: [
        {
          label: 'Features',
          items: ['Fully Responsive Design', 'Premium Modern UI', 'Mobile-First Layouts', 'Fast Loading Performance', 'Interactive Sections', 'Smooth Scrolling Experience', 'SEO-Friendly Structure', 'Cross-Browser Compatibility', 'Scalable Architecture', 'Clean & Organized Code']
        },
        {
          label: 'Included',
          items: ['Homepage Design', 'About Section', 'Services Section', 'Portfolio Showcase', 'Contact System', 'Booking Forms', 'CTA Sections', 'Footer Design', 'Custom Layouts']
        },
        {
          label: 'Perfect For',
          items: ['Businesses', 'Startups', 'Agencies', 'Cafes & Restaurants', 'Creators', 'Personal Brands', 'Portfolios']
        }
      ]
    },
    {
      icon: 'Layout',
      title: 'Modern UI/UX Design',
      desc: 'Beautiful and intuitive user interfaces designed to improve engagement and deliver seamless digital experiences.',
      sections: [
        {
          label: 'Design Focus',
          items: ['Clean Layout Structure', 'Premium Typography', 'Smooth User Navigation', 'Modern Color Systems', 'Interactive Components', 'Elegant Spacing & Alignment', 'Consistent Visual Identity']
        },
        {
          label: 'UI Features',
          items: ['Minimal Modern Design', 'Dynamic Layouts', 'Interactive Hover Effects', 'Scroll-Based Animations', 'Modern Cards & Sections', 'Advanced Visual Hierarchy']
        },
        {
          label: 'Result',
          items: ['A visually attractive and user-friendly experience that keeps visitors engaged.']
        }
      ]
    },
    {
      icon: 'Code',
      title: 'Full Stack Web Development',
      desc: 'Complete frontend and backend solutions built with modern technologies and scalable systems.',
      sections: [
        {
          label: 'Frontend Technologies',
          items: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vite', 'Tailwind CSS']
        },
        {
          label: 'Backend Technologies',
          items: ['Node.js', 'Express.js', 'Supabase']
        },
        {
          label: 'Development Features',
          items: ['Authentication Systems', 'Database Integration', 'API Development', 'Dynamic Content Systems', 'Secure Backend Architecture', 'Cloud-Based Infrastructure', 'Real-Time Data Handling']
        },
        {
          label: 'Benefits',
          items: ['High Performance', 'Scalable Structure', 'Better Security', 'Future-Ready Systems', 'Easy Maintenance']
        }
      ]
    },
    {
      icon: 'PanelsTopLeft',
      title: 'Admin Dashboard Systems',
      desc: 'Powerful dashboard systems designed to give complete control over website content and business operations.',
      sections: [
        {
          label: 'Dashboard Features',
          items: ['Content Management', 'User Management', 'Product Management', 'Booking Management', 'Order Tracking', 'Media Upload System', 'Analytics Dashboard', 'Real-Time Updates', 'Secure Login System', 'Role-Based Access']
        },
        {
          label: 'Dashboard Experience',
          items: ['Modern Admin UI', 'Fast Navigation', 'Clean Interface', 'Smart Data Management', 'Easy Content Editing']
        },
        {
          label: 'Ideal For',
          items: ['Business Websites', 'E-Commerce Platforms', 'Booking Systems', 'Client Portals', 'Management Systems']
        }
      ]
    },
    {
      icon: 'ShoppingBag',
      title: 'E-Commerce Development',
      desc: 'Modern online stores built for performance, security, and smooth customer experiences.',
      sections: [
        {
          label: 'E-Commerce Features',
          items: ['Product Catalog', 'Shopping Cart', 'Secure Checkout', 'Payment Integration', 'Order Management', 'Inventory Tracking', 'Customer Dashboard', 'Mobile Shopping Experience', 'Wishlist System', 'Product Search & Filters']
        },
        {
          label: 'Store Experience',
          items: ['Smooth User Journey', 'Fast Product Browsing', 'Modern Product Pages', 'Optimized Checkout Flow']
        },
        {
          label: 'Perfect For',
          items: ['Fashion Brands', 'Product Businesses', 'Cafes & Bakeries', 'Digital Stores', 'Lifestyle Brands']
        }
      ]
    },
    {
      icon: 'RadioTower',
      title: 'Real-Time Features & Interactive Systems',
      desc: 'Interactive web experiences powered by real-time technologies and dynamic communication systems.',
      sections: [
        {
          label: 'Real-Time Features',
          items: ['Live Chat Systems', 'Instant Notifications', 'Real-Time Messaging', 'Dynamic Content Updates', 'Collaborative Features', 'Live Data Synchronization']
        },
        {
          label: 'Interactive Experience',
          items: ['Faster Communication', 'Better User Engagement', 'Dynamic User Experience', 'Seamless Interaction']
        },
        {
          label: 'Use Cases',
          items: ['Support Platforms', 'Team Systems', 'Social Platforms', 'Client Communication']
        }
      ]
    },
    {
      icon: 'Sparkles',
      title: 'Parallax Effects & Premium Animations',
      desc: 'Cinematic scrolling experiences and modern animations designed to create immersive web interactions.',
      sections: [
        {
          label: 'Animation Features',
          items: ['Layered Parallax Scrolling', 'Motion-Based Sections', 'Smooth Page Transitions', 'Text Reveal Effects', 'Interactive Hover Animations', 'Dynamic Scroll Effects', 'Image Layer Animations', 'Floating Elements', 'Smooth Motion Experience']
        },
        {
          label: 'Visual Impact',
          items: ['Premium Feel', 'Modern User Experience', 'Higher User Engagement', 'Cinematic Website Flow']
        }
      ]
    },
    {
      icon: 'Gauge',
      title: 'SEO & Performance Optimization',
      desc: 'Optimized websites designed for speed, visibility, and better search rankings.',
      sections: [
        {
          label: 'Optimization Includes',
          items: ['Fast Loading Speed', 'Optimized Assets', 'SEO-Friendly Structure', 'Mobile Optimization', 'Semantic HTML', 'Accessibility Improvements', 'Better Performance Scores', 'Lightweight Architecture']
        },
        {
          label: 'Benefits',
          items: ['Better Search Visibility', 'Improved User Retention', 'Higher Performance', 'Enhanced User Experience']
        }
      ]
    },
    {
      icon: 'Wrench',
      title: 'Maintenance & Technical Support',
      desc: 'Reliable support and maintenance services to keep your website updated, secure, and performing at its best.',
      sections: [
        {
          label: 'Support Includes',
          items: ['Bug Fixes', 'Security Updates', 'Performance Monitoring', 'Feature Enhancements', 'Content Updates', 'Technical Assistance', 'Optimization Improvements']
        },
        {
          label: 'Goal',
          items: ['Ensuring long-term stability, performance, and growth for your digital platform.']
        }
      ]
    }
  ];

  container.innerHTML = services.map((s, i) => `
    <div class="service-card group p-6 sm:p-8 md:p-10 lg:p-12 relative overflow-hidden transition-all duration-700 bg-white/[0.12] backdrop-blur-md border border-white/5 flex flex-col justify-between min-h-[520px] hover:bg-white/[0.18] hover:border-white/10" data-index="${i}">
        <!-- Texture & Depth -->
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-gold/[0.15] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div class="absolute -top-32 -left-32 w-80 h-80 bg-gold/15 blur-[140px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        
        <!-- Hover Scanner -->
        <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent -translate-y-full group-hover:translate-y-[600px] transition-transform duration-[3000ms] ease-in-out opacity-0 group-hover:opacity-100"></div>

        <div class="relative z-10 flex flex-col h-full">
            <div class="flex justify-between items-start mb-10 sm:mb-12">
                <div class="flex flex-col gap-1 text-white">
                    <span class="text-[8px] font-accent font-bold text-gold opacity-100 tracking-[0.6em] mb-1">WHAT I OFFER</span>
                    <div class="flex items-baseline gap-2">
                        <span class="text-3xl sm:text-4xl font-display italic text-white/40 group-hover:text-gold transition-colors duration-700">${String(i + 1).padStart(2, '0')}</span>
                        <div class="w-8 sm:w-10 h-[1px] bg-white/30 group-hover:bg-gold/40 transition-colors duration-700"></div>
                    </div>
                </div>
                <div class="w-12 h-12 sm:w-14 sm:h-14 glass rounded-[18px] sm:rounded-[22px] flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/50 transition-all duration-700 shadow-2xl border border-white/20 shrink-0">
                    <i data-lucide="${s.icon}" class="w-6 h-6 sm:w-7 sm:h-7 text-gold group-hover:scale-110 transition-transform duration-700"></i>
                </div>
            </div>

            <div class="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
                <h3 class="text-2xl sm:text-3xl md:text-4xl group-hover:translate-x-3 transition-transform duration-700 text-white font-display italic tracking-tight leading-[0.95]">${s.title}</h3>
                <p class="text-white text-sm sm:text-base leading-relaxed group-hover:text-white transition-colors duration-700 font-display italic max-w-[95%] opacity-80 group-hover:opacity-100">${s.desc}</p>
            </div>
            
            <div class="mt-auto">
                <div class="space-y-6 mb-10 sm:mb-12">
                    ${s.sections.map(section => `
                        <div class="space-y-3">
                            <h4 class="text-[8px] sm:text-[9px] font-accent font-bold uppercase tracking-[0.35em] text-gold/80">${section.label}</h4>
                            <ul class="flex flex-wrap gap-2">
                                ${section.items.map(item => `
                                    <li class="text-[9px] sm:text-[10px] font-accent font-bold uppercase tracking-[0.16em] leading-relaxed text-white/80 group-hover:text-white border border-white/10 bg-white/[0.04] px-3 py-2 rounded-full transition-all duration-500 group-hover:border-gold/20 group-hover:bg-white/[0.08]">
                                        ${item}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
                
                <div class="pt-6 sm:pt-8 border-t border-white/20 flex items-center justify-between opacity-90 group-hover:opacity-100 transition-all duration-700">
                    <div class="flex flex-col gap-1">
                        <span class="text-[8px] font-accent font-bold uppercase tracking-[0.4em] text-white/80">Digital Solution</span>
                        <span class="text-[9px] font-accent font-bold uppercase tracking-widest text-gold opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">Start Project</span>
                    </div>
                    <div class="flex items-center gap-4">
                         <div class="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-700 group-hover:rotate-45 shadow-lg group-hover:shadow-gold/20">
                            <i data-lucide="arrow-right" class="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-ink"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `).join('');
};

export const renderPortfolio = (container: HTMLElement) => {
  const projects = [
    { title: 'Nexus Hub', category: 'Systems Architecture', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', color: 'rgba(0, 70, 67, 0.4)' },
    { title: 'Ethereal Lux', category: 'Luxury Commerce', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800', color: 'rgba(212, 175, 55, 0.4)' },
    { title: 'Alterra AI', category: 'Digital Narrative', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800', color: 'rgba(0, 70, 67, 0.4)' },
    { title: 'Velvet Studio', category: 'Immersive UI', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800', color: 'rgba(212, 175, 55, 0.4)' },
    { title: 'Horizon', category: 'Growth Strategy', img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800', color: 'rgba(0, 70, 67, 0.4)' }
  ];

  container.innerHTML = projects.map((p, i) => `
    <div class="portfolio-item shrink-0 w-[90vw] sm:w-[85vw] md:w-[65vw] lg:w-[50vw] group cursor-pointer relative">
        <div class="parallax-wrap relative overflow-hidden rounded-[30px] sm:rounded-[40px] md:rounded-[80px] h-[50vh] sm:h-[60vh] md:h-[75vh] shadow-[0_60px_120px_rgba(0,46,43,0.15)] bg-primary-accent/5">
            <img src="${p.img}" class="portfolio-img absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 scale-125 group-hover:scale-100 transition-all duration-[2500ms] ease-out opacity-40 group-hover:opacity-100">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <!-- Layered Content -->
            <div class="absolute inset-0 p-6 sm:p-8 md:p-16 lg:p-24 flex flex-col justify-end text-white">
                <div class="space-y-3 sm:space-y-4 md:space-y-8 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-1000">
                    <span class="text-[9px] md:text-[10px] font-accent font-bold uppercase tracking-[0.4em] sm:tracking-[0.6em] text-gold">${p.category}</span>
                    <h3 class="text-3xl sm:text-4xl md:text-6xl lg:text-8xl italic font-display leading-[0.85] tracking-tighter">${p.title}</h3>
                    <p class="text-sm sm:text-base md:text-lg lg:text-2xl font-display italic opacity-60 max-w-xl line-clamp-2 md:line-clamp-none">Bespoke technical production and immersive sensory design for the next evolution of digital products.</p>
                    <div class="pt-4 sm:pt-6 md:pt-10">
                        <button class="btn-primary border-gold bg-gold hover:bg-white hover:border-white px-6 sm:px-8 py-2.5 sm:py-3 text-[9px] md:text-[10px]"><span>Explore Legacy</span></button>
                    </div>
                </div>
            </div>

            <!-- Floating Badge -->
            <div class="absolute top-6 right-6 sm:top-8 sm:right-8 md:top-16 md:right-16 w-14 h-14 sm:w-20 sm:h-20 md:w-32 md:h-32 glass border-white/20 rounded-full flex items-center justify-center text-white/10 font-display text-2xl sm:text-3xl md:text-5xl italic group-hover:text-gold transition-colors duration-1000">
                0${i + 1}
            </div>
            
            <!-- Interactive Overlay -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mix-blend-soft-light" style="background: radial-gradient(circle at center, ${p.color}, transparent)"></div>
        </div>
    </div>
  `).join('');
};

export const renderPricing = (container: HTMLElement) => {
  const plans = [
    {
      id: 'plan-essential',
      name: 'Essential Plan',
      idealFor: 'Personal brands, startups, and small businesses looking for a clean and professional online presence.',
      included: ['Modern Responsive Website', 'Up To 5 Custom Pages', 'Premium Landing Page Design', 'Mobile Optimization', 'Contact Form Setup', 'Social Media Integration', 'Smooth Scroll Experience', 'Basic SEO Optimization', 'Fast Loading Performance', 'Clean UI Design'],
      experience: 'Simple. Elegant. Professional.',
      bestFor: ['Personal Portfolios', 'Startup Websites', 'Landing Pages', 'Small Business Websites'],
      accent: false,
      tag: 'Foundation',
      icon: 'Gem'
    },
    {
      id: 'plan-growth',
      name: 'Growth Plan',
      idealFor: 'Businesses and brands looking for advanced features and stronger online engagement.',
      included: ['Everything in Essential', 'Up To 10+ Pages', 'Premium UI/UX Experience', 'Dynamic Website Features', 'Admin Dashboard', 'Booking & Inquiry System', 'Database Integration', 'Advanced Animations', 'Performance Optimization', 'Interactive Components', 'SEO Structure Optimization'],
      experience: 'Interactive. Modern. Scalable.',
      bestFor: ['Business Websites', 'Agency Platforms', 'Service Websites', 'Creative Brands'],
      accent: true,
      tag: 'Most Popular',
      icon: 'Rocket'
    },
    {
      id: 'plan-elite',
      name: 'Elite Plan',
      idealFor: 'Brands and businesses that need immersive experiences and advanced web systems.',
      included: ['Everything in Growth', 'Full Custom Web Application', 'Real-Time Features', 'Authentication System', 'Custom Dashboard', 'Advanced Database Architecture', 'API Integration', 'Layered Parallax Effects', 'Premium Motion Animations', 'E-Commerce Features', 'Analytics Dashboard', 'Cloud Deployment', 'Priority Technical Support'],
      experience: 'Premium. Powerful. Future-Ready.',
      bestFor: ['E-Commerce Platforms', 'SaaS Projects', 'Real-Time Applications', 'Enterprise-Level Websites'],
      accent: false,
      tag: 'Advanced',
      icon: 'Crown'
    }
  ];

  const enterpriseFeatures = ['Fully Customized Architecture', 'Advanced Backend Systems', 'High-Level Security', 'Large Scale Database Design', 'Real-Time Infrastructure', 'Business Automation', 'Dedicated Development Support', 'Ongoing Maintenance & Optimization'];
  const enterpriseSuitableFor = ['Enterprise Platforms', 'Large Business Systems', 'Advanced Web Applications', 'High Traffic Platforms'];
  const standouts = [
    { icon: 'Palette', title: 'Premium Visual Design', text: 'Modern layouts with immersive user experiences.' },
    { icon: 'Zap', title: 'High-Speed Performance', text: 'Optimized architecture for faster loading and smoother interaction.' },
    { icon: 'Layers', title: 'Scalable Technology', text: 'Built using future-ready development practices.' },
    { icon: 'MousePointerClick', title: 'Modern User Experience', text: 'Interactive sections, animations, and responsive layouts.' },
    { icon: 'ShieldCheck', title: 'Secure Development', text: 'Clean, scalable, and secure code structure.' },
    { icon: 'Headphones', title: 'Reliable Support', text: 'Continuous communication and technical assistance.' }
  ];
  const addOns = ['Advanced Admin Features', 'Real-Time Chat System', 'Payment Gateway Integration', 'Multi-Language Support', 'Blog System', 'Custom API Development', 'E-Commerce Features', 'SEO Growth Optimization', 'Premium Motion Effects', 'Long-Term Maintenance'];

  container.innerHTML = plans.map((p, i) => `
    <div id="${p.id}" class="pricing-card group p-8 sm:p-10 md:p-12 rounded-[30px] sm:rounded-[40px] md:rounded-[56px] transition-all duration-700 ${p.accent ? 'bg-white text-ink shadow-[0_60px_120px_rgba(0,0,0,0.4)] lg:scale-[1.02] z-10' : 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20'} overflow-hidden relative flex flex-col h-full" data-index="${i}">
        <!-- Texture Overlay -->
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        
        <div class="flex justify-between items-start mb-10 sm:mb-12 relative z-10">
            <div>
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${p.accent ? 'bg-primary-accent' : 'bg-gold'} shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
                    <span class="text-[8px] sm:text-[9px] font-accent font-bold uppercase tracking-[0.4em] ${p.accent ? 'text-primary-accent/70' : 'text-gold'}">${p.tag}</span>
                </div>
                <h3 class="text-4xl sm:text-5xl md:text-6xl italic font-display tracking-tighter leading-[0.9]">${p.name}</h3>
            </div>
            <div class="w-12 h-12 sm:w-14 sm:h-14 ${p.accent ? 'bg-primary-accent text-white' : 'glass text-gold border-white/20'} rounded-[18px] sm:rounded-[20px] flex items-center justify-center shadow-2xl rotate-3 group-hover:rotate-12 transition-transform">
                <i data-lucide="${p.icon}" class="w-6 h-6 sm:w-7 sm:h-7"></i>
            </div>
        </div>

        <div class="mb-8 sm:mb-10 relative z-10">
            <p class="text-[8px] sm:text-[9px] font-accent font-bold uppercase tracking-[0.35em] text-gold mb-4">Ideal For</p>
            <p class="text-base sm:text-lg font-display italic leading-relaxed ${p.accent ? 'text-ink/60' : 'text-white/65'}">${p.idealFor}</p>
        </div>

        <div class="w-full h-px bg-current opacity-30 mb-8 sm:mb-10"></div>

        <div class="mb-8 sm:mb-10 flex-1 relative z-10">
            <p class="text-[8px] sm:text-[9px] font-accent font-bold uppercase tracking-[0.35em] text-gold mb-5">What's Included</p>
            <ul class="space-y-3 sm:space-y-4">
            ${p.included.map(f => `
                <li class="flex items-start gap-4 sm:gap-6 group/item">
                    <i data-lucide="check-circle" class="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-1 ${p.accent ? 'text-primary-accent' : 'text-gold'} opacity-100 transition-opacity"></i>
                    <span class="text-xs sm:text-sm font-accent tracking-wider leading-relaxed opacity-100 transition-opacity">
                        ${f}
                    </span>
                </li>
            `).join('')}
            </ul>
        </div>

        <div class="relative z-10 mb-8 sm:mb-10">
            <p class="text-[8px] sm:text-[9px] font-accent font-bold uppercase tracking-[0.35em] text-gold mb-3">Experience</p>
            <p class="text-2xl sm:text-3xl font-display italic ${p.accent ? 'text-primary-accent' : 'text-white'}">${p.experience}</p>
        </div>

        <div class="relative z-10 mb-10 sm:mb-12">
            <p class="text-[8px] sm:text-[9px] font-accent font-bold uppercase tracking-[0.35em] text-gold mb-4">Best For</p>
            <div class="flex flex-wrap gap-2">
                ${p.bestFor.map(item => `
                    <span class="text-[8px] sm:text-[9px] font-accent font-bold uppercase tracking-[0.18em] ${p.accent ? 'text-primary-accent/70 border-primary-accent/10 bg-primary-accent/5' : 'text-white/75 border-white/10 bg-white/[0.04]'} border px-3 py-2 rounded-full">${item}</span>
                `).join('')}
            </div>
        </div>

        <div class="mt-auto relative z-10">
            <a href="#contact" class="${p.accent ? 'btn-primary w-full py-6 sm:py-8 text-[10px] sm:text-[11px] shadow-2xl shadow-primary-accent/30 inline-block text-center' : 'btn-secondary w-full border-white/30 text-white hover:bg-gold hover:text-ink hover:border-gold py-6 sm:py-8 text-[10px] sm:text-[11px] bg-white/20 inline-block text-center'} font-bold transition-all duration-700 uppercase tracking-[0.3em]">
                <span>Get Custom Quote</span>
            </a>
            <div class="flex justify-center mt-4 sm:mt-6 gap-2 opacity-50 group-hover:opacity-80 transition-opacity">
                ${Array(3).fill('<div class="w-1 h-1 bg-current rounded-full"></div>').join('')}
            </div>
        </div>
    </div>
  `).join('') + `
    <div class="pricing-card lg:col-span-3 p-8 sm:p-10 md:p-14 rounded-[30px] sm:rounded-[40px] md:rounded-[56px] bg-white text-ink shadow-[0_60px_120px_rgba(0,0,0,0.35)] relative overflow-hidden">
        <div class="absolute inset-0 bg-mesh opacity-10"></div>
        <div class="relative z-10 grid lg:grid-cols-12 gap-10 md:gap-14 items-start">
            <div class="lg:col-span-5">
                <span class="text-[9px] font-accent font-bold uppercase tracking-[0.4em] text-primary-accent/50 block mb-5">Custom Enterprise Solutions</span>
                <h3 class="text-4xl sm:text-5xl md:text-7xl font-display italic text-primary-accent mb-6 leading-[0.9]">Tailored Development for Large-Scale Projects</h3>
                <p class="text-lg md:text-xl font-display italic text-ink/55 leading-relaxed">Custom-built systems designed specifically around your business goals, workflow, and scalability requirements.</p>
            </div>
            <div class="lg:col-span-4">
                <p class="text-[9px] font-accent font-bold uppercase tracking-[0.35em] text-gold mb-5">Enterprise Features</p>
                <ul class="space-y-4">
                    ${enterpriseFeatures.map(item => `
                        <li class="flex items-start gap-4 text-sm font-accent tracking-wider leading-relaxed text-ink/70">
                            <i data-lucide="check-circle" class="w-4 h-4 text-primary-accent mt-0.5"></i>
                            <span>${item}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="lg:col-span-3">
                <p class="text-[9px] font-accent font-bold uppercase tracking-[0.35em] text-gold mb-5">Suitable For</p>
                <div class="flex flex-wrap gap-2 mb-8">
                    ${enterpriseSuitableFor.map(item => `<span class="text-[9px] font-accent font-bold uppercase tracking-[0.18em] text-primary-accent/70 border border-primary-accent/10 bg-primary-accent/5 px-3 py-2 rounded-full">${item}</span>`).join('')}
                </div>
                <a href="#contact" class="btn-primary w-full py-5 text-center inline-block"><span>Schedule Consultation</span></a>
            </div>
        </div>
    </div>

    <div class="lg:col-span-3 pt-10 md:pt-16">
        <div class="text-center mb-10 md:mb-14">
            <span class="text-[10px] font-accent font-bold uppercase tracking-[0.45em] text-gold/60 block mb-5">Why These Plans Stand Out</span>
            <h3 class="text-4xl sm:text-5xl md:text-7xl font-display italic text-white">Built for Premium Growth</h3>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            ${standouts.map(item => `
                <div class="pricing-card p-6 md:p-8 rounded-[28px] bg-white/10 border border-white/10 backdrop-blur-md">
                    <i data-lucide="${item.icon}" class="w-6 h-6 text-gold mb-5"></i>
                    <h4 class="text-2xl font-display italic text-white mb-4">${item.title}</h4>
                    <p class="text-sm font-accent leading-relaxed text-white/55">${item.text}</p>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="lg:col-span-3 grid lg:grid-cols-12 gap-8 md:gap-10 items-start pt-6 md:pt-10">
        <div class="lg:col-span-4">
            <span class="text-[10px] font-accent font-bold uppercase tracking-[0.45em] text-gold/60 block mb-5">Optional Premium Add-Ons</span>
            <h3 class="text-4xl sm:text-5xl md:text-6xl font-display italic text-white mb-6">Upgrade Your Experience</h3>
            <p class="text-lg font-display italic text-white/45 leading-relaxed">Add advanced features when your platform needs more depth, automation, or long-term growth support.</p>
        </div>
        <div class="lg:col-span-8 flex flex-wrap gap-3">
            ${addOns.map(item => `<span class="text-[9px] sm:text-[10px] font-accent font-bold uppercase tracking-[0.2em] text-white/80 border border-white/10 bg-white/[0.05] rounded-full px-4 py-3">${item}</span>`).join('')}
        </div>
    </div>

    <div class="pricing-card lg:col-span-3 p-8 sm:p-10 md:p-14 rounded-[30px] sm:rounded-[40px] md:rounded-[56px] bg-white/10 border border-white/10 backdrop-blur-md text-center relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent"></div>
        <div class="relative z-10 max-w-4xl mx-auto">
            <span class="text-[10px] font-accent font-bold uppercase tracking-[0.45em] text-gold/70 block mb-5">Pricing CTA Section</span>
            <h3 class="text-4xl sm:text-5xl md:text-7xl font-display italic text-white mb-6">Ready to Build Your Next Digital Experience?</h3>
            <p class="text-lg md:text-2xl font-display italic text-white/55 leading-relaxed mb-10">Let's create something modern, powerful, and visually unforgettable together.</p>
            <div class="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                <a href="#contact" class="btn-primary py-5 text-center"><span>Get Custom Quote</span></a>
                <a href="#contact" class="btn-secondary border-white/30 text-white hover:bg-gold hover:text-ink hover:border-gold py-5 bg-white/20 text-center"><span>Schedule Consultation</span></a>
                <a href="#contact" class="btn-secondary border-white/30 text-white hover:bg-gold hover:text-ink hover:border-gold py-5 bg-white/20 text-center"><span>Start Your Project</span></a>
            </div>
            <p class="text-xl md:text-3xl font-display italic text-gold mb-4">Modern design. Powerful technology. Exceptional user experience.</p>
            <p class="text-sm md:text-base font-accent uppercase tracking-[0.25em] text-white/45">Crafted with creativity and precision by Deinxel Web Service.</p>
        </div>
    </div>
  `;
};

export const renderTestimonials = (container: HTMLElement) => {
  const reviews = [
    { name: 'Marcus Chen', role: 'Art Director, Ethereal', text: 'Professional, creative, and highly skilled. The final website exceeded expectations with smooth animations and premium design quality.' },
    { name: 'Sarah Jenkins', role: 'Founder, Horizon', text: 'Excellent communication and fast delivery. The admin dashboard and backend system were extremely well built.' },
    { name: 'Elena Rossi', role: 'CEO, Velvet Luxury', text: 'Modern UI, responsive design, and strong technical implementation. Highly recommended for professional web solutions.' }
  ];

  container.innerHTML = reviews.map((r, i) => `
    <div class="testimonial-card shrink-0 w-[85vw] sm:w-[400px] md:w-[450px] p-6 sm:p-8 md:p-12 lg:p-16 glass rounded-[30px] md:rounded-[60px] shadow-[0_40px_80px_rgba(0,0,0,0.1)] mr-6 sm:mr-8 md:mr-16 group transition-all duration-1000 hover:-translate-y-4 hover:shadow-primary-accent/10 relative overflow-hidden bg-white/60 backdrop-blur-xl" data-index="${i}">
        <!-- Decorative Elements -->
        <div class="absolute top-8 right-8 md:top-12 md:right-12 text-gold opacity-5 group-hover:opacity-10 transition-opacity">
            <i data-lucide="quote" class="w-16 h-16 md:w-24 md:h-24 rotate-12"></i>
        </div>
        
        <div class="relative z-10">
            <div class="flex gap-2 mb-6 md:mb-10 opacity-60 group-hover:opacity-100 transition-opacity">
                ${Array(5).fill('<i data-lucide="star" class="w-2.5 h-2.5 md:w-3 md:h-3 fill-gold text-gold"></i>').join('')}
            </div>
            
            <p class="text-base sm:text-lg md:text-2xl font-display italic text-ink/80 leading-relaxed mb-8 sm:mb-10 md:mb-16 relative whitespace-normal">
                <span class="text-gold font-serif text-3xl md:text-5xl absolute -left-4 sm:-left-6 md:-left-8 -top-2 sm:-top-3 md:-top-4 opacity-20">"</span>
                ${r.text}
            </p>
            
            <div class="flex items-center justify-between pt-6 sm:pt-8 md:pt-10 border-t border-primary-accent/5">
                <div class="flex items-center gap-3 sm:gap-4 md:gap-6">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 glass rounded-[10px] sm:rounded-[12px] md:rounded-2xl overflow-hidden flex items-center justify-center border-white shadow-lg group-hover:rotate-6 transition-transform">
                        <span class="text-[8px] sm:text-[9px] md:text-[10px] font-accent font-bold text-primary-accent tracking-tighter">${r.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                        <h4 class="text-[10px] sm:text-xs md:text-sm font-accent font-bold uppercase tracking-[0.2em] text-primary-accent">${r.name}</h4>
                        <p class="text-[7px] sm:text-[8px] md:text-[9px] font-accent opacity-40 uppercase tracking-[0.3em] mt-1 md:mt-2 group-hover:text-gold transition-colors">${r.role}</p>
                    </div>
                </div>
                
                <div class="hidden sm:flex flex-col items-end opacity-20 group-hover:opacity-100 transition-opacity">
                    <span class="text-[8px] font-accent font-bold uppercase tracking-widest">Client</span>
                    <span class="text-[8px] font-accent opacity-50">SYNC_0${i + 1}</span>
                </div>
            </div>
        </div>
    </div>
  `).join('');

  // Duplicate for infinite scroll
  container.innerHTML += container.innerHTML;
};
