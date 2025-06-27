// Dynamic Network Lines Background with Light & Grass Effects
class TechBackground {
    constructor() {
        this.canvas = document.getElementById('tech-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.lightPulses = [];
        this.grassEffect = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        this.theme = 'dark';
        
        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        this.resize();
        this.createNodes();
        this.createGrassEffect();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createNodes() {
        this.nodes = [];
        const nodeCount = Math.floor((window.innerWidth * window.innerHeight) / 25000);
        
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.7 + 0.3,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
        
        // Create initial connections
        this.updateConnections();
    }

    createGrassEffect() {
        this.grassEffect = [];
        const grassCount = Math.floor(window.innerWidth / 10);
        
        for (let i = 0; i < grassCount; i++) {
            this.grassEffect.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height - Math.random() * 100,
                height: Math.random() * 60 + 20,
                sway: Math.random() * 0.02 + 0.01,
                phase: Math.random() * Math.PI * 2,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }

    updateNodes() {
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // Boundary collision with soft bounce
            if (node.x < 0 || node.x > this.canvas.width) {
                node.vx *= -0.8;
                node.x = Math.max(0, Math.min(this.canvas.width, node.x));
            }
            if (node.y < 0 || node.y > this.canvas.height) {
                node.vy *= -0.8;
                node.y = Math.max(0, Math.min(this.canvas.height, node.y));
            }

            // Mouse interaction - nodes are attracted to mouse
            const dx = this.mouse.x - node.x;
            const dy = this.mouse.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150 && distance > 0) {
                const force = (150 - distance) / 150 * 0.002;
                node.vx += dx * force;
                node.vy += dy * force;
            }

            // Update pulse phase
            node.pulsePhase += 0.02;
        });
    }

    updateConnections() {
        this.connections = [];
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.connections.push({
                        start: this.nodes[i],
                        end: this.nodes[j],
                        distance: distance,
                        strength: (150 - distance) / 150
                    });
                }
            }
        }
    }

    createLightPulse(connection) {
        if (Math.random() < 0.01) {
            this.lightPulses.push({
                connection: connection,
                progress: 0,
                speed: 0.02 + Math.random() * 0.03,
                intensity: Math.random() * 0.8 + 0.2,
                life: 1.0
            });
        }
    }

    updateLightPulses() {
        this.lightPulses = this.lightPulses.filter(pulse => {
            pulse.progress += pulse.speed;
            pulse.life -= 0.01;
            return pulse.progress < 1 && pulse.life > 0;
        });
    }

    drawNodes() {
        const nodeColor = this.theme === 'light' ? '#00b366' : '#00ff88';
        
        this.nodes.forEach(node => {
            const pulseSize = Math.sin(node.pulsePhase) * 0.5 + 1;
            
            this.ctx.save();
            this.ctx.globalAlpha = node.opacity * pulseSize * (this.theme === 'light' ? 0.8 : 1);
            
            // Main node
            this.ctx.fillStyle = nodeColor;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.size * pulseSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Glow effect
            this.ctx.globalAlpha = (node.opacity * pulseSize) * (this.theme === 'light' ? 0.2 : 0.3);
            this.ctx.fillStyle = nodeColor;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.size * pulseSize * 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    drawConnections() {
        const lineColor = this.theme === 'light' ? '#00b366' : '#00ff88';
        const alphaMultiplier = this.theme === 'light' ? 0.6 : 1;
        
        this.connections.forEach(connection => {
            this.ctx.save();
            
            // Base connection line
            this.ctx.globalAlpha = connection.strength * 0.3 * alphaMultiplier;
            this.ctx.strokeStyle = lineColor;
            this.ctx.lineWidth = connection.strength * 1.5;
            this.ctx.beginPath();
            this.ctx.moveTo(connection.start.x, connection.start.y);
            this.ctx.lineTo(connection.end.x, connection.end.y);
            this.ctx.stroke();
            
            // Add subtle gradient effect
            const gradient = this.ctx.createLinearGradient(
                connection.start.x, connection.start.y,
                connection.end.x, connection.end.y
            );
            
            if (this.theme === 'light') {
                gradient.addColorStop(0, 'rgba(0, 179, 102, 0.08)');
                gradient.addColorStop(0.5, 'rgba(0, 179, 102, 0.2)');
                gradient.addColorStop(1, 'rgba(0, 179, 102, 0.08)');
            } else {
                gradient.addColorStop(0, 'rgba(0, 255, 136, 0.1)');
                gradient.addColorStop(0.5, 'rgba(0, 255, 136, 0.3)');
                gradient.addColorStop(1, 'rgba(0, 255, 136, 0.1)');
            }
            
            this.ctx.globalAlpha = connection.strength * 0.5 * alphaMultiplier;
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = connection.strength * 2;
            this.ctx.stroke();
            
            this.ctx.restore();
            
            // Create occasional light pulses
            this.createLightPulse(connection);
        });
    }

    drawLightPulses() {
        const pulseColor = this.theme === 'light' ? '#00b366' : '#00ff88';
        const pulseCenter = this.theme === 'light' ? '#ffffff' : '#ffffff';
        
        this.lightPulses.forEach(pulse => {
            const connection = pulse.connection;
            const x = connection.start.x + (connection.end.x - connection.start.x) * pulse.progress;
            const y = connection.start.y + (connection.end.y - connection.start.y) * pulse.progress;
            
            this.ctx.save();
            this.ctx.globalAlpha = pulse.intensity * pulse.life * (this.theme === 'light' ? 0.8 : 1);
            
            // Bright pulse dot
            this.ctx.fillStyle = pulseCenter;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Glow around pulse
            this.ctx.globalAlpha = (pulse.intensity * pulse.life) * (this.theme === 'light' ? 0.3 : 0.5);
            this.ctx.fillStyle = pulseColor;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    drawGrassEffect() {
        const grassColor = this.theme === 'light' ? '#00b366' : '#00ff88';
        const alphaMultiplier = this.theme === 'light' ? 0.7 : 1;
        
        this.grassEffect.forEach(grass => {
            const swayOffset = Math.sin(this.time * grass.sway + grass.phase) * 10;
            
            this.ctx.save();
            this.ctx.globalAlpha = grass.opacity * alphaMultiplier;
            this.ctx.strokeStyle = grassColor;
            this.ctx.lineWidth = 1;
            this.ctx.lineCap = 'round';
            
            // Draw grass blade
            this.ctx.beginPath();
            this.ctx.moveTo(grass.x, grass.y);
            this.ctx.quadraticCurveTo(
                grass.x + swayOffset / 2,
                grass.y - grass.height / 2,
                grass.x + swayOffset,
                grass.y - grass.height
            );
            this.ctx.stroke();
            
            // Add subtle glow
            this.ctx.globalAlpha = grass.opacity * (this.theme === 'light' ? 0.2 : 0.3);
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            
            this.ctx.restore();
        });
    }

    updateTheme(theme) {
        this.theme = theme;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.time += 0.01;
        
        this.updateNodes();
        this.updateConnections();
        this.updateLightPulses();
        
        this.drawGrassEffect();
        this.drawConnections();
        this.drawLightPulses();
        this.drawNodes();
        
        requestAnimationFrame(() => this.animate());
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createNodes();
            this.createGrassEffect();
        });

        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
}

// Smooth Scrolling Navigation
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', this.updateActiveNav);
    }

    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Mobile Navigation
class MobileNav {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }

    init() {
        this.navToggle.addEventListener('click', () => this.toggleMenu());
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    toggleMenu() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

// Contact Form Validation
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add floating label effects
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            input.addEventListener('blur', () => {
                if (input.value.trim() !== '') {
                    input.setAttribute('data-filled', 'true');
                } else {
                    input.removeAttribute('data-filled');
                }
            });
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        if (this.validateForm(data)) {
            this.showSuccess();
            this.form.reset();
        }
    }

    validateForm(data) {
        let isValid = true;
        const errors = [];

        if (!data.name.trim()) {
            errors.push('Name is required');
            isValid = false;
        }

        if (!data.email.trim()) {
            errors.push('Email is required');
            isValid = false;
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email');
            isValid = false;
        }

        if (!data.subject.trim()) {
            errors.push('Subject is required');
            isValid = false;
        }

        if (!data.message.trim()) {
            errors.push('Message is required');
            isValid = false;
        }

        if (!isValid) {
            this.showErrors(errors);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showSuccess() {
        const button = this.form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        button.style.background = '#00cc6a';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 3000);
    }

    showErrors(errors) {
        const button = this.form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Please check your inputs';
        button.style.background = '#ff4444';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 3000);
        
        console.log('Form errors:', errors);
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.project-card, .skill-category, .about-stats, .contact-item');
        animateElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }
}

// Header Scroll Effect
class HeaderEffect {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        });
    }
}

