// Profile Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profile-form');
    
    // Check if we have existing profile data
    const existingProfile = localStorage.getItem('smeUserData');
    if (existingProfile) {
        // Parse and populate the form
        populateForm(JSON.parse(existingProfile));
    }
    
    // Add form submission handler
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            saveProfile();
        }
    });
});

// Populate form with existing data
function populateForm(profileData) {
    // Basic information
    document.getElementById('business-name').value = profileData.businessName || '';
    document.getElementById('business-email').value = profileData.email || '';
    document.getElementById('business-phone').value = profileData.phone || '';
    
    // Business details
    if (profileData.sector) {
        document.getElementById('business-sector').value = profileData.sector;
    }
    
    if (profileData.yearsInOperation) {
        document.getElementById('business-years').value = profileData.yearsInOperation;
    }
    
    if (profileData.employeeCount) {
        document.getElementById('employee-count').value = profileData.employeeCount;
    }
    
    if (profileData.annualTurnover) {
        document.getElementById('annual-turnover').value = profileData.annualTurnover;
    }
    
    // Additional information
    if (profileData.location) {
        document.getElementById('business-location').value = profileData.location;
    }
    
    // Business goals (checkboxes)
    if (profileData.goals && Array.isArray(profileData.goals)) {
        const checkboxes = document.querySelectorAll('input[name="goals"]');
        checkboxes.forEach(checkbox => {
            if (profileData.goals.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        });
    }
}

// Validate the form
function validateForm() {
    let isValid = true;
    
    // Clear previous error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => group.classList.remove('error'));
    
    // Validate required fields
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            showError(field, 'This field is required');
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('business-email');
    if (emailField.value.trim() && !isValidEmail(emailField.value.trim())) {
        isValid = false;
        showError(emailField, 'Please enter a valid email address');
    }
    
    return isValid;
}

// Show error message for a field
function showError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = message;
    
    formGroup.appendChild(errorMessage);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Save profile data to localStorage
function saveProfile() {
    const formData = new FormData(document.getElementById('profile-form'));
    const profileData = {};
    
    // Process form data
    for (const [key, value] of formData.entries()) {
        // Handle checkboxes (multiple values)
        if (key === 'goals') {
            if (!profileData[key]) {
                profileData[key] = [];
            }
            profileData[key].push(value);
        } else {
            profileData[key] = value;
        }
    }
    
    // Save to localStorage
    localStorage.setItem('smeUserData', JSON.stringify(profileData));
    
    // Show success message
    showSuccessMessage();
}

// Show success message
function showSuccessMessage() {
    // Check if success message already exists
    let successMessage = document.querySelector('.success-message');
    
    if (!successMessage) {
        // Create success message
        successMessage = document.createElement('div');
        successMessage.classList.add('success-message');
        successMessage.textContent = 'Profile saved successfully!';
        
        // Insert at the top of the form
        const profileForm = document.getElementById('profile-form');
        profileForm.insertBefore(successMessage, profileForm.firstChild);
    }
    
    // Show the message
    successMessage.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
} 