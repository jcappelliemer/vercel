/**
 * Solaris Films — Main JavaScript
 * Mobile menu, AOS animations, FAQ accordion
 */
document.addEventListener('DOMContentLoaded', function () {

    // ===== AOS Init =====
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            easing: 'ease-out',
            once: true,
            offset: 60,
        });
    }

    // ===== Mobile Menu Toggle =====
    var toggle = document.getElementById('menu-toggle');
    var mobileMenu = document.getElementById('mobile-menu');
    if (toggle && mobileMenu) {
        toggle.addEventListener('click', function () {
            toggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                toggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // ===== Header Scroll Effect =====
    var header = document.getElementById('site-header');
    if (header) {
        var lastScroll = 0;
        window.addEventListener('scroll', function () {
            var current = window.scrollY;
            if (current > 100) {
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            } else {
                header.style.boxShadow = 'none';
            }
            lastScroll = current;
        }, { passive: true });
    }

    // ===== FAQ Accordion =====
    // Already handled via onclick in HTML, but adding keyboard support
    document.querySelectorAll('.sf-faq-item__question').forEach(function (btn) {
        btn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });

    // ===== Smooth scroll for anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== Contact Form AJAX =====
    var contactForm = document.getElementById('solaris-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var formData = new FormData(contactForm);
            formData.append('action', 'solaris_contact');
            formData.append('nonce', solarisData.nonce);

            var btn = contactForm.querySelector('button[type="submit"]');
            var originalText = btn.textContent;
            btn.textContent = 'Invio in corso...';
            btn.disabled = true;

            fetch(solarisData.ajaxUrl, { method: 'POST', body: formData })
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    if (data.success) {
                        contactForm.innerHTML = '<div class="sf-form-success"><p>' + data.data.message + '</p></div>';
                    } else {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        alert(data.data.message || 'Errore. Riprova.');
                    }
                })
                .catch(function () {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    alert('Errore di connessione. Riprova.');
                });
        });
    }

    // ===== Quote Form AJAX =====
    var quoteForm = document.getElementById('solaris-quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var formData = new FormData(quoteForm);
            formData.append('action', 'solaris_quote');
            formData.append('nonce', solarisData.nonce);

            var btn = quoteForm.querySelector('button[type="submit"]');
            var originalText = btn.textContent;
            btn.textContent = 'Invio in corso...';
            btn.disabled = true;

            fetch(solarisData.ajaxUrl, { method: 'POST', body: formData })
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    if (data.success) {
                        quoteForm.innerHTML = '<div class="sf-form-success"><p>' + data.data.message + '</p></div>';
                    } else {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        alert(data.data.message || 'Errore. Riprova.');
                    }
                })
                .catch(function () {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    alert('Errore di connessione. Riprova.');
                });
        });
    }

    // ===== Energy Bar Animation on Scroll =====
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var fill = entry.target;
                fill.style.width = fill.getAttribute('style').match(/width:\s*(\d+%)/)?.[1] || '0%';
                observer.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.sf-energy-bar__fill').forEach(function (bar) {
        var targetWidth = bar.style.width;
        bar.style.width = '0';
        bar.dataset.targetWidth = targetWidth;
        observer.observe(bar);
    });

    // Re-trigger energy bar animation
    document.querySelectorAll('.sf-energy-bar__fill').forEach(function (bar) {
        if (bar.dataset.targetWidth) {
            setTimeout(function () {
                bar.style.width = bar.dataset.targetWidth;
            }, 300);
        }
    });
});
