/* ============================================
   珠海探海海洋科技有限公司 - Slide Navigation
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    const slides = document.querySelectorAll('.slide');
    const container = document.getElementById('slides-container');
    const dotsContainer = document.getElementById('slide-dots');
    const currentSpan = document.getElementById('slide-current');
    const totalSpan = document.getElementById('slide-total');
    const prevBtn = document.getElementById('slide-prev');
    const nextBtn = document.getElementById('slide-next');
    const header = document.getElementById('header');

    if (!slides.length || !container) return;

    const totalSlides = slides.length;
    let currentSlide = 0;
    let isAnimating = false;

    // Init total display
    if (totalSpan) {
        totalSpan.textContent = String(totalSlides).padStart(2, '0');
    }

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', '跳转到第 ' + (i + 1) + ' 页');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    // Go to slide
    function goToSlide(index) {
        if (isAnimating || index === currentSlide || index < 0 || index >= totalSlides) return;
        isAnimating = true;

        currentSlide = index;
        container.style.transform = 'translateX(-' + (index * 100) + '%)';

        // Update dots
        document.querySelectorAll('.slide-dot').forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });

        // Update pagination
        if (currentSpan) {
            currentSpan.textContent = String(index + 1).padStart(2, '0');
        }

        // Update header background
        if (header) {
            header.style.background = index === 0 ? 'rgba(10, 22, 40, 0.7)' : 'rgba(10, 22, 40, 0.95)';
        }

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector('.nav-link[href="#' + slides[index].id + '"]');
        if (activeLink) activeLink.classList.add('active');

        // Trigger animations
        if (index === 0) triggerHeroAnimations();

        // Show/hide logo banner for slide 2 (services)
        const logoBanner = document.querySelector('.logo-banner-section');
        if (logoBanner) {
            logoBanner.classList.toggle('visible', index === 2);
        }

        setTimeout(() => { isAnimating = false; }, 600);
    }

    // Next/Prev
    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    // Button handlers
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Keyboard
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            nextSlide();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            prevSlide();
        }
    });

    // Touch swipe
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        // Only trigger if horizontal swipe is dominant and significant
        if (Math.abs(diffX) > Math.abs(diffY) * 1.5 && Math.abs(diffX) > 50) {
            if (diffX > 0) nextSlide();
            else prevSlide();
        }
    }

    // Mouse wheel (horizontal only on desktop)
    let wheelTimeout = null;
    document.addEventListener('wheel', function(e) {
        // Check if inside a scrollable slide element
        const target = e.target;
        const slide = target.closest('.slide');
        if (slide) {
            const scrollTop = slide.scrollTop;
            const scrollHeight = slide.scrollHeight;
            const clientHeight = slide.clientHeight;
            const atTop = scrollTop <= 0;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 2;

            // Only change slide if at boundaries of scrollable content
            if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) {
                return; // Let the scroll happen
            }
        }

        // Change slide
        if (wheelTimeout) return;
        wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 800);

        if (e.deltaY > 0) nextSlide();
        else prevSlide();
    }, { passive: true });

    // =========== Hero Counter Animation ===========
    let countersAnimated = false;
    function triggerHeroAnimations() {
        if (countersAnimated) return;
        countersAnimated = true;
        document.querySelectorAll('.stat-number').forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            animateCounter(el, target, 2000);
        });
    }

    function animateCounter(element, target, duration) {
        let start = 0;
        const increment = target > 100 ? Math.ceil(target / 60) : 1;
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = start.toLocaleString();
            }
        }, duration / (target / increment));
    }

    // Auto-trigger hero animations on load
    triggerHeroAnimations();

    // =========== Mobile Menu ===========
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('open');
            menuToggle.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            nav.classList.remove('open');
            menuToggle.classList.remove('active');
            const targetId = this.getAttribute('href').slice(1);
            const targetSlide = document.querySelector('.slide[data-slide]');
            // Find slide by id
            slides.forEach((slide, i) => {
                if (slide.id === targetId) goToSlide(i);
            });
        });
    });

    // =========== Fleet Tabs ===========
    const tabBtns = document.querySelectorAll('.tab-btn');
    const fleetCards = document.querySelectorAll('.fleet-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const shipId = this.getAttribute('data-ship');
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            fleetCards.forEach(card => {
                card.classList.remove('active');
                if (card.id === shipId) card.classList.add('active');
            });
        });
    });

    // =========== Contact Form ===========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.textContent = '消息已发送 ✓';
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            this.reset();
            setTimeout(() => {
                submitBtn.textContent = '发送消息';
                submitBtn.style.background = '';
            }, 3000);
        });
    }

    // =========== Update GitHub ===========
    // Auto-deploy on reload
});
