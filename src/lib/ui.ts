export const renderServices = (container: HTMLElement) => {
  const services = [
    {
      icon: 'Monitor',
      title: 'Digital Systems',
      desc: 'High-performance architected systems that scale with your exponential growth.',
      features: ['Technical Audit', 'Systems Architecture', 'Performance Scaling']
    },
    {
      icon: 'Layout',
      title: 'Immersive UI/UX',
      desc: 'Choreographed digital interfaces that prioritize human emotion and aesthetic.',
      features: ['Sensory Design', 'Interaction Mapping', 'Narrative UX']
    },
    {
      icon: 'Target',
      title: 'Growth Strategy',
      desc: 'Data-driven conversion funnels built to capture and retain market attention.',
      features: ['Conversion Audit', 'Identity Design', 'Market Positioning']
    },
    {
      icon: 'Layers',
      title: 'Web Software',
      desc: 'Sophisticated full-stack applications with robust, secure infrastructure.',
      features: ['Custom Logic', 'Database Schema', 'API Ecosystems']
    },
    {
      icon: 'ShoppingBag',
      title: 'Luxury Commerce',
      desc: 'Bespoke shopping experiences designed for high-end boutique performance.',
      features: ['Dynamic Catalog', 'Seamless Checkout', 'Inventory Sync']
    },
    {
      icon: 'Code',
      title: 'Lead Production',
      desc: 'Hand-crafted technical production with zero-compromise code quality.',
      features: ['Zero Bloat', 'A-Grade SEO', 'Modern Tech Stack']
    }
  ];

  container.innerHTML = services.map((s, i) => `
    <div class="service-card group p-6 sm:p-8 md:p-12 lg:p-14 relative overflow-hidden transition-all duration-700 bg-white/[0.12] backdrop-blur-md border border-white/5 flex flex-col justify-between min-h-[400px] sm:min-h-[440px] md:min-h-[480px] hover:bg-white/[0.18] hover:border-white/10" data-index="${i}">
        <!-- Texture & Depth -->
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-gold/[0.15] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div class="absolute -top-32 -left-32 w-80 h-80 bg-gold/15 blur-[140px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        
        <!-- Hover Scanner -->
        <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent -translate-y-full group-hover:translate-y-[600px] transition-transform duration-[3000ms] ease-in-out opacity-0 group-hover:opacity-100"></div>

        <div class="relative z-10 flex flex-col h-full">
            <div class="flex justify-between items-start mb-12 sm:mb-16">
                <div class="flex flex-col gap-1 text-white">
                    <span class="text-[8px] font-accent font-bold text-gold opacity-100 tracking-[0.6em] mb-1">CAPABILITY</span>
                    <div class="flex items-baseline gap-2">
                        <span class="text-3xl sm:text-4xl font-display italic text-white/40 group-hover:text-gold transition-colors duration-700">0${i + 1}</span>
                        <div class="w-8 sm:w-10 h-[1px] bg-white/30 group-hover:bg-gold/40 transition-colors duration-700"></div>
                    </div>
                </div>
                <div class="w-12 h-12 sm:w-16 sm:h-16 glass rounded-[18px] sm:rounded-[24px] flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/50 transition-all duration-700 shadow-2xl border border-white/20">
                    <i data-lucide="${s.icon}" class="w-6 h-6 sm:w-8 sm:h-8 text-gold group-hover:scale-110 transition-transform duration-700"></i>
                </div>
            </div>

            <div class="space-y-3 sm:space-y-4 md:space-y-6 mb-8 sm:mb-10 md:mb-12">
                <h3 class="text-2xl sm:text-3xl md:text-5xl group-hover:translate-x-3 transition-transform duration-700 text-white font-display italic tracking-tight leading-[0.9]">${s.title}</h3>
                <p class="text-white text-sm sm:text-base md:text-lg leading-relaxed group-hover:text-white transition-colors duration-700 font-display italic max-w-[95%] opacity-80 group-hover:opacity-100">${s.desc}</p>
            </div>
            
            <div class="mt-auto">
                <ul class="space-y-3 sm:space-y-4 mb-12 sm:mb-16 md:mb-20">
                    ${s.features.map(f => `
                        <li class="text-[9px] sm:text-[10px] items-center gap-3 sm:gap-5 font-accent font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-80 group-hover:opacity-100 flex transition-all duration-700 group-hover:translate-x-2 text-white">
                            <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 border border-gold/40 rounded-sm rotate-45 group-hover:bg-gold transition-colors duration-700"></div>
                            ${f}
                        </li>
                    `).join('')}
                </ul>
                
                <div class="pt-6 sm:pt-8 border-t border-white/20 flex items-center justify-between opacity-90 group-hover:opacity-100 transition-all duration-700">
                    <div class="flex flex-col gap-1">
                        <span class="text-[8px] font-accent font-bold uppercase tracking-[0.4em] text-white/80">Service Protocol</span>
                        <span class="text-[9px] font-accent font-bold uppercase tracking-widest text-gold opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">Initiate Sync</span>
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
      id: 'plan-starter',
      name: 'Starter',
      price: '$5,000',
      period: 'Bespoke Production',
      features: ['Superior Visual Design', 'Cinematic Interaction', 'Technical Infrastructure', 'Strategy Consultation', '3 Rounds of Revisions'],
      accent: false,
      tag: 'Foundation'
    },
    {
      id: 'plan-professional',
      name: 'Professional',
      price: '$12,000',
      period: 'Elite Intensive',
      features: ['Full Systems Architecture', 'Narrative Experience Design', 'Motion Choreography', 'Priority Support', 'Unlimited Revisions', 'Quarterly Audit'],
      accent: true,
      tag: 'Most Exclusive'
    },
    {
      id: 'plan-premium',
      name: 'Premium',
      price: '$2,500',
      period: 'Retainer / Mo',
      features: ['Digital Evolution', 'Systems Maintenance', 'Security Hardening', 'Priority Response', 'Growth Scaling', 'Monthly Narrative Updates'],
      accent: false,
      tag: 'Sustain'
    }
  ];

  container.innerHTML = plans.map((p, i) => `
    <div id="${p.id}" class="pricing-card group p-8 sm:p-10 md:p-12 lg:p-16 rounded-[30px] sm:rounded-[40px] md:rounded-[80px] transition-all duration-700 ${p.accent ? 'bg-white text-ink shadow-[0_60px_120px_rgba(0,0,0,0.4)] md:scale-[1.02] z-10' : 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20'} overflow-hidden relative flex flex-col h-full" data-index="${i}">
        <!-- Texture Overlay -->
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        
        <div class="flex justify-between items-start mb-12 sm:mb-16 relative z-10">
            <div>
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${p.accent ? 'bg-primary-accent' : 'bg-gold'} shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
                    <span class="text-[8px] sm:text-[9px] font-accent font-bold uppercase tracking-[0.4em] ${p.accent ? 'text-primary-accent/70' : 'text-gold'}">${p.tag}</span>
                </div>
                <h3 class="text-4xl sm:text-5xl md:text-6xl italic font-display tracking-tighter">${p.name}</h3>
            </div>
            ${p.accent ? '<div class="w-10 h-10 sm:w-14 sm:h-14 bg-primary-accent rounded-[15px] sm:rounded-[20px] flex items-center justify-center text-white shadow-2xl rotate-3 group-hover:rotate-12 transition-transform"><i data-lucide="zap" class="w-7 h-7"></i></div>' : '<div class="text-[8px] font-accent opacity-40 group-hover:opacity-100 transition-opacity uppercase tracking-widest">ARCH_ID_0'+(i+1)+'</div>'}
        </div>

        <div class="mb-10 sm:mb-12 md:mb-16 relative z-10">
            <div class="flex items-baseline gap-3 sm:gap-4">
                <span class="text-4xl sm:text-5xl md:text-7xl font-display font-light ${p.accent ? 'text-primary-accent' : 'text-white'}">${p.price}</span>
                <span class="text-[9px] md:text-[10px] font-accent font-bold uppercase tracking-widest opacity-80">/ Initiation</span>
            </div>
            <p class="text-[8px] sm:text-[9px] font-accent font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gold mt-4 sm:mt-6 border-l-2 border-gold/40 pl-4">${p.period}</p>
        </div>

        <div class="w-full h-px bg-current opacity-30 mb-10 sm:mb-16"></div>

        <ul class="space-y-4 sm:space-y-6 mb-12 sm:mb-20 flex-1 relative z-10">
            ${p.features.map(f => `
                <li class="flex items-start gap-4 sm:gap-6 group/item">
                    <i data-lucide="check-circle" class="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-1 ${p.accent ? 'text-primary-accent' : 'text-gold'} opacity-100 transition-opacity"></i>
                    <span class="text-xs sm:text-sm font-accent tracking-wider leading-relaxed opacity-100 transition-opacity">
                        ${f}
                    </span>
                </li>
            `).join('')}
        </ul>

        <div class="mt-auto relative z-10">
            <button class="${p.accent ? 'btn-primary w-full py-6 sm:py-8 text-[10px] sm:text-[11px] shadow-2xl shadow-primary-accent/30' : 'btn-secondary w-full border-white/30 text-white hover:bg-gold hover:text-ink hover:border-gold py-6 sm:py-8 text-[10px] sm:text-[11px] bg-white/20'} font-bold transition-all duration-700 uppercase tracking-[0.3em]">
                <span>Initiate Allocation</span>
            </button>
            <div class="flex justify-center mt-4 sm:mt-6 gap-2 opacity-50 group-hover:opacity-80 transition-opacity">
                ${Array(3).fill('<div class="w-1 h-1 bg-current rounded-full"></div>').join('')}
            </div>
        </div>
    </div>
  `).join('');
};

export const renderTestimonials = (container: HTMLElement) => {
  const reviews = [
    { name: 'Marcus Chen', role: 'Art Director, Ethereal', text: 'Deinxel transformed our digital presence into a cinematic journey. Their attention to detail is uncompromising.' },
    { name: 'Sarah Jenkins', role: 'Founder, Horizon', text: 'Beyond aesthetics, the technical architecture Deinxel delivered saw our conversions skyrocket within weeks.' },
    { name: 'Elena Rossi', role: 'CEO, Velvet Luxury', text: 'A studio that truly understands the intersection of luxury and technology. Superior craftsmanship.' }
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
