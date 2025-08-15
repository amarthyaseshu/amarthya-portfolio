/* UPDATED PERSONAL WEBSITE JAVASCRIPT - NO TYPING ANIMATION VERSION
============================================= 
Updated Version Changes:
- Removed typing animation functionality
- Simplified hero section interaction
- Maintained all other features: navigation, theme toggle, skills animation, etc.
- Enhanced mobile responsiveness
- Added professional experience section support

This JavaScript file contains interactive functionality for the personal website:
- Navigation: Mobile hamburger menu, smooth scrolling, active link highlighting
- Theme System: Dark/light mode toggle with localStorage persistence
- Animations: Skill bars, scroll-triggered reveals (NO typing animation)
- Project Tabs: Dynamic content switching between professional/personal projects
- Scroll Effects: Progress tracking and section highlighting
*/

/* ========================================
GLOBAL VARIABLES AND CONFIGURATION
======================================== */

// Configuration object for easy customization
const CONFIG = {
    // Animation timing and delays
    SCROLL_THRESHOLD: 0.1, // Intersection observer threshold
    SKILL_ANIMATION_DELAY: 200, // Delay between skill bar animations
    
    // Theme configuration
    THEME_KEY: 'preferred-theme', // LocalStorage key for theme preference
    DEFAULT_THEME: 'light' // Default theme if none saved
};

// Global state management
const STATE = {
    currentTheme: CONFIG.DEFAULT_THEME,
    skillsAnimated: false,
    activeSection: 'home'
};

// DOM element cache for performance optimization
const ELEMENTS = {
    // Navigation elements
    navbar: null,
    navMenu: null,
    navLinks: null,
    hamburger: null,
    
    // Theme toggle
    themeToggle: null,
    themeIcon: null,
    
    // Skills elements
    skillItems: null,
    skillBars: null,
    
    // Project elements
    projectTabs: null,
    projectContents: null
};

/* ========================================
INITIALIZATION AND DOM READY
======================================== */

/**
 * Initialize the application when DOM is fully loaded
 * Sets up all event listeners and initializes components
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing John Doe\'s Personal Website');
    
    // Cache DOM elements for performance
    cacheElements();
    
    // Initialize all components
    initializeNavigation();
    initializeThemeToggle();
    initializeSkillAnimations();
    initializeProjectTabs();
    initializeScrollEffects();
    
    // Set initial theme
    applyStoredTheme();
    
    console.log('✅ Website initialization complete');
});

/**
 * Cache frequently used DOM elements to avoid repeated queries
 * This improves performance by reducing DOM lookups
 */
function cacheElements() {
    // Navigation elements
    ELEMENTS.navbar = document.getElementById('navbar');
    ELEMENTS.navMenu = document.getElementById('nav-menu');
    ELEMENTS.navLinks = document.querySelectorAll('.nav-link');
    ELEMENTS.hamburger = document.getElementById('hamburger');
    
    // Theme toggle elements
    ELEMENTS.themeToggle = document.getElementById('theme-toggle');
    ELEMENTS.themeIcon = document.getElementById('theme-icon');
    
    // Skills section elements
    ELEMENTS.skillItems = document.querySelectorAll('.skill-item');
    ELEMENTS.skillBars = document.querySelectorAll('.skill-progress');
    
    // Project elements
    ELEMENTS.projectTabs = document.querySelectorAll('.tab-button');
    ELEMENTS.projectContents = document.querySelectorAll('.project-content');
}

/* ========================================
NAVIGATION FUNCTIONALITY
======================================== */

/**
 * Initialize navigation functionality
 * - Mobile hamburger menu toggle
 * - Smooth scrolling to sections
 * - Active link highlighting based on scroll position
 */
function initializeNavigation() {
    // Mobile hamburger menu toggle
    if (ELEMENTS.hamburger && ELEMENTS.navMenu) {
        ELEMENTS.hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scrolling for navigation links
    ELEMENTS.navLinks.forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
    });
    
    // Add click handlers for hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', handleHeroButtonClick);
    });
    
    // Update active navigation link based on scroll position
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', handleOutsideClick);
    
    console.log('📱 Navigation initialized');
}

/**
 * Toggle mobile hamburger menu
 * Adds/removes active class and handles accessibility
 */
