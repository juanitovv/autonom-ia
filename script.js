// Autonom.IA - JavaScript Principal

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all elements with fade-in-up class
document.querySelectorAll('.fade-in-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Mobile menu toggle - Reemplazar la sección existente en script.js
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
        // Toggle class instead of changing display directly
        navLinks.classList.toggle('mobile-open');
        
        // Change hamburger icon to X when open
        const icon = this.querySelector('i');
        if (navLinks.classList.contains('mobile-open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('mobile-open');
                // Reset hamburger icon
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('mobile-open');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('mobile-open');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Analytics tracking functions
function trackEvent(eventName, eventData = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }
}

// Track button clicks
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        const buttonType = this.classList.contains('btn-primary') ? 'primary' : 'secondary';
        
        trackEvent('button_click', {
            button_text: buttonText,
            button_type: buttonType,
            page_location: window.location.pathname
        });
    });
});

// Track section visibility
const sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionName = entry.target.id || entry.target.className;
            trackEvent('section_view', {
                section_name: sectionName,
                page_location: window.location.pathname
            });
        }
    });
}, { threshold: 0.5 });

// Observe main sections
document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance monitoring
window.addEventListener('load', function() {
    // Track page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    
    trackEvent('page_load', {
        load_time: loadTime,
        page_url: window.location.href
    });
});

// Error tracking
window.addEventListener('error', function(e) {
    trackEvent('javascript_error', {
        error_message: e.message,
        error_filename: e.filename,
        error_lineno: e.lineno,
        page_url: window.location.href
    });
});

// FAQs functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current FAQ
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});

// Demo form submission
document.addEventListener('DOMContentLoaded', function() {
    const demoForm = document.querySelector('.cta-demo-form');
    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Create confirmation message
            const confirmMsg = document.createElement('div');
            confirmMsg.className = 'cta-demo-confirm-msg';
            confirmMsg.innerHTML = `
                <div style="width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                    <span style="font-size:2.1rem;display:block;margin-bottom:0.7rem;">🎉</span>
                    <strong style="font-size:1.35rem;">¡Gracias por tu interés!</strong><br>
                    <span style="font-weight:400;">Hemos recibido tu información correctamente.<br>Nos pondremos en contacto contigo a la brevedad para coordinar tu demo gratuita en el horario que mejor te convenga.</span>
                </div>
            `;
            
            // Insert message before form
            demoForm.parentNode.insertBefore(confirmMsg, demoForm);
            
            // Hide form
            demoForm.style.display = 'none';
            
            // Remove message after 7 seconds and show form again
            setTimeout(function() {
                confirmMsg.remove();
                demoForm.reset();
                demoForm.style.display = '';
            }, 7000);
        });
    }
});

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    lazyLoadImages();
});

// Console log for development
console.log('Autonom.IA - Sitio web cargado correctamente');
console.log('Versión: 1.0.0');
console.log('Fecha: ' + new Date().toLocaleDateString('es-MX')); 