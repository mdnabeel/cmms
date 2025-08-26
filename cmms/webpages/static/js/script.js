// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initAnimations();
    initDashboardDemo();
    initCounters();
    initSmoothScrolling();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    });
}

// Scroll effects
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
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
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .metric-card, .benefit-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize animations
function initAnimations() {
    // Add CSS for animation classes
    const style = document.createElement('style');
    style.textContent = `
        .feature-card,
        .metric-card,
        .benefit-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }

        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }

        .feature-card:nth-child(2) {
            transition-delay: 0.1s;
        }

        .feature-card:nth-child(3) {
            transition-delay: 0.2s;
        }

        .feature-card:nth-child(4) {
            transition-delay: 0.3s;
        }

        .feature-card:nth-child(5) {
            transition-delay: 0.4s;
        }

        .feature-card:nth-child(6) {
            transition-delay: 0.5s;
        }

        .metric-card:nth-child(2) {
            transition-delay: 0.2s;
        }

        .metric-card:nth-child(3) {
            transition-delay: 0.4s;
        }
    `;
    document.head.appendChild(style);
}

// Dashboard demo functionality
function initDashboardDemo() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Sidebar navigation
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Simulate content change
            animateContentChange();
        });
    });

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Simulate data refresh
            refreshMetrics();
        });
    });

    function animateContentChange() {
        const demoContent = document.querySelector('.demo-content');
        demoContent.style.opacity = '0.5';
        
        setTimeout(() => {
            demoContent.style.opacity = '1';
        }, 200);
    }

    function refreshMetrics() {
        const metricValues = document.querySelectorAll('.metric-value');
        metricValues.forEach(value => {
            const currentText = value.textContent;
            value.style.transform = 'scale(0.8)';
            value.style.opacity = '0.5';
            
            setTimeout(() => {
                // Simulate data change
                if (currentText.includes('%')) {
                    const num = parseFloat(currentText);
                    const variation = (Math.random() - 0.5) * 2;
                    value.textContent = (num + variation).toFixed(1) + '%';
                } else if (!currentText.includes('%')) {
                    const num = parseInt(currentText);
                    const variation = Math.floor((Math.random() - 0.5) * 10);
                    value.textContent = Math.max(0, num + variation);
                }
                
                value.style.transform = 'scale(1)';
                value.style.opacity = '1';
            }, 200);
        });
    }
}

