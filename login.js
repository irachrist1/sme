// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Check if user is already logged in
    const currentUser = localStorage.getItem('smeCurrentUser');
    if (currentUser) {
        // Redirect to dashboard or profile
        window.location.href = 'index.html';
    }
    
    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and forms
            authTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            this.classList.add('active');
            const tabName = this.getAttribute('data-tab');
            document.getElementById(`${tabName}-form`).classList.add('active');
        });
    });
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateLoginForm()) {
            handleLogin();
        }
    });
    
    // Register form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateRegisterForm()) {
            handleRegistration();
        }
    });
});

// Validate login form
function validateLoginForm() {
    let isValid = true;
    
    // Clear previous error messages
    clearErrors('login-form');
    
    // Get form values
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Validate email
    if (!email) {
        showError('login-email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('login-email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showError('login-password', 'Password is required');
        isValid = false;
    }
    
    return isValid;
}

// Validate registration form
function validateRegisterForm() {
    let isValid = true;
    
    // Clear previous error messages
    clearErrors('register-form');
    
    // Get form values
    const businessName = document.getElementById('register-business-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Validate business name
    if (!businessName) {
        showError('register-business-name', 'Business name is required');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        showError('register-email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('register-email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showError('register-password', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('register-password', 'Password must be at least 6 characters long');
        isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword) {
        showError('register-confirm-password', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('register-confirm-password', 'Passwords do not match');
        isValid = false;
    }
    
    return isValid;
}

// Show error message for a field
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = message;
    
    formGroup.appendChild(errorMessage);
}

// Clear all error messages in a form
function clearErrors(formId) {
    const form = document.getElementById(formId);
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    const errorGroups = form.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => group.classList.remove('error'));
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle login
function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('smeUsers')) || {};
    
    // Check if user exists and password matches
    if (users[email] && users[email].password === password) {
        // Set current user
        localStorage.setItem('smeCurrentUser', email);
        
        // Redirect to dashboard or profile
        window.location.href = 'index.html';
    } else {
        // Show error message
        const loginForm = document.getElementById('login-form');
        
        // Check if error message already exists
        let errorMessage = loginForm.querySelector('.auth-error');
        
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message', 'auth-error');
            errorMessage.style.textAlign = 'center';
            errorMessage.style.marginBottom = '1rem';
            
            // Insert at the top of the form content
            loginForm.insertBefore(errorMessage, loginForm.querySelector('h2').nextSibling);
        }
        
        errorMessage.textContent = 'Invalid email or password';
    }
}

// Handle registration
function handleRegistration() {
    const businessName = document.getElementById('register-business-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('smeUsers')) || {};
    
    // Check if user already exists
    if (users[email]) {
        showError('register-email', 'An account with this email already exists');
        return;
    }
    
    // Create new user
    users[email] = {
        businessName: businessName,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    // Save users to localStorage
    localStorage.setItem('smeUsers', JSON.stringify(users));
    
    // Create user profile
    const userProfile = {
        businessName: businessName,
        email: email
    };
    
    // Save profile to localStorage
    localStorage.setItem('smeUserData', JSON.stringify(userProfile));
    
    // Set current user
    localStorage.setItem('smeCurrentUser', email);
    
    // Show success message and redirect
    showSuccessMessage('Registration successful! Redirecting to your profile...');
    
    // Redirect after a short delay
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 2000);
}

// Show success message
function showSuccessMessage(message) {
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.classList.add('success-message');
    successMessage.textContent = message;
    
    // Insert at the top of the auth container
    const authContainer = document.querySelector('.auth-container');
    authContainer.insertBefore(successMessage, authContainer.firstChild);
} 