// Netflix-style romantic photo sliders
class RomanticSlider {
    constructor(sliderId, dotsId) {
        this.slider = document.getElementById(sliderId);
        this.dotsContainer = document.getElementById(dotsId);
        this.slides = this.slider.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.autoSlideInterval = null;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.startAutoSlide();
        this.addEventListeners();
    }
    
    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        this.dots = this.dotsContainer.querySelectorAll('.dot');
    }
    
    goToSlide(slideIndex) {
        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        
        // Add active class to new slide and dot
        this.currentSlide = slideIndex;
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 4000); // Change slide every 4 seconds
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    addEventListeners() {
        // Pause auto-slide on hover
        this.slider.addEventListener('mouseenter', () => {
            this.stopAutoSlide();
        });
        
        // Resume auto-slide when mouse leaves
        this.slider.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
        
        // Touch/swipe support for mobile
        let startX = 0;
        let endX = 0;
        
        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.slider.matches(':hover')) {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            }
        });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
}

// Initialize all sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create sliders for all 10 episodes
    const sliders = [];
    
    for (let i = 1; i <= 10; i++) {
        sliders.push(new RomanticSlider(`slider${i}`, `dots${i}`));
    }
    
    // Smooth scroll function for the play button
    window.scrollToEpisodes = function() {
        document.getElementById('episodios').scrollIntoView({
            behavior: 'smooth'
        });
    };
    
    // Add loading animation for images
    const images = document.querySelectorAll('.slide img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Add error handling for broken images
        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/300x200/e50914/ffffff?text=Foto+do+Amor';
        });
    });
    
    // Intersection Observer for episode animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all episode rows
    document.querySelectorAll('.episode-row').forEach(row => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(50px)';
        row.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(row);
    });
});