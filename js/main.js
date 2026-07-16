/* ============================================
   珠海探海海洋科技有限公司 - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // =========== Mobile Menu Toggle ===========
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('open');
            menuToggle.classList.toggle('active');
        });
    }

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('open');
            menuToggle.classList.remove('active');
        });
    });

    // =========== Active Nav Link on Scroll ===========
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            const bottom = top + section.offsetHeight;
            if (window.scrollY >= top && window.scrollY < bottom) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // =========== Header Shadow on Scroll ===========
    const header = document.getElementById('header');

    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateHeader);
    updateHeader();

    // =========== Counter Animation ===========
    function animateCounter(element, target, duration) {
        let start = 0;
        const increment = target > 100 ? Math.ceil(target / 60) : 1;
        const timer = setInterval(function() {
            start += increment;
            if (start >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = start.toLocaleString();
            }
        }, duration / (target / increment));
    }

    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function checkCounters() {
        if (countersAnimated) return;
        const heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;
        const rect = heroStats.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;
            statNumbers.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'));
                animateCounter(el, target, 2000);
            });
        }
    }

    window.addEventListener('scroll', checkCounters);
    checkCounters();

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
                if (card.id === shipId) {
                    card.classList.add('active');
                }
            });
        });
    });

    // =========== Contact Form ===========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '消息已发送 ✓';
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            this.reset();
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
            }, 3000);
        });
    }

    // =========== Smooth Scroll Enhancement ===========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
