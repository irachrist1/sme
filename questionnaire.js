// Questionnaire JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('sme-questionnaire');
    const sections = document.querySelectorAll('.question-section');
    const nextButtons = document.querySelectorAll('.next-section');
    const prevButtons = document.querySelectorAll('.prev-section');
    const submitButton = document.getElementById('submit-questionnaire');
    const progressIndicator = document.getElementById('progress-indicator');
    const sectionIndicators = document.querySelectorAll('.section-indicator');
    
    let currentSection = 1;
    const totalSections = sections.length;
    
    // Initialize the questionnaire
    function initQuestionnaire() {
        // Check if there's a saved state in localStorage
        const savedState = localStorage.getItem('smeQuestionnaireState');
        if (savedState) {
            const state = JSON.parse(savedState);
            // Restore saved answers
            restoreSavedAnswers(state.answers);
            // If user was in the middle of the questionnaire, go to that section
            if (state.currentSection && state.currentSection <= totalSections) {
                goToSection(state.currentSection);
            }
        }
        
        // Add event listeners
        nextButtons.forEach(button => {
            button.addEventListener('click', goToNextSection);
        });
        
        prevButtons.forEach(button => {
            button.addEventListener('click', goToPrevSection);
        });
        
        sectionIndicators.forEach(indicator => {
            indicator.addEventListener('click', function() {
                const sectionNum = parseInt(this.getAttribute('data-section'));
                if (isSectionCompleted(sectionNum - 1) || sectionNum === 1) {
                    goToSection(sectionNum);
                }
            });
        });
        
        // Add event listener for radio button changes to save state
        const radioButtons = form.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', saveQuestionnaireState);
        });
        
        // Submit button event listener
        if (submitButton) {
            submitButton.addEventListener('click', submitQuestionnaire);
        }
    }
    
    // Go to next section
    function goToNextSection() {
        if (currentSection < totalSections && validateCurrentSection()) {
            goToSection(currentSection + 1);
        }
    }
    
    // Go to previous section
    function goToPrevSection() {
        if (currentSection > 1) {
            goToSection(currentSection - 1);
        }
    }
    
    // Go to a specific section
    function goToSection(sectionNum) {
        // Hide all sections
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Show the target section
        document.getElementById(`section-${sectionNum}`).style.display = 'block';
        
        // Update current section
        currentSection = sectionNum;
        
        // Update progress bar
        updateProgress();
        
        // Update section indicators
        updateSectionIndicators();
        
        // Save state
        saveQuestionnaireState();
        
        // Scroll to top of the section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Update progress bar
    function updateProgress() {
        const progressPercentage = (currentSection / totalSections) * 100;
        progressIndicator.style.width = `${progressPercentage}%`;
    }
    
    // Update section indicators
    function updateSectionIndicators() {
        sectionIndicators.forEach(indicator => {
            const sectionNum = parseInt(indicator.getAttribute('data-section'));
            
            // Remove all classes first
            indicator.classList.remove('active', 'completed');
            
            // Add appropriate class
            if (sectionNum === currentSection) {
                indicator.classList.add('active');
            } else if (sectionNum < currentSection || isSectionCompleted(sectionNum)) {
                indicator.classList.add('completed');
            }
        });
    }
    
    // Check if a section is completed (all questions answered)
    function isSectionCompleted(sectionNum) {
        if (sectionNum <= 0) return true;
        
        const section = document.getElementById(`section-${sectionNum}`);
        if (!section) return false;
        
        const questions = section.querySelectorAll('.question-item');
        let completed = true;
        
        questions.forEach(question => {
            const radioButtons = question.querySelectorAll('input[type="radio"]');
            const answered = Array.from(radioButtons).some(radio => radio.checked);
            if (!answered) {
                completed = false;
            }
        });
        
        return completed;
    }
    
    // Validate current section (all questions answered)
    function validateCurrentSection() {
        const section = document.getElementById(`section-${currentSection}`);
        const questions = section.querySelectorAll('.question-item');
        let valid = true;
        
        questions.forEach(question => {
            const radioButtons = question.querySelectorAll('input[type="radio"]');
            const answered = Array.from(radioButtons).some(radio => radio.checked);
            
            if (!answered) {
                valid = false;
                question.classList.add('error');
                
                // Add error message if it doesn't exist
                if (!question.querySelector('.error-message')) {
                    const errorMessage = document.createElement('p');
                    errorMessage.classList.add('error-message');
                    errorMessage.textContent = 'Please select an answer for this question.';
                    errorMessage.style.color = 'red';
                    errorMessage.style.marginTop = '0.5rem';
                    question.appendChild(errorMessage);
                }
            } else {
                question.classList.remove('error');
                const errorMessage = question.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });
        
        if (!valid) {
            alert('Please answer all questions in this section before proceeding.');
        }
        
        return valid;
    }
    
    // Save questionnaire state to localStorage
    function saveQuestionnaireState() {
        const answers = {};
        
        // Get all answered questions
        const radioButtons = form.querySelectorAll('input[type="radio"]:checked');
        radioButtons.forEach(radio => {
            answers[radio.name] = radio.value;
        });
        
        const state = {
            currentSection: currentSection,
            answers: answers
        };
        
        localStorage.setItem('smeQuestionnaireState', JSON.stringify(state));
    }
    
    // Restore saved answers
    function restoreSavedAnswers(answers) {
        if (!answers) return;
        
        Object.keys(answers).forEach(name => {
            const radio = form.querySelector(`input[name="${name}"][value="${answers[name]}"]`);
            if (radio) {
                radio.checked = true;
            }
        });
    }
    
    // Submit the questionnaire
    function submitQuestionnaire() {
        if (!validateCurrentSection()) {
            return;
        }
        
        // Calculate scores
        const scores = calculateScores();
        
        // Save results to localStorage
        saveResults(scores);
        
        // Redirect to results page
        window.location.href = 'results.html';
    }
    
    // Calculate scores based on answers
    function calculateScores() {
        const answers = {};
        const sectionScores = {
            section1: 0,
            section2: 0,
            section3: 0,
            section4: 0,
            section5: 0,
            section6: 0,
            section7: 0,
            section8: 0,
            section9: 0
        };
        
        // Get all answered questions
        const radioButtons = form.querySelectorAll('input[type="radio"]:checked');
        radioButtons.forEach(radio => {
            answers[radio.name] = parseInt(radio.value);
            
            // Determine which section this question belongs to
            const sectionNum = radio.name.charAt(1);
            sectionScores[`section${sectionNum}`] += parseInt(radio.value);
        });
        
        // Calculate maximum possible scores for each section
        // These values should match the actual number of questions and their maximum values
        const maxScores = {
            section1: 9, // 3 questions * max value of 3
            section2: 9, // 3 questions * max value of 3
            section3: 3, // 1 question * max value of 3
            section4: 3, // 1 question * max value of 3
            section5: 3, // 1 question * max value of 3
            section6: 3, // 1 question * max value of 3
            section7: 10, // 5 questions with max values of 2
            section8: 9, // 7 questions with max values of 0, 1, or 2
            section9: 14 // 7 questions with max values of 0, 1, or 2
        };
        
        // Calculate percentage scores for each section
        const percentageScores = {};
        Object.keys(sectionScores).forEach(section => {
            percentageScores[section] = (sectionScores[section] / maxScores[section]) * 100;
        });
        
        // Calculate total score (average of section percentages)
        const totalScore = Object.values(percentageScores).reduce((sum, score) => sum + score, 0) / Object.keys(percentageScores).length;
        
        // Determine development level based on total score
        let developmentLevel = '';
        if (totalScore >= 0 && totalScore < 25) {
            developmentLevel = 'Pre-Foundation';
        } else if (totalScore >= 25 && totalScore < 50) {
            developmentLevel = 'Foundation';
        } else if (totalScore >= 50 && totalScore < 75) {
            developmentLevel = 'Growth';
        } else {
            developmentLevel = 'Scale-Up';
        }
        
        // Log the scores for debugging
        console.log('Section Scores:', sectionScores);
        console.log('Max Scores:', maxScores);
        console.log('Percentage Scores:', percentageScores);
        console.log('Total Score:', totalScore);
        console.log('Development Level:', developmentLevel);
        
        return {
            answers: answers,
            sectionScores: sectionScores,
            percentageScores: percentageScores,
            totalScore: totalScore,
            developmentLevel: developmentLevel
        };
    }
    
    // Save results to localStorage
    function saveResults(scores) {
        localStorage.setItem('smeResults', JSON.stringify(scores));
    }
    
    // Initialize the questionnaire
    initQuestionnaire();
}); 