// Counter animation
function initCounters() {
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target.toString().includes('.')) {
                element.textContent = current.toFixed(1) + (target.toString().includes('%') ? '%' : '');
            } else {
                element.textContent = Math.floor(current) + (target.toString().includes('%') ? '%' : '');
            }
        }, 16);
    }

    // Observe metric values for counter animation
    const metricObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = entry.target.textContent;
                const numericValue = parseFloat(target);
                
                if (!isNaN(numericValue)) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target, numericValue);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.metric-value, .stat-number').forEach(el => {
        metricObserver.observe(el);
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Button interactions
document.addEventListener('click', function(e) {
    // Primary buttons
    if (e.target.classList.contains('btn-primary')) {
        if (e.target.textContent.includes('Get Started') || e.target.textContent.includes('Start Free Trial')) {
            showNotification('Redirecting to registration...', 'info');
            // In Django, you would redirect to your registration URL
            // window.location.href = '/register/';
        }
    }
    
    // Secondary buttons
    if (e.target.classList.contains('btn-secondary') || e.target.textContent.includes('Watch Demo')) {
        showNotification('Demo video coming soon!', 'info');
        // In Django, you would open a modal or redirect to demo page
    }
    
    if (e.target.textContent.includes('Schedule Demo')) {
        showNotification('Contact form opening...', 'info');
        // In Django, you would redirect to contact form
        // window.location.href = '/contact/';
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add notification styles
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 90px;
            right: 20px;
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            border-left: 4px solid var(--primary-color);
        }

        .notification-info {
            border-left-color: var(--primary-color);
        }

        .notification-success {
            border-left-color: var(--success-color);
        }

        .notification-warning {
            border-left-color: var(--warning-color);
        }

        .notification-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: var(--text-secondary);
            margin-left: auto;
        }

        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;

    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }

    document.body.appendChild(notification);

    // Close notification
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Form validation utility (for future use with Django forms)
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        const value = input.value.trim();
        
        if (!value) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(value)) {
            showFieldError(input, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: var(--danger-color);
        font-size: 0.875rem;
        margin-top: 5px;
    `;
    
    field.style.borderColor = 'var(--danger-color)';
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Dashboard demo interactions
function initDashboardDemo() {
    const demoMetrics = [
        { element: '.metric-value', values: ['156', '24', '95.2%'] },
    ];

    // Simulate real-time updates
    setInterval(() => {
        const metricValues = document.querySelectorAll('.metric-value');
        metricValues.forEach((value, index) => {
            if (Math.random() < 0.3) { // 30% chance to update
                const currentText = value.textContent;
                let newValue;
                
                if (currentText.includes('%')) {
                    const num = parseFloat(currentText);
                    const variation = (Math.random() - 0.5) * 1;
                    newValue = Math.max(90, Math.min(100, num + variation)).toFixed(1) + '%';
                } else {
                    const num = parseInt(currentText);
                    const variation = Math.floor((Math.random() - 0.5) * 5);
                    newValue = Math.max(0, num + variation).toString();
                }
                
                // Animate value change
                value.style.transform = 'scale(1.1)';
                value.style.color = 'var(--primary-color)';
                
                setTimeout(() => {
                    value.textContent = newValue;
                    value.style.transform = 'scale(1)';
                    value.style.color = '';
                }, 150);
            }
        });
    }, 10000); // Update every 10 seconds
}

// Initialize counter animations
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const countObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateNumber(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        countObserver.observe(counter);
    });
}

function animateNumber(element) {
    const target = element.textContent;
    const isPercentage = target.includes('%');
    const numericValue = parseFloat(target);
    
    if (isNaN(numericValue)) return;

    let current = 0;
    const increment = numericValue / 60; // 60 frames for 1 second at 60fps
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }
        
        if (isPercentage) {
            element.textContent = current.toFixed(1) + '%';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility functions for Django integration
const CMMSUtils = {
    // CSRF token handling for Django
    getCSRFToken: function() {
        const token = document.querySelector('[name=csrfmiddlewaretoken]');
        return token ? token.value : null;
    },

    // API call wrapper for Django views
    apiCall: async function(url, method = 'GET', data = null) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (method !== 'GET' && data) {
            options.body = JSON.stringify(data);
            
            // Add CSRF token for POST requests
            const csrfToken = this.getCSRFToken();
            if (csrfToken) {
                options.headers['X-CSRFToken'] = csrfToken;
            }
        }

        try {
            const response = await fetch(url, options);
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            showNotification('An error occurred. Please try again.', 'warning');
            return null;
        }
    },

    // Form submission handler
    submitForm: function(formElement, successCallback) {
        if (!validateForm(formElement)) {
            return false;
        }

        const formData = new FormData(formElement);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitBtn = formElement.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Please wait...';
        submitBtn.disabled = true;

        // In a real Django app, you would submit to your view
        this.apiCall(formElement.action, 'POST', data)
            .then(response => {
                if (response && response.success) {
                    showNotification('Form submitted successfully!', 'success');
                    if (successCallback) successCallback(response);
                } else {
                    showNotification('Form submission failed. Please try again.', 'warning');
                }
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });

        return true;
    }
};

// Export utilities for global use
window.CMMSUtils = CMMSUtils;

// Page performance monitoring
window.addEventListener('load', function() {
    console.log('CMMS Homepage loaded successfully');
    
    // Optional: Send page load time to Django analytics
    const loadTime = performance.now();
    console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send errors to your Django logging system
});

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
    
    // Enter key for button-like elements
    if (e.key === 'Enter' && e.target.classList.contains('sidebar-item')) {
        e.target.click();
    }
});

// Touch and gesture support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
});

function handleSwipeGesture() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - could trigger scroll to next section
            console.log('Swipe up detected');
        } else {
            // Swipe down - could trigger scroll to previous section
            console.log('Swipe down detected');
        }
    }
}

// Lazy loading for images (if you add images later)
function initLazyLoading() {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Theme switching (for future dark mode implementation)
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
}

// Initialize theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Search functionality (for future implementation)
function initSearch() {
    const searchInput = document.querySelector('#search-input');
    if (!searchInput) return;

    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();
        
        if (query.length > 2) {
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        }
    });
}

function performSearch(query) {
    // In Django, this would call your search endpoint
    console.log('Searching for:', query);
    showNotification(`Searching for "${query}"...`, 'info');
}

// Data refresh functionality
function refreshDashboardData() {
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        
        // Simulate API call to Django backend
        setTimeout(() => {
            refreshMetrics();
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
            showNotification('Dashboard data updated', 'success');
        }, 2000);
    }
}

// Export functions for Django template usage
window.CMMSFunctions = {
    showNotification,
    validateForm,
    refreshDashboardData,
    toggleTheme,
    performSearch
};

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('CMMS application initialized');
    });
} else {
    console.log('CMMS application initialized');
}

 // Login page specific JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Password toggle functionality
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');

    passwordToggle.addEventListener('click', function () {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;

        const icon = this.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });

    // Form validation and submission
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            showNotification('Please fill in all required fields.', 'warning');
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;

        // Simulate login process (replace with actual Django form submission)
        setTimeout(() => {
            // In Django, this form would submit to your login view
            showNotification('Login successful! Redirecting...', 'success');

            setTimeout(() => {
                // Redirect to dashboard
                window.location.href = '/dashboard/';
            }, 1000);
        }, 2000);
    });

    // Social login handlers
    document.querySelector('.btn-google').addEventListener('click', function () {
        showNotification('Google SSO integration coming soon!', 'info');
    });

    document.querySelector('.btn-microsoft').addEventListener('click', function () {
        showNotification('Microsoft SSO integration coming soon!', 'info');
    });
});


// Contact page specific JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');

        question.addEventListener('click', function () {
            const isOpen = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-answer').style.maxHeight = null;
                faq.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
            });

            // Open clicked item if it wasn't already open
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateContactForm()) {
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual Django form submission)
        setTimeout(() => {
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();

            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }, 2000);
    });

    // Form validation
    function validateContactForm() {
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });

        // Email validation
        const email = document.getElementById('email');
        if (email.value && !isValidEmail(email.value)) {
            showFieldError(email, 'Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    }

    // Live chat function
    window.startLiveChat = function () {
        showNotification('Live chat will be available soon! Please use the contact form for now.', 'info');
    };
});



// JS script for login page


// JavaScript - Extract this to login.js for Django



class DjLoginForm {
    constructor() {
        this.form = document.getElementById('djlLoginForm');
        this.loginBtn = document.getElementById('djlLoginBtn');
        this.usernameField = document.getElementById('djlUsername');
        this.passwordField = document.getElementById('djlPassword');
        this.passwordToggle = document.getElementById('djlPasswordToggle');
        this.errorMessage = document.getElementById('djlErrorMessage');
        this.successMessage = document.getElementById('djlSuccessMessage');

        this.djlInit();
    }

    djlInit() {
        this.djlBindEvents();
        this.djlSetupValidation();
    }

    djlBindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.djlHandleSubmit(e));

        // Password toggle
        this.passwordToggle.addEventListener('click', () => this.djlTogglePassword());

        // Real-time validation
        this.usernameField.addEventListener('input', () => this.djlValidateUsername());
        this.passwordField.addEventListener('input', () => this.djlValidatePassword());

        // Input focus effects
        this.djlSetupInputEffects();

        // Social login buttons
        this.djlSetupSocialLogin();
    }

    djlSetupInputEffects() {
        const inputs = [this.usernameField, this.passwordField];

        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.parentElement.querySelector('label').style.color = '#667eea';
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.parentElement.querySelector('label').style.color = '#333';
                }
            });
        });
    }

    djlSetupSocialLogin() {
        const socialBtns = document.querySelectorAll('.djl-social-btn');
        socialBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const provider = btn.classList.contains('djl-google') ? 'Google' : 'GitHub';
                this.djlShowMessage(`${provider} login would be implemented here`, 'info');
            });
        });
    }

    djlSetupValidation() {
        // Add validation patterns and rules here
        this.djlValidationRules = {
            username: {
                required: true,
                minLength: 3,
                pattern: /^[a-zA-Z0-9@._-]+$/
            },
            password: {
                required: true,
                minLength: 6
            }
        };
    }

    djlValidateUsername() {
        const username = this.usernameField.value.trim();
        const validationEl = document.getElementById('djlUsernameValidation');

        if (!username) {
            this.djlShowValidationMessage(validationEl, 'Username is required', 'djl-error');
            this.usernameField.classList.add('djl-invalid');
            this.usernameField.classList.remove('djl-valid');
            return false;
        }

        if (username.length < 3) {
            this.djlShowValidationMessage(validationEl, 'Username must be at least 3 characters', 'djl-error');
            this.usernameField.classList.add('djl-invalid');
            this.usernameField.classList.remove('djl-valid');
            return false;
        }

        if (!this.djlValidationRules.username.pattern.test(username)) {
            this.djlShowValidationMessage(validationEl, 'Username contains invalid characters', 'djl-error');
            this.usernameField.classList.add('djl-invalid');
            this.usernameField.classList.remove('djl-valid');
            return false;
        }

        this.djlHideValidationMessage(validationEl);
        this.usernameField.classList.remove('djl-invalid');
        this.usernameField.classList.add('djl-valid');
        return true;
    }

    djlValidatePassword() {
        const password = this.passwordField.value;
        const validationEl = document.getElementById('djlPasswordValidation');

        if (!password) {
            this.djlShowValidationMessage(validationEl, 'Password is required', 'djl-error');
            this.passwordField.classList.add('djl-invalid');
            this.passwordField.classList.remove('djl-valid');
            return false;
        }

        if (password.length < 6) {
            this.djlShowValidationMessage(validationEl, 'Password must be at least 6 characters', 'djl-error');
            this.passwordField.classList.add('djl-invalid');
            this.passwordField.classList.remove('djl-valid');
            return false;
        }

        this.djlHideValidationMessage(validationEl);
        this.passwordField.classList.remove('djl-invalid');
        this.passwordField.classList.add('djl-valid');
        return true;
    }

    djlShowValidationMessage(element, message, type) {
        element.textContent = message;
        element.className = `djl-validation-message djl-show ${type}`;
    }

    djlHideValidationMessage(element) {
        element.classList.remove('djl-show');
    }

    djlTogglePassword() {
        const type = this.passwordField.type === 'password' ? 'text' : 'password';
        this.passwordField.type = type;

        const icon = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        this.passwordToggle.className = `${icon} djl-password-toggle djl-input-icon`;
    }

    async djlHandleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const isUsernameValid = this.djlValidateUsername();
        const isPasswordValid = this.djlValidatePassword();

        if (!isUsernameValid || !isPasswordValid) {
            this.djlShowMessage('Please correct the errors above', 'error');
            return;
        }

        // Show loading state
        this.djlSetLoadingState(true);
        this.djlHideMessages();

        try {
            // Simulate API call (replace with actual Django form submission)
            await this.djlSimulateLogin();

            // In a real Django app, you would submit the form normally
            // this.form.submit();

        } catch (error) {
            this.djlShowMessage(error.message, 'error');
        } finally {
            this.djlSetLoadingState(false);
        }
    }

    async djlSimulateLogin() {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate success/failure (replace with actual Django authentication)
        const username = this.usernameField.value.trim();
        const password = this.passwordField.value;

        if (username === 'demo' && password === 'password') {
            this.djlShowMessage('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                // In Django, this would be handled by the backend
                window.location.href = '/dashboard/';
            }, 1500);
        } else {
            throw new Error('Invalid username or password. Try demo/password');
        }
    }

    djlSetLoadingState(loading) {
        if (loading) {
            this.loginBtn.classList.add('djl-loading');
            this.loginBtn.disabled = true;
        } else {
            this.loginBtn.classList.remove('djl-loading');
            this.loginBtn.disabled = false;
        }
    }

    djlShowMessage(message, type) {
        this.djlHideMessages();

        const messageEl = type === 'error' ? this.errorMessage : this.successMessage;
        messageEl.textContent = message;
        messageEl.classList.add('djl-show');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageEl.classList.remove('djl-show');
        }, 5000);
    }

    djlHideMessages() {
        this.errorMessage.classList.remove('djl-show');
        this.successMessage.classList.remove('djl-show');
    }
}

// Enhanced animations and interactions
class DjLoginAnimationController {
    constructor() {
        this.djlInit();
    }

    djlInit() {
        this.djlSetupParticleAnimation();
        this.djlSetupScrollEffects();
        this.djlSetupHoverEffects();
    }

    djlSetupParticleAnimation() {
        const particles = document.querySelectorAll('.djl-particle');
        particles.forEach((particle, index) => {
            // Randomize particle properties
            particle.style.animationDuration = `${6 + Math.random() * 4}s`;
            particle.style.animationDelay = `${Math.random() * 2}s`;

            // Add random movement
            setInterval(() => {
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                particle.style.left = x + '%';
                particle.style.top = y + '%';
            }, 8000 + Math.random() * 4000);
        });
    }

    djlSetupScrollEffects() {
        // Add parallax effect on scroll (if needed)
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.djl-bg-animation');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }

    djlSetupHoverEffects() {
        // Add magnetic effect to buttons
        const buttons = document.querySelectorAll('.djl-login-btn, .djl-social-btn');
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }
}

// Global variables with unique names
let djlLoginFormInstance = null;
let djlAnimationControllerInstance = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    djlLoginFormInstance = new DjLoginForm();
    djlAnimationControllerInstance = new DjLoginAnimationController();

    // Add some Easter eggs
    console.log('🔐 Django Login System Ready!');
    console.log('💡 Tip: Try demo/password for testing');
});

// Keyboard shortcuts with unique event listener
const djlHandleKeydown = (e) => {
    // Enter key in any input field
    if (e.key === 'Enter' && (e.target.tagName === 'INPUT')) {
        const form = document.getElementById('djlLoginForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }

    // Escape key to clear form
    if (e.key === 'Escape') {
        const usernameField = document.getElementById('djlUsername');
        const passwordField = document.getElementById('djlPassword');
        if (usernameField && passwordField) {
            usernameField.value = '';
            passwordField.value = '';
            usernameField.focus();
        }
    }
};

document.addEventListener('keydown', djlHandleKeydown);

// Add some performance optimizations with unique function names
if ('serviceWorker' in navigator) {
    // Register service worker for PWA capabilities (optional)
    console.log('Service Worker supported - DjLogin');
}

// Preload resources with unique function name
const djlPreloadResources = () => {
    const links = [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    ];

    links.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
};

// Call preload when appropriate
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', djlPreloadResources);
} else {
    djlPreloadResources();
}

// Utility functions with unique names
const djlUtils = {
    debounce: function (func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle: function (func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Expose global API for external access if needed
window.DjLoginAPI = {
    getInstance: () => djlLoginFormInstance,
    getAnimationController: () => djlAnimationControllerInstance,
    utils: djlUtils
};