// Typing Animation for Hero Section
class TypingAnimation {
    constructor() {
        this.element = document.querySelector('.hero-subtitle');
        this.texts = [
            'Full Stack Developer & Solution Architect',
            'Enterprise Systems Specialist',
            'IoT & Microcontroller Expert',
            'Distributed Systems Architect'
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (this.element) {
            this.type();
        }
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let typeSpeed = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Theme Switcher
class ThemeSwitcher {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.body = document.body;
        
        this.init();
    }

    init() {
        // Check for saved theme preference or default to dark theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
        
        // Add click event listener
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        if (theme === 'light') {
            this.body.setAttribute('data-theme', 'light');
            this.themeIcon.className = 'fas fa-moon';
        } else {
            this.body.removeAttribute('data-theme');
            this.themeIcon.className = 'fas fa-sun';
        }
        
        // Save theme preference
        localStorage.setItem('theme', theme);
        
        // Update background animation
        if (window.techBackground) {
            window.techBackground.updateTheme(theme);
        }
    }

    toggleTheme() {
        const currentTheme = this.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    getCurrentTheme() {
        return this.body.getAttribute('data-theme') || 'dark';
    }
}

// Add CSS for scroll animations
const animationStyles = `
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .fade-in.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .header.scrolled {
        background: rgba(10, 10, 10, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }

    [data-theme="light"] .header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.techBackground = new TechBackground();
    new SmoothScroll();
    new MobileNav();
    new ContactForm();
    new ScrollAnimations();
    new HeaderEffect();
    new TypingAnimation();
    new ThemeSwitcher();
});

// Performance optimization for scroll events
let ticking = false;

function updateOnScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            SmoothScroll.prototype.updateActiveNav();
            ticking = false;
        });
        ticking = true;
    }
}