function toggleMobileMenu() {
    const isActive = ELEMENTS.navMenu.classList.contains('active');
    
    if (isActive) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

/**
 * Open mobile navigation menu
 */
function openMobileMenu() {
    ELEMENTS.navMenu.classList.add('active');
    ELEMENTS.hamburger.classList.add('active');
    ELEMENTS.hamburger.setAttribute('aria-expanded', 'true');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
}

/**
 * Close mobile navigation menu
 */
function closeMobileMenu() {
    ELEMENTS.navMenu.classList.remove('active');
    ELEMENTS.hamburger.classList.remove('active');
    ELEMENTS.hamburger.setAttribute('aria-expanded', 'false');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

/**
 * Handle navigation link clicks
 * Implements smooth scrolling and closes mobile menu
 * @param {Event} event - Click event
 */
function handleNavLinkClick(event) {
    event.preventDefault();
    
    const targetId = event.target.getAttribute('href');
    scrollToSection(targetId);
    
    // Close mobile menu if open
    closeMobileMenu();
    
    // Update active link immediately
    updateActiveLink(event.target);
    
    console.log(`📍 Navigating to section: ${targetId}`);
}

/**
 * Handle hero button clicks
 * @param {Event} event - Click event
 */
function handleHeroButtonClick(event) {
    event.preventDefault();
    
    const targetId = event.target.getAttribute('href');
    if (targetId) {
        scrollToSection(targetId);
        console.log(`🎯 Hero button clicked: ${targetId}`);
    }
}

/**
 * Smooth scroll to a section
 * @param {string} targetId - Section ID to scroll to
 */
function scrollToSection(targetId) {
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        // Calculate offset for fixed navbar
        const navbarHeight = ELEMENTS.navbar ? ELEMENTS.navbar.offsetHeight : 60;
        const elementPosition = targetElement.offsetTop - navbarHeight;
        
        // Smooth scroll to target section
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
        
        // Update state
        STATE.activeSection = targetId.substring(1); // Remove # from ID
    }
}

/**
 * Update active navigation link based on current section
 * Uses intersection observer for accurate detection
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 100; // Offset for navbar height
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Update active state if section changed
    if (currentSection && currentSection !== STATE.activeSection) {
        STATE.activeSection = currentSection;
        const activeLink = document.querySelector(`a[href="#${currentSection}"]`);
        if (activeLink) {
            updateActiveLink(activeLink);
        }
    }
}

/**
 * Update active link styling
 * @param {Element} activeLink - The link element to make active
 */
function updateActiveLink(activeLink) {
    // Remove active class from all links
    ELEMENTS.navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to current link
    activeLink.classList.add('active');
}

/**
 * Handle clicks outside mobile menu to close it
 * @param {Event} event - Click event
 */
function handleOutsideClick(event) {
    if (ELEMENTS.navMenu.classList.contains('active') && 
        !ELEMENTS.navMenu.contains(event.target) && 
        !ELEMENTS.hamburger.contains(event.target)) {
        closeMobileMenu();
    }
}

/* ========================================
THEME TOGGLE FUNCTIONALITY
======================================== */

/**
 * Initialize theme toggle functionality
 * Sets up event listener and loads saved theme preference
 */
function initializeThemeToggle() {
    if (ELEMENTS.themeToggle) {
        ELEMENTS.themeToggle.addEventListener('click', toggleTheme);
        console.log('🎨 Theme toggle initialized');
    }
}

/**
 * Toggle between light and dark themes
 * Updates DOM, icon, and saves preference to localStorage
 */
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Apply new theme
    applyTheme(newTheme);
    
    // Save preference
    localStorage.setItem(CONFIG.THEME_KEY, newTheme);
    
    console.log(`🌓 Theme changed to: ${newTheme}`);
}

/**
 * Apply theme to the document
 * @param {string} theme - Theme name ('light' or 'dark')
 */
function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    STATE.currentTheme = theme;
    
    // Update theme toggle icon
    updateThemeIcon(theme);
    
    // Add smooth transition for theme change
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

/**
 * Update theme toggle icon based on current theme
 * @param {string} theme - Current theme name
 */
