class PortfolioEnhancer {
    constructor() {
        this.observers = new Map();
        this.isLoaded = false;
        this.init();
    }
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupComponents());
        } else {
            this.setupComponents();
        }
        
        window.addEventListener('load', () => this.handlePageLoad());
    }

    setupComponents() {
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupDarkMode();
        this.setupNavbar();
        this.setupActiveNavLinks();
        this.setupTypingAnimation();
        this.setupScrollAnimations();
        this.setupParallax();
        this.setupProjectCardEffects();
        this.setupScrollIndicator();
        this.setupSocialLinks();
        this.setupCounterAnimations();
        this.setupEasterEgg();
        this.injectStyles();
    }

    // Smooth scrolling with improved error handling
    setupSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;

            e.preventDefault();
            const targetId = anchor.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Mobile menu with improved accessibility
    setupMobileMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const menu = document.getElementById('mobileMenu');
        
        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            const isHidden = menu.classList.contains('hidden');
            menu.classList.toggle('hidden');
            toggle.setAttribute('aria-expanded', !isHidden);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.add('hidden');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Dark mode with system preference detection
    setupDarkMode() {
        const toggle = document.getElementById('darkModeToggle');
        if (!toggle) return;

        // Check for saved preference or default to system preference
        const savedTheme = localStorage.getItem('darkMode');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = savedTheme ? savedTheme === 'true' : systemDark;

        if (isDark) {
            document.documentElement.classList.add('dark');
        }

        toggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDarkMode = document.documentElement.classList.contains('dark');
            localStorage.setItem('darkMode', isDarkMode);
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('darkMode')) {
                document.documentElement.classList.toggle('dark', e.matches);
            }
        });
    }

    //navbar scroll effect
    setupNavbar() {
        const navbar = document.querySelector('nav');
        if (!navbar) return;

        const handleScroll = this.debounce(() => {
            const scrolled = window.scrollY > 50;
            navbar.classList.toggle('shadow-lg', scrolled);
            navbar.style.backdropFilter = scrolled ? 'blur(20px)' : 'blur(10px)';
        }, 10);

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    //active nav link detection
    setupActiveNavLinks() {
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const navLinks = Array.from(document.querySelectorAll('.nav-link'));
        
        if (!sections.length || !navLinks.length) return;

        const handleScroll = this.debounce(() => {
            let current = '';
            const scrollPos = window.scrollY + 150;

            for (const section of sections) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.id;
                    break;
                }
            }

            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${current}`;
                link.classList.toggle('text-blue-600', isActive);
                link.classList.toggle('font-bold', isActive);
            });
        }, 50);

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    //typing animation with cleanup
    setupTypingAnimation() {
        const element = document.querySelector('.typing');
        if (!element) return;

        const texts = [
            'B.Tech Computer Science Student',
            'Passionate Problem Solver',
            'Future Data Scientist',
            'Tech Enthusiast'
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let timeoutId;

        const typeWriter = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                element.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                element.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            timeoutId = setTimeout(typeWriter, typeSpeed);
        };

        typeWriter();

        // Cleanup function for when element is removed
        return () => clearTimeout(timeoutId);
    }

    //scroll animations with better performance
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const target = entry.target;
                target.classList.add('animate-fadeInUp');

                // skill progress bars
                if (target.classList.contains('skill-card')) {
                    this.animateSkillBar(target);
                }

                //project cards with stagger
                if (target.classList.contains('project-card')) {
                    this.animateProjectCard(target);
                }

                observer.unobserve(target);
            });
        }, observerOptions);

        // Observe elements
        const elements = document.querySelectorAll('.skill-card, .project-card, section[data-animate]');
        elements.forEach(el => observer.observe(el));

        this.observers.set('scroll', observer);
    }

    animateSkillBar(skillCard) {
        const progressBar = skillCard.querySelector('.progress-bar');
        if (!progressBar) return;

        const targetWidth = progressBar.dataset.width || '70%';
        progressBar.style.width = '0';
        
        requestAnimationFrame(() => {
            progressBar.style.transition = 'width 2s ease-in-out';
            progressBar.style.width = targetWidth;
        });
    }

    animateProjectCard(card) {
        const cards = document.querySelectorAll('.project-card');
        const index = Array.from(cards).indexOf(card);
        card.style.animationDelay = `${index * 0.2}s`;
    }

    // parallax effect
    setupParallax() {
        const elements = document.querySelectorAll('.animate-float');
        if (!elements.length) return;

        const handleScroll = this.throttle(() => {
            const scrolled = window.pageYOffset;
            
            elements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 16); // ~60fps

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    //project card interactions
    setupProjectCardEffects() {
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            });
        });
    }

    // Scroll progress indicator
    setupScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'fixed top-0 left-0 z-50 h-1 transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600';
        indicator.style.width = '0%';
        document.body.appendChild(indicator);

        const updateProgress = this.throttle(() => {
            const winScroll = window.pageYOffset;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (winScroll / height) * 100;
            indicator.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
        }, 16);

        window.addEventListener('scroll', updateProgress, { passive: true });
    }

    // Social link interactions
    setupSocialLinks() {
        const links = document.querySelectorAll('.social-link');
        
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-3px) scale(1.05)';
            });

            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Counter animations with intersection observer
    setupCounterAnimations() {
        const statsSection = document.querySelector('.stats-section, .grid-cols-2');
        if (!statsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const counters = entry.target.querySelectorAll('[data-count]');
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.count) || parseInt(counter.textContent);
                    if (!isNaN(target)) {
                        this.animateCounter(counter, target);
                    }
                });

                observer.unobserve(entry.target);
            });
        });

        observer.observe(statsSection);
    }

    animateCounter(element, target, duration = 2000) {
        let start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            start = Math.floor(target * this.easeOutCubic(progress));
            element.textContent = start + (target > 1 ? '+' : '');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    // Konami code easter egg
    setupEasterEgg() {
        let sequence = [];
        const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

        document.addEventListener('keydown', (e) => {
            sequence.push(e.keyCode);
            sequence = sequence.slice(-konamiCode.length);

            if (sequence.join(',') === konamiCode.join(',')) {
                this.activateEasterEgg();
            }
        });
    }

    activateEasterEgg() {
        document.body.style.animation = 'rainbow 2s infinite';
        this.showNotification('🎉 Konami Code activated!', 'success');
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }

    handlePageLoad() {
        this.isLoaded = true;
        document.body.classList.add('loaded');
        
        //elements on page load
        setTimeout(() => {
            const elements = document.querySelectorAll('.animate-on-load');
            elements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 300);
    }

    //necessary styles
    injectStyles() {
        if (document.getElementById('portfolio-styles')) return;

        const style = document.createElement('style');
        style.id = 'portfolio-styles';
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                25% { filter: hue-rotate(90deg); }
                50% { filter: hue-rotate(180deg); }
                75% { filter: hue-rotate(270deg); }
                100% { filter: hue-rotate(360deg); }
            }
            
            .loaded {
                opacity: 1;
            }
            
            .animate-fadeInUp {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }
            
            .animate-fadeInUp.animate-fadeInUp {
                opacity: 1;
                transform: translateY(0);
            }
            
            .animate-on-load {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }
            
            .progress-bar {
                transition: width 2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .project-card {
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                           box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .social-link {
                transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Utility functions
    debounce(func, wait, immediate = false) {
        let timeout;
        return (...args) => {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500'
        }[type] || 'bg-blue-500';

        notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 ${bgColor} text-white transform translate-x-full transition-transform duration-300`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Slide in
        requestAnimationFrame(() => {
            notification.classList.remove('translate-x-full');
        });
        
        // Slide out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}
function downloadResume() {
    window.open("https://drive.google.com/file/d/1McCVhsizdiWCnU0BPolDWT0snqUwMjX0/view?usp=sharing","_blank")

}

window.portfolioEnhancer = new PortfolioEnhancer();