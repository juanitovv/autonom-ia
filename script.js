// Autonom.IA - JavaScript Optimizado

(function() {
    'use strict';

    // ============================================
    // UTILIDADES Y HELPERS
    // ============================================

    // Throttle function para optimizar eventos de scroll
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Debounce function para optimizar eventos de resize
    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, arguments);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // ============================================
    // SMOOTH SCROLLING OPTIMIZADO
    // ============================================

    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    // Calcular offset del header fijo
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Tracking de navegación
                    trackEvent('navigation_click', {
                        target_section: targetId.replace('#', ''),
                        source: 'navigation_menu'
                    });
                }
            });
        });
    }

    // ============================================
    // HEADER SCROLL EFFECT OPTIMIZADO
    // ============================================

    function initHeaderEffects() {
        const header = document.querySelector('.header');
        if (!header) return;

        const headerScrollHandler = throttle(function() {
            const scrolled = window.pageYOffset > 100;
            
            if (scrolled) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        }, 16); // 60fps

        window.addEventListener('scroll', headerScrollHandler, { passive: true });
    }

    // ============================================
    // INTERSECTION OBSERVER PARA ANIMACIONES
    // ============================================

    function initScrollAnimations() {
        // Verificar soporte del navegador
        if (!('IntersectionObserver' in window)) {
            // Fallback para navegadores antiguos
            document.querySelectorAll('.fade-in-up').forEach(el => {
                el.classList.add('visible');
            });
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Dejar de observar una vez animado
                }
            });
        }, observerOptions);

        // Observar elementos con animación
        document.querySelectorAll('.fade-in-up').forEach(el => {
            observer.observe(el);
        });
    }

    // ============================================
    // MENÚ MÓVIL OPTIMIZADO
    // ============================================

    function initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        if (!mobileMenuBtn || !navLinks) return;

        // Toggle menú móvil
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const isOpen = navLinks.classList.contains('mobile-open');
            const icon = this.querySelector('i');
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }

            function openMobileMenu() {
                navLinks.classList.add('mobile-open');
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden'; // Prevenir scroll
                
                trackEvent('mobile_menu_open');
            }

            function closeMobileMenu() {
                navLinks.classList.remove('mobile-open');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
                
                trackEvent('mobile_menu_close');
            }
        });

        // Cerrar menú al hacer clic en enlaces
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Cerrar menú en cambio de orientación/resize
        const resizeHandler = debounce(function() {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        }, 250);

        window.addEventListener('resize', resizeHandler);

        function closeMobileMenu() {
            navLinks.classList.remove('mobile-open');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    }

    // ============================================
    // LAZY LOADING DE IMÁGENES
    // ============================================

    function initLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            // Fallback para navegadores sin soporte
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
            });
            return;
        }

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Preload de la imagen
                    const tempImg = new Image();
                    tempImg.onload = function() {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                    };
                    tempImg.src = img.dataset.src;
                    
                    imageObserver.unobserve(img);
                }
            });
        }, { 
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // FAQs FUNCIONALIDAD
    // ============================================

    function initFAQs() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (!question) return;

            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                const answer = item.querySelector('.faq-answer');
                
                // Cerrar todas las FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        if (otherQuestion) {
                            otherQuestion.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
                
                // Toggle FAQ actual
                if (!isActive) {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                    
                    // Scroll suave a la FAQ si es necesario
                    setTimeout(() => {
                        if (!isElementInViewport(answer)) {
                            answer.scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest'
                            });
                        }
                    }, 300);

                    trackEvent('faq_opened', {
                        question: question.querySelector('h3').textContent.slice(0, 50)
                    });
                } else {
                    item.classList.remove('active');
                    question.setAttribute('aria-expanded', 'false');
                }
            });

            // Inicializar aria-expanded
            question.setAttribute('aria-expanded', 'false');
        });
    }

    // ============================================
    // FORMULARIO DEMO OPTIMIZADO
    // ============================================

    function initDemoForm() {
        const demoForm = document.querySelector('#demoForm');
        if (!demoForm) return;

        // Validación en tiempo real
        const inputs = demoForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearErrors);
        });

        function validateField(e) {
            const field = e.target;
            const value = field.value.trim();
            
            // Remover errores previos
            clearFieldError(field);

            // Validaciones específicas
            if (field.type === 'email' && value) {
                if (!isValidEmail(value)) {
                    showFieldError(field, 'Por favor ingresa un email válido');
                }
            }

            if (field.type === 'tel' && value) {
                if (!isValidPhone(value)) {
                    showFieldError(field, 'Por favor ingresa un teléfono válido');
                }
            }

            if (field.hasAttribute('required') && !value) {
                showFieldError(field, 'Este campo es requerido');
            }
        }

        function clearErrors(e) {
            clearFieldError(e.target);
        }

        function showFieldError(field, message) {
            field.style.borderColor = '#ef4444';
            
            let errorEl = field.parentNode.querySelector('.field-error');
            if (!errorEl) {
                errorEl = document.createElement('div');
                errorEl.className = 'field-error';
                errorEl.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem;';
                field.parentNode.appendChild(errorEl);
            }
            errorEl.textContent = message;
        }

        function clearFieldError(field) {
            field.style.borderColor = '';
            const errorEl = field.parentNode.querySelector('.field-error');
            if (errorEl) {
                errorEl.remove();
            }
        }

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function isValidPhone(phone) {
            return /^[\+]?[0-9\s\-\(\)]{7,20}$/.test(phone);
        }

        // Envío del formulario
        demoForm.addEventListener('submit', function(e) {
        e.preventDefault();
    
        // Validar todos los campos
        let isValid = true;
        inputs.forEach(input => {
            validateField({ target: input });
            if (input.parentNode.querySelector('.field-error')) {
                isValid = false;
            }
        });

        if (!isValid) {
            trackEvent('form_validation_error');
            return;
        }

        // Preparar datos del formulario
        const formData = {
            nombre: demoForm.nombre.value.trim(),
            email: demoForm.email.value.trim(),
            telefono: demoForm.telefono.value.trim(),
            tipo_negocio: demoForm.tipo_negocio.value,
            empleados: demoForm.empleados.value,
            timestamp: new Date().toISOString(),
            source: 'autonomia.mx',
            page_url: window.location.href
        };

        // Mostrar estado de carga
        const submitBtn = demoForm.querySelector('.cta-demo-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        // Enviar a webhook de n8n
        fetch('https://n8n.srv942132.hstgr.cloud/webhook/lead-capture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Envío exitoso
            console.log('Datos enviados exitosamente:', data);
            handleFormSuccess(formData);
        })
        .catch(error => {
            console.error('Error enviando formulario:', error);
            handleFormError();
        })
        .finally(() => {
            // Restaurar botón
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });

    function handleFormError() {
        // Mostrar mensaje de error
        const errorMsg = document.createElement('div');
        errorMsg.className = 'cta-demo-error-msg';
        errorMsg.style.cssText = `
            background: #ef4444;
            color: white;
            border-radius: 1.2rem;
            padding: 2rem 1.5rem;
            text-align: center;
            font-size: 1.1rem;
            font-weight: 600;
            max-width: 480px;
            margin: 1rem auto 0 auto;
            box-shadow: 0 4px 24px rgba(0,0,0,0.10);
        `;
        errorMsg.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;">
                <span style="font-size:1.5rem;display:block;margin-bottom:0.5rem;">⚠️</span>
                <strong>Hubo un problema al enviar tu información</strong><br>
                <span style="font-weight:400;">Por favor intenta nuevamente o contáctanos directamente por WhatsApp al +52 55 5611096935</span>
            </div>
        `;
    
        const demoForm = document.querySelector('#demoForm');
        demoForm.parentNode.insertBefore(errorMsg, demoForm.nextSibling);
    
        // Remover mensaje de error después de 8 segundos
        setTimeout(() => {
            errorMsg.remove();
        }, 8000);

        trackEvent('demo_form_error');
    }

    function handleFormSuccess(formData) {
        // Crear mensaje de confirmación (mantiene el comportamiento actual)
        const confirmMsg = document.createElement('div');
        confirmMsg.className = 'cta-demo-confirm-msg';
        confirmMsg.innerHTML = `
            <div style="width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                <span style="font-size:2.1rem;display:block;margin-bottom:0.7rem;">🎉</span>
                <strong style="font-size:1.35rem;">¡Gracias por tu interés!</strong><br>
                <span style="font-weight:400;">Hemos recibido tu información correctamente.<br>Nos pondremos en contacto contigo a la brevedad para coordinar tu demo gratuita en el horario que mejor te convenga.</span>
            </div>
        `;
    
        const demoForm = document.querySelector('#demoForm');
    
        // Insertar mensaje
        demoForm.parentNode.insertBefore(confirmMsg, demoForm);
    
        // Ocultar formulario
        demoForm.style.display = 'none';
    
        // Scroll suave al mensaje
        confirmMsg.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Analytics
        trackEvent('demo_form_submitted', {
            tipo_negocio: formData.tipo_negocio,
            empleados: formData.empleados,
            source: 'webhook_success'
        });

        // Resetear después de 10 segundos
        setTimeout(function() {
            confirmMsg.remove();
            demoForm.reset();
            demoForm.style.display = '';
        }, 10000);
    }

        /*
        // Envío del formulario
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar todos los campos
            let isValid = true;
            inputs.forEach(input => {
                validateField({ target: input });
                if (input.parentNode.querySelector('.field-error')) {
                    isValid = false;
                }
            });

            if (!isValid) {
                trackEvent('form_validation_error');
                return;
            }

            // Envío exitoso
            handleFormSuccess();
        });

        function handleFormSuccess() {
            // Crear mensaje de confirmación
            const confirmMsg = document.createElement('div');
            confirmMsg.className = 'cta-demo-confirm-msg';
            confirmMsg.innerHTML = `
                <div style="width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
                    <span style="font-size:2.1rem;display:block;margin-bottom:0.7rem;">🎉</span>
                    <strong style="font-size:1.35rem;">¡Gracias por tu interés!</strong><br>
                    <span style="font-weight:400;">Hemos recibido tu información correctamente.<br>Nos pondremos en contacto contigo a la brevedad para coordinar tu demo gratuita en el horario que mejor te convenga.</span>
                </div>
            `;
            
            // Insertar mensaje
            demoForm.parentNode.insertBefore(confirmMsg, demoForm);
            
            // Ocultar formulario
            demoForm.style.display = 'none';
            
            // Scroll suave al mensaje
            confirmMsg.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // Analytics
            trackEvent('demo_form_submitted', {
                tipo_negocio: demoForm.tipo_negocio.value,
                empleados: demoForm.empleados.value
            });

            // Resetear después de 10 segundos
            setTimeout(function() {
                confirmMsg.remove();
                demoForm.reset();
                demoForm.style.display = '';
            }, 10000);
        } */
    }

    // ============================================
    // ANALYTICS Y TRACKING
    // ============================================

    function trackEvent(eventName, eventData = {}) {
        try {
            // Google Analytics 4
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    ...eventData,
                    page_location: window.location.href,
                    page_title: document.title
                });
            }
            
            // Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('track', eventName, eventData);
            }
            
            // Console log para debugging
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Analytics Event:', eventName, eventData);
            }
        } catch (error) {
            console.warn('Error tracking event:', error);
        }
    }

    function initAnalyticsTracking() {
        // Track button clicks
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function() {
                const buttonText = this.textContent.trim();
                const buttonType = this.classList.contains('btn-primary') ? 'primary' : 'secondary';
                const section = this.closest('section')?.id || 'unknown';
                
                trackEvent('button_click', {
                    button_text: buttonText,
                    button_type: buttonType,
                    section: section
                });
            });
        });

        // Track section visibility
        if ('IntersectionObserver' in window) {
            const sectionObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        const sectionName = entry.target.id || entry.target.className;
                        trackEvent('section_view', {
                            section_name: sectionName
                        });
                    }
                });
            }, { 
                threshold: 0.5,
                rootMargin: '-20px'
            });

            document.querySelectorAll('section[id]').forEach(section => {
                sectionObserver.observe(section);
            });
        }

        // Track scroll depth
        let maxScroll = 0;
        const scrollDepthHandler = throttle(function() {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
                maxScroll = scrollPercent;
                trackEvent('scroll_depth', {
                    percent: scrollPercent
                });
            }
        }, 1000);

        window.addEventListener('scroll', scrollDepthHandler, { passive: true });
    }

    // ============================================
    // PERFORMANCE MONITORING
    // ============================================

    function initPerformanceMonitoring() {
        // Web Vitals tracking
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                trackEvent('web_vitals', {
                    metric: 'LCP',
                    value: Math.round(lastEntry.startTime)
                });
            });

            try {
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('LCP observer not supported');
            }

            // Cumulative Layout Shift
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
            });

            try {
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                
                // Enviar CLS cuando la página se oculta
                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'hidden') {
                        trackEvent('web_vitals', {
                            metric: 'CLS',
                            value: Math.round(clsValue * 1000) / 1000
                        });
                    }
                });
            } catch (e) {
                console.warn('CLS observer not supported');
            }
        }

        // First Input Delay (aproximado)
        let firstInputDelay = null;
        const firstInputTypes = ['click', 'mousedown', 'keydown', 'touchstart', 'pointerdown'];
        
        firstInputTypes.forEach(type => {
            document.addEventListener(type, function(e) {
                if (firstInputDelay === null) {
                    firstInputDelay = performance.now() - e.timeStamp;
                    
                    trackEvent('web_vitals', {
                        metric: 'FID',
                        value: Math.round(firstInputDelay)
                    });
                }
            }, { once: true, passive: true });
        });
    }

    // ============================================
    // ERROR HANDLING
    // ============================================

    function initErrorHandling() {
        // JavaScript errors
        window.addEventListener('error', function(e) {
            trackEvent('javascript_error', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                stack: e.error?.stack?.slice(0, 200)
            });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', function(e) {
            trackEvent('promise_rejection', {
                reason: e.reason?.message || String(e.reason).slice(0, 200)
            });
        });

        // Resource loading errors
        document.addEventListener('error', function(e) {
            if (e.target !== window) {
                trackEvent('resource_error', {
                    resource: e.target.tagName.toLowerCase(),
                    source: e.target.src || e.target.href
                });
            }
        }, true);
    }

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    function init() {
        // Inicializar funcionalidades básicas inmediatamente
        initSmoothScrolling();
        initHeaderEffects();
        initMobileMenu();
        initFAQs();
        initDemoForm();
        initErrorHandling();

        // Lazy load funcionalidades menos críticas
        requestIdleCallback(() => {
            initScrollAnimations();
            initLazyLoading();
            initAnalyticsTracking();
            initPerformanceMonitoring();
        });

        // Track page load
        trackEvent('page_load', {
            load_time: performance.timing.loadEventEnd - performance.timing.navigationStart,
            user_agent: navigator.userAgent.slice(0, 100)
        });

        console.log('Autonom.IA - Sitio web cargado correctamente');
        console.log('Versión: 2.0.0 (Optimizada)');
        console.log('Fecha: ' + new Date().toLocaleDateString('es-MX'));
    }

    // Polyfill para requestIdleCallback
    window.requestIdleCallback = window.requestIdleCallback || function(cb) {
        return setTimeout(cb, 1);
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exposer trackEvent para uso externo si es necesario
    window.AutonomiaMX = {
        trackEvent: trackEvent,
        version: '2.0.0'
    };

})();