function updateThemeIcon(theme) {
    if (ELEMENTS.themeIcon) {
        const iconClass = theme === 'dark' ? 'fa-sun' : 'fa-moon';
        ELEMENTS.themeIcon.className = `fas ${iconClass}`;
        
        // Update accessibility label
        ELEMENTS.themeToggle.setAttribute('aria-label', 
            `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    }
}

/**
 * Apply stored theme preference from localStorage
 * Falls back to system preference if no stored preference
 */
function applyStoredTheme() {
    let storedTheme = localStorage.getItem(CONFIG.THEME_KEY);
    
    // If no stored theme, check system preference
    if (!storedTheme) {
        storedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    applyTheme(storedTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(CONFIG.THEME_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

/* ========================================
SKILLS ANIMATION FUNCTIONALITY
======================================== */

/**
 * Initialize skill progress bar animations
 * Uses intersection observer to trigger animations when visible
 */
function initializeSkillAnimations() {
    if (ELEMENTS.skillItems.length > 0) {
        const observer = new IntersectionObserver(handleSkillsInView, {
            threshold: CONFIG.SCROLL_THRESHOLD,
            rootMargin: '-50px'
        });
        
        // Observe skills section
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            observer.observe(skillsSection);
        }
        
        console.log('📊 Skills animations initialized');
    }
}

/**
 * Handle skills section coming into view
 * Triggers skill bar animations with staggered delays
 * @param {IntersectionObserverEntry[]} entries - Observer entries
 */
function handleSkillsInView(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !STATE.skillsAnimated) {
            STATE.skillsAnimated = true;
            animateSkillBars();
        }
    });
}

/**
 * Animate all skill progress bars
 * Creates staggered animation effect for visual appeal
 */
function animateSkillBars() {
    ELEMENTS.skillItems.forEach((skillItem, index) => {
        setTimeout(() => {
            // Add animation class
            skillItem.classList.add('animate');
            
            // Get skill percentage and animate progress bar
            const skillLevel = parseInt(skillItem.getAttribute('data-skill'));
            const progressBar = skillItem.querySelector('.skill-progress');
            
            if (progressBar) {
                // Start progress bar animation
                setTimeout(() => {
                    progressBar.style.width = `${skillLevel}%`;
                }, 200);
            }
        }, index * CONFIG.SKILL_ANIMATION_DELAY);
    });
    
    console.log('🎯 Skills animated');
}

/* ========================================
PROJECT TABS FUNCTIONALITY
======================================== */

/**
 * Initialize project tabs functionality
 * Allows switching between professional and personal projects
 */
function initializeProjectTabs() {
    if (ELEMENTS.projectTabs.length > 0) {
        ELEMENTS.projectTabs.forEach(tab => {
            tab.addEventListener('click', handleTabClick);
        });
        
        // Ensure default tab is active
        const defaultTab = document.querySelector('.tab-button.active');
        if (defaultTab) {
            const targetContent = defaultTab.getAttribute('data-tab');
            showProjectContent(targetContent);
        }
        
        console.log('📁 Project tabs initialized');
    }
}

/**
 * Handle project tab click events
 * Switches active tab and shows corresponding content
 * @param {Event} event - Click event
 */
function handleTabClick(event) {
    const clickedTab = event.target;
    const targetContent = clickedTab.getAttribute('data-tab');
    
    // Update active tab
    ELEMENTS.projectTabs.forEach(tab => tab.classList.remove('active'));
    clickedTab.classList.add('active');
    
    // Show corresponding content
    showProjectContent(targetContent);
    
    console.log(`📂 Switched to ${targetContent} projects`);
}

/**
 * Show specific project content
 * @param {string} contentId - ID of content to show
 */
function showProjectContent(contentId) {
    ELEMENTS.projectContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === contentId) {
            content.classList.add('active');
        }
    });
}

/* ========================================
SCROLL EFFECTS AND UTILITIES
======================================== */

/**
 * Initialize scroll-based effects
 * Sets up intersection observers for reveal animations
 */
function initializeScrollEffects() {
    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }
    
    console.log('🔄 Scroll effects initialized');
}

/* ========================================
UTILITY FUNCTIONS
======================================== */

/**
 * Throttle function to limit the rate at which a function can fire
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
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
    };
}

/**
 * Debounce function to delay function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately
 * @returns {Function} - Debounced function
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Check if email is valid
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* ========================================
PERFORMANCE OPTIMIZATIONS
======================================== */

// Preload critical resources
window.addEventListener('load', () => {
    // Preload images for better performance
    const imagesToPreload = [
        'https://via.placeholder.com/300x200/e1f5fe/0277bd?text=AWS+Certificate',
        'https://via.placeholder.com/300x200/fff3e0/f57c00?text=Oracle+Certificate',
        'https://via.placeholder.com/300x200/e8f5e8/2e7d32?text=Spring+Certificate'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Resume animations or heavy operations
        console.log('🔄 Page visible - resuming operations');
    } else {
        // Pause animations or heavy operations
        console.log('⏸️ Page hidden - pausing operations');
    }
});

console.log('🎉 Personal Website JavaScript Loaded Successfully!');