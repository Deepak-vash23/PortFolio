// Vanilla JavaScript Blur Text Effect
class BlurText {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            text: element.textContent || '',
            delay: options.delay || 200,
            animateBy: options.animateBy || 'words', // 'words' or 'chars'
            direction: options.direction || 'top',
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '0px',
            stepDuration: options.stepDuration || 0.35,
            ...options
        };
        
        this.init();
    }

    init() {
        const elements = this.options.animateBy === 'words' 
            ? this.options.text.split(' ') 
            : this.options.text.split('');
        
        // Clear the original text
        this.element.innerHTML = '';
        this.element.style.display = 'inline-flex';
        this.element.style.flexWrap = 'wrap';
        this.element.style.alignItems = 'baseline';
        
        // Create spans for each element
        this.spans = elements.map((segment, index) => {
            const span = document.createElement('span');
            span.style.display = 'inline-block';
            span.style.willChange = 'transform, filter, opacity';
            span.textContent = segment === ' ' ? '\u00A0' : segment;
            
            // Initial blur state
            this.setInitialState(span);
            
            this.element.appendChild(span);
            
            // Add space after words (except last one)
            if (this.options.animateBy === 'words' && index < elements.length - 1) {
                const space = document.createElement('span');
                space.textContent = '\u00A0';
                space.style.display = 'inline-block';
                this.element.appendChild(space);
            }
            
            return span;
        });
        
        this.setupIntersectionObserver();
    }

    setInitialState(span) {
        const y = this.options.direction === 'top' ? -50 : 50;
        span.style.filter = 'blur(10px)';
        span.style.opacity = '0';
        span.style.transform = `translateY(${y}px)`;
        span.style.transition = `all ${this.options.stepDuration}s ease-out`;
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animate();
                        observer.unobserve(this.element);
                    }
                });
            },
            {
                threshold: this.options.threshold,
                rootMargin: this.options.rootMargin
            }
        );
        
        observer.observe(this.element);
    }

    animate() {
        this.spans.forEach((span, index) => {
            const delay = (index * this.options.delay) / 1000;
            
            setTimeout(() => {
                // First step: partial blur reduction
                span.style.filter = 'blur(5px)';
                span.style.opacity = '0.5';
                span.style.transform = `translateY(${this.options.direction === 'top' ? 5 : -5}px)`;
                
                // Second step: complete clarity
                setTimeout(() => {
                    span.style.filter = 'blur(0px)';
                    span.style.opacity = '1';
                    span.style.transform = 'translateY(0px)';
                }, this.options.stepDuration * 500);
                
            }, delay * 1000);
        });
    }
}

// Initialize blur text effect
function initBlurText() {
    // Find elements with blur-text class or data attribute
    const blurTextElements = document.querySelectorAll('.blur-text, [data-blur-text]');
    
    blurTextElements.forEach(element => {
        const options = {
            delay: element.dataset.delay || 100,
            animateBy: element.dataset.animateBy || 'words',
            direction: element.dataset.direction || 'top',
            stepDuration: element.dataset.stepDuration || 0.35
        };
        
        new BlurText(element, options);
    });
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlurText);
} else {
    initBlurText();
}

// Export for manual initialization
window.BlurText = BlurText;
window.initBlurText = initBlurText;
