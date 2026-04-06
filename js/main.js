/* ================================
   TRANSPORTES CASTRO - JAVASCRIPT PRINCIPAL
   ================================ */

// ========== DOM Elements ==========
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const socialSidebar = document.querySelector('.social-sidebar');
const contactToggle = document.querySelector('.contact-toggle');
const contactWidget = document.querySelector('.contact-widget');
const closeWidget = document.querySelector('.close-widget');
const canvas = document.getElementById('canvas-bg');
const truck1 = document.querySelector('[data-truck="1"]');
const truck2 = document.querySelector('[data-truck="2"]');
const timeline = document.querySelector('.timeline');

// Barra de progreso superior para dar feedback visual de scroll
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

// ========== CANVAS ANIMATED BACKGROUND ==========
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    let particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = `rgba(233, 69, 96, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Conectar partículas cercanas
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.strokeStyle = `rgba(233, 69, 96, ${0.1 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animateCanvas);
    }
    
    animateCanvas();
}

// ========== NAVBAR SCROLL EFFECT ==========
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.16)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
    }
    
    // Update active nav link
    updateActiveLink();

    // Progreso vertical de lectura
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;

    // Progreso de timeline cuando está en viewport
    if (timeline) {
        const section = document.getElementById('historia');
        if (section) {
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const start = viewportHeight * 0.9;
            const total = rect.height + viewportHeight * 0.5;
            const passed = start - rect.top;
            const timelineProgress = Math.min(100, Math.max(0, (passed / total) * 100));
            timeline.style.setProperty('--timeline-progress', `${timelineProgress}%`);
        }
    }
});

// ========== HAMBURGER MENU ==========
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer click en un enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ========== ACTIVE NAVIGATION LINK ==========
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// ========== CONTACT WIDGET ==========
contactToggle.addEventListener('click', () => {
    contactWidget.classList.toggle('active');
});

closeWidget.addEventListener('click', () => {
    contactWidget.classList.remove('active');
});

// Cerrar widget al hacer click fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('.contact-widget') && 
        !e.target.closest('.contact-toggle')) {
        contactWidget.classList.remove('active');
    }
});

// ========== DECORATIVE TRUCKS ANIMATION ON SCROLL ==========
let truckAnimationTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(truckAnimationTimeout);
    
    // Aparecer camiones izquierdo
    truck1.classList.add('animate');
    
    // Luego el derecho con delay
    truckAnimationTimeout = setTimeout(() => {
        truck2.classList.add('animate');
    }, 800);
});

// ========== INTERSECTION OBSERVER PARA ANIMACIONES AL SCROLL ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Agregamos delay si tiene clase de stagger
            const delay = entry.target.classList.contains('card-stagger') 
                ? window.getComputedStyle(entry.target).animationDelay 
                : '0s';
            
            // Detectar qué tipo de scroll-reveal tiene
            if (entry.target.classList.contains('scroll-reveal-scale')) {
                entry.target.classList.add('active');
            } else if (entry.target.classList.contains('scroll-reveal-left')) {
                entry.target.classList.add('active');
            } else if (entry.target.classList.contains('scroll-reveal-right')) {
                entry.target.classList.add('active');
            } else if (entry.target.classList.contains('scroll-reveal-rotate')) {
                entry.target.classList.add('active');
            } else if (entry.target.classList.contains('scroll-reveal-zoom')) {
                entry.target.classList.add('active');
            } else if (entry.target.classList.contains('scroll-reveal-flip')) {
                entry.target.classList.add('active');
            } else if (entry.target.classList.contains('scroll-reveal-roll')) {
                entry.target.classList.add('active');
            } else if (entry.target.classList.contains('scroll-reveal')) {
                entry.target.classList.add('active');
            } else {
                // Default es fadeUp
                entry.target.classList.add('fade-in-on-scroll');
            }

            // Las secciones principales activan efectos globales de entrada
            if (entry.target.classList.contains('scroll-section')) {
                entry.target.classList.add('in-view');
            }
        }
    });
}, observerOptions);

// Observar elementos específicos
const elementsToAnimate = document.querySelectorAll(
    '.timeline-item, .empresa-card, .institutional-card, .info-card, ' +
    '.scroll-reveal, .scroll-reveal-scale, .scroll-reveal-left, .scroll-reveal-right, ' +
    '.scroll-reveal-rotate, .scroll-reveal-zoom, .scroll-reveal-flip, .scroll-reveal-roll, ' +
    '.fade-in-on-scroll, .card-stagger, .scroll-section'
);

elementsToAnimate.forEach(element => {
    // Setear animación inicial directamente en la clase scroll-reveal
    if (!element.classList.contains('fade-in-on-scroll')) {
        scrollObserver.observe(element);
    }
});

// ========== FORM SUBMISSION ==========
const contactForm = document.querySelector('.contacto-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button');
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-check"></i> <span>Mensaje Enviado</span>';
        btn.style.background = '#18a24a';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
            contactForm.reset();
        }, 3000);
    });
}

// ========== SMOOTH SCROLL BEHAVIOR ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== PARALLAX EFFECT ON SCROLL ==========
const hero = document.querySelector('.hero');
const heroBackground = document.querySelector('.hero-background');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrollY * 0.12}px)`;
    }
});

// ========== TRIGGER TRUCKS ON PAGE LOAD ==========
window.addEventListener('load', () => {
    setTimeout(() => {
        truck1.classList.add('animate');
        setTimeout(() => {
            truck2.classList.add('animate');
        }, 800);
    }, 500);
});

// ========== SCROLL REVEAL FOR CARDS ==========
const revealCards = () => {
    // Se deja para compatibilidad, pero el IntersectionObserver controla las entradas.
};

// ========== MOUSE TRACKING EFFECT ==========
document.addEventListener('mousemove', (e) => {
    const floatingBoxes = document.querySelectorAll('.floating-box');
    
    floatingBoxes.forEach(box => {
        const rect = box.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const distance = 10;
        
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;
        
        box.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
});

// ========== RIPPLE EFFECT ON BUTTONS ==========
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.borderRadius = '50%';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.animation = 'rippleAnimation 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ========== ADD RIPPLE ANIMATION ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleAnimation {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== INIT FUNCTION ==========
function init() {
    updateActiveLink();
    revealCards();
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

console.log('✓ Transportes Castro - Web activa y con animaciones');
