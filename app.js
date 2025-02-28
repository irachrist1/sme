// Main JavaScript file for SME Diagnostic Tool

// Check if localStorage is available
function isLocalStorageAvailable() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

// Initialize the application
function initApp() {
    if (!isLocalStorageAvailable()) {
        alert('This application requires localStorage to function properly. Please enable it in your browser settings.');
        return;
    }
    
    console.log('SME Diagnostic Tool initialized successfully!');
    
    // Check authentication state and update UI
    updateAuthUI();
    
    // Add event listener for logout
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
}

// Update UI based on authentication state
function updateAuthUI() {
    const currentUser = localStorage.getItem('smeCurrentUser');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const profileLink = document.getElementById('profile-link');
    const logoutLink = document.getElementById('logout-link');
    
    if (currentUser) {
        // User is logged in
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'block';
        
        // Get user data
        const userData = JSON.parse(localStorage.getItem('smeUserData')) || {};
        
        // Update welcome message if it exists
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome, ${userData.businessName || 'User'}!`;
            welcomeMessage.style.display = 'block';
        }
    } else {
        // User is not logged in
        if (loginLink) loginLink.style.display = 'block';
        if (registerLink) registerLink.style.display = 'block';
        if (profileLink) profileLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'none';
        
        // Hide welcome message if it exists
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }
    }
}

// Handle logout
function handleLogout() {
    // Remove current user
    localStorage.removeItem('smeCurrentUser');
    
    // Update UI
    updateAuthUI();
    
    // Show logout message
    alert('You have been logged out successfully.');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Add active class to current nav item
function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else if (currentPage.includes('results') && linkPage.includes('questionnaire')) {
            // Special case: Results page is part of the assessment flow
            link.classList.add('active');
        }
    });
}

// Run initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    setActiveNavItem();
}); 