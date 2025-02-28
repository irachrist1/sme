// Results Page JavaScript

// Interventions data structure
const interventions = {
    0: {
        title: "Level 0: Pre-Foundation",
        scoreRange: "0–24 points",
        objective: "Initiate formalization of business operations and establish basic business management practices to build a foundation for future growth.",
        areasOfIntervention: [
            {
                heading: "Business Awareness and Formalization",
                content: "Workshops on Business Registration, Licensing, and Compliance requirements. Support with documentation and application processes."
            },
            {
                heading: "Basic Financial Literacy",
                content: "Training on basic bookkeeping, separating business and personal finances, and understanding business costs and revenue."
            },
            {
                heading: "Business Planning",
                content: "Support in developing a simple business plan, defining business goals, and understanding market basics."
            },
            {
                heading: "Access to Basic Tools",
                content: "Introduction to basic business tools and technologies, including mobile payment systems and simple record-keeping methods."
            }
        ]
    },
    1: {
        title: "Level 1: Foundation",
        scoreRange: "25–49 points",
        objective: "Strengthen business foundations and develop more structured systems and processes to prepare for growth.",
        areasOfIntervention: [
            {
                heading: "Financial Management",
                content: "Training on financial record-keeping, basic financial analysis, cash flow management, and introduction to financial planning."
            },
            {
                heading: "Market Development",
                content: "Support in customer identification, basic market research, and developing simple marketing strategies."
            },
            {
                heading: "Operational Efficiency",
                content: "Guidance on documenting business processes, quality control basics, and inventory management."
            },
            {
                heading: "Human Resource Basics",
                content: "Training on basic HR practices, including recruitment, basic staff management, and compliance with labor laws."
            },
            {
                heading: "Business Networking",
                content: "Facilitation of peer learning groups and introduction to business associations and networks."
            }
        ]
    },
    2: {
        title: "Level 2: Growth",
        scoreRange: "50–74 points",
        objective: "Scale business operations, expand market reach, and develop more sophisticated business systems to support growth.",
        areasOfIntervention: [
            {
                heading: "Growth Financing",
                content: "Support in accessing growth capital, financial planning for expansion, and developing investment proposals."
            },
            {
                heading: "Market Expansion",
                content: "Assistance with market diversification strategies, customer relationship management, and more sophisticated marketing approaches."
            },
            {
                heading: "Systems Development",
                content: "Support in implementing business management systems, including digital tools for operations, finance, and customer management."
            },
            {
                heading: "Team Development",
                content: "Guidance on building and managing teams, leadership development, and creating organizational structures to support growth."
            },
            {
                heading: "Product/Service Innovation",
                content: "Support in developing new products or services, improving existing offerings, and implementing innovation processes."
            }
        ]
    },
    3: {
        title: "Level 3: Scale-Up",
        scoreRange: "75–100 points",
        objective: "Achieve significant scale, potentially including international expansion, while building sophisticated business systems and leadership capacity.",
        areasOfIntervention: [
            {
                heading: "Strategic Planning",
                content: "Support in developing comprehensive strategic plans, including long-term growth strategies and potential diversification."
            },
            {
                heading: "Advanced Financial Management",
                content: "Guidance on sophisticated financial planning, investment strategies, and potentially preparing for external investment or acquisition."
            },
            {
                heading: "Market Leadership",
                content: "Support in establishing market leadership, brand development, and potentially international market entry."
            },
            {
                heading: "Organizational Development",
                content: "Assistance with developing robust organizational structures, advanced HR systems, and leadership development programs."
            },
            {
                heading: "Innovation and R&D",
                content: "Support in establishing formal innovation processes, R&D initiatives, and potentially developing intellectual property strategies."
            },
            {
                heading: "Strategic Partnerships",
                content: "Facilitation of strategic partnerships, joint ventures, or other collaborative arrangements to support scale-up."
            }
        ]
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Check if results exist in localStorage
    const resultsData = localStorage.getItem('smeResults');
    
    if (!resultsData) {
        // No results found, redirect to questionnaire
        alert('No assessment results found. Please complete the assessment first.');
        window.location.href = 'questionnaire.html';
        return;
    }
    
    // Parse the results
    const results = JSON.parse(resultsData);
    
    // Display the results
    displayResults(results);
    
    // Add event listener for export button
    document.getElementById('export-results').addEventListener('click', function() {
        exportResults(results);
    });
    
    // Add event listener for view interventions button
    document.getElementById('view-interventions').addEventListener('click', function() {
        showInterventions(results.developmentLevel);
    });
    
    // Add event listener for modal close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('interventions-modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('interventions-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Add event listeners for tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab content
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.style.display = 'none');
            
            // Show the selected tab content
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).style.display = 'block';
        });
    });
    
    // Set default tab (bar chart) as active
    const defaultTab = document.querySelector('[data-tab="bar-chart"]');
    if (defaultTab) {
        defaultTab.classList.add('active');
        
        // Hide all tab content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.style.display = 'none');
        
        // Show the default tab content
        document.getElementById('bar-chart-tab').style.display = 'block';
    }
});

// Display the results on the page
function displayResults(results) {
    // Verify the development level calculation
    const verifiedLevel = verifyDevelopmentLevel(results.totalScore);
    if (verifiedLevel !== results.developmentLevel) {
        console.warn(`Development level mismatch: Calculated ${verifiedLevel}, but got ${results.developmentLevel}`);
        // Correct the development level if needed
        results.developmentLevel = verifiedLevel;
    }

    // Display total score
    const totalScoreElement = document.getElementById('total-score');
    totalScoreElement.textContent = Math.round(results.totalScore);
    
    // Display development level
    const developmentLevelElement = document.getElementById('development-level');
    developmentLevelElement.textContent = results.developmentLevel;
    
    // Display level explanation
    const levelExplanationElement = document.getElementById('level-explanation');
    levelExplanationElement.textContent = getLevelExplanation(results.developmentLevel);
    
    // Prepare data for charts and table
    const sectionNames = [];
    const sectionScores = [];
    const maxScores = {
        section1: 9, // Business Setup - 3 questions * max value of 3
        section2: 9, // Finance - 3 questions * max value of 3
        section3: 3, // Marketing - 1 question * max value of 3
        section4: 3, // Operations - 1 question * max value of 3
        section5: 3, // Human Resources - 1 question * max value of 3
        section6: 3, // Innovation - 1 question * max value of 3
        section7: 10, // Financial Systems - 5 questions with max values of 2
        section8: 9, // Market Access - 7 questions with max values of 0, 1, or 2
        section9: 14  // ESG Integration - 7 questions with max values of 0, 1, or 2
    };
    
    // Display section scores in bar chart
    Object.keys(results.percentageScores).forEach(section => {
        const sectionNumber = section.replace('section', '');
        const scoreElement = document.getElementById(`section${sectionNumber}-score`);
        const barElement = document.getElementById(`section${sectionNumber}-bar`);
        
        if (scoreElement && barElement) {
            const score = Math.round(results.percentageScores[section]);
            scoreElement.textContent = `${score}%`;
            
            // Animate the bar after a short delay
            setTimeout(() => {
                barElement.style.width = `${score}%`;
                console.log(`Setting width for section${sectionNumber}-bar to ${score}%`);
            }, 100 * parseInt(sectionNumber)); // Stagger the animations
        } else {
            console.log(`Element not found for section${sectionNumber}`);
        }
        
        // Collect data for radar chart and table
        sectionNames.push(getSectionName(section));
        sectionScores.push(Math.round(results.percentageScores[section]));
    });
    
    // Create radar chart
    createRadarChart(sectionNames, sectionScores);
    
    // Create results table
    createResultsTable(results, maxScores);
    
    // Display recommendations
    const recommendationsElement = document.getElementById('recommendations-list');
    recommendationsElement.innerHTML = ''; // Clear loading message
    
    const recommendations = getRecommendations(results);
    recommendations.forEach(rec => {
        const recItem = document.createElement('div');
        recItem.classList.add('recommendation-item');
        
        const recTitle = document.createElement('h4');
        recTitle.textContent = rec.title;
        
        const recText = document.createElement('p');
        recText.textContent = rec.text;
        
        recItem.appendChild(recTitle);
        recItem.appendChild(recText);
        recommendationsElement.appendChild(recItem);
    });
}

// Create radar chart
function createRadarChart(labels, data) {
    const ctx = document.getElementById('radar-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Scores per Category',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.raw + '%';
                        }
                    }
                }
            }
        }
    });
}

// Create results table
function createResultsTable(results, maxScores) {
    const tableBody = document.getElementById('results-table-body');
    tableBody.innerHTML = ''; // Clear any existing content
    
    let totalPossiblePoints = 0;
    let totalPointsScored = 0;
    
    console.log('Creating results table with data:', results);
    
    // Add a row for each section
    Object.keys(results.sectionScores).forEach(section => {
        const row = document.createElement('tr');
        
        // Section name
        const nameCell = document.createElement('td');
        nameCell.textContent = getSectionName(section);
        row.appendChild(nameCell);
        
        // Total possible points
        const possiblePointsCell = document.createElement('td');
        possiblePointsCell.textContent = maxScores[section];
        totalPossiblePoints += maxScores[section];
        row.appendChild(possiblePointsCell);
        
        // Points scored
        const pointsScoredCell = document.createElement('td');
        pointsScoredCell.textContent = results.sectionScores[section];
        totalPointsScored += results.sectionScores[section];
        row.appendChild(pointsScoredCell);
        
        // Average score (percentage)
        const percentageCell = document.createElement('td');
        percentageCell.textContent = Math.round(results.percentageScores[section]) + '%';
        row.appendChild(percentageCell);
        
        tableBody.appendChild(row);
    });
    
    // Update the totals in the footer
    document.getElementById('total-possible-points').textContent = totalPossiblePoints;
    document.getElementById('total-points-scored').textContent = totalPointsScored;
    document.getElementById('total-average-score').textContent = Math.round(results.totalScore) + '%';
    
    console.log('Table created with totals:', {
        totalPossiblePoints,
        totalPointsScored,
        totalAverageScore: Math.round(results.totalScore) + '%'
    });
}

// Get explanation text based on development level
function getLevelExplanation(level) {
    const explanations = {
        'Pre-Foundation': 'Your business is in the early stages of development. You need to focus on establishing basic business structures, processes, and compliance.',
        'Foundation': 'Your business has established some basic structures but needs to strengthen its foundation in key areas to prepare for growth.',
        'Growth': 'Your business has a solid foundation and is ready to scale. Focus on optimizing operations and expanding your market reach.',
        'Scale-Up': 'Your business is well-established and ready for significant expansion. Focus on innovation, market leadership, and possibly international opportunities.'
    };
    
    return explanations[level] || 'Assessment complete. Review your section scores for detailed insights.';
}

// Get recommendations based on results
function getRecommendations(results) {
    const recommendations = [];
    const level = results.developmentLevel;
    
    // General recommendation based on overall level
    recommendations.push({
        title: `${level} Stage Recommendation`,
        text: getLevelRecommendation(level)
    });
    
    // Find weakest section
    let weakestSection = '';
    let lowestScore = 100;
    
    Object.keys(results.percentageScores).forEach(section => {
        if (results.percentageScores[section] < lowestScore) {
            lowestScore = results.percentageScores[section];
            weakestSection = section;
        }
    });
    
    // Add recommendation for weakest section
    if (weakestSection) {
        const sectionName = getSectionName(weakestSection);
        recommendations.push({
            title: `Improve Your ${sectionName}`,
            text: getSectionRecommendation(weakestSection, results.percentageScores[weakestSection])
        });
    }
    
    // Find strongest section
    let strongestSection = '';
    let highestScore = 0;
    
    Object.keys(results.percentageScores).forEach(section => {
        if (results.percentageScores[section] > highestScore) {
            highestScore = results.percentageScores[section];
            strongestSection = section;
        }
    });
    
    // Add recommendation for strongest section
    if (strongestSection) {
        const sectionName = getSectionName(strongestSection);
        recommendations.push({
            title: `Leverage Your ${sectionName} Strength`,
            text: getStrengthRecommendation(strongestSection, results.percentageScores[strongestSection])
        });
    }
    
    // Add next steps recommendation
    recommendations.push({
        title: 'Next Steps',
        text: 'Consider sharing these results with a business advisor or mentor who can help you develop a detailed action plan based on these recommendations.'
    });
    
    return recommendations;
}

// Get section name from section key
function getSectionName(sectionKey) {
    const sectionNames = {
        'section1': 'Business Setup',
        'section2': 'Finance',
        'section3': 'Marketing',
        'section4': 'Operations',
        'section5': 'Human Resources',
        'section6': 'Innovation',
        'section7': 'Financial Systems',
        'section8': 'Market Access',
        'section9': 'ESG Integration'
    };
    
    return sectionNames[sectionKey] || 'Unknown Section';
}

// Get recommendation based on development level
function getLevelRecommendation(level) {
    const recommendations = {
        'Pre-Foundation': 'Focus on formalizing your business structure, registering your business properly, and establishing basic financial records. Consider working with a business advisor to develop a simple business plan.',
        'Foundation': 'Work on strengthening your business systems, particularly in finance and operations. Consider investing in basic business software and developing more structured processes.',
        'Growth': 'Focus on scaling your operations efficiently, expanding your customer base, and potentially exploring new markets. Consider investing in marketing and building a stronger team.',
        'Scale-Up': 'Consider strategic partnerships, innovation initiatives, and possibly international expansion. Focus on leadership development and building systems that can support significant growth.'
    };
    
    return recommendations[level] || 'Review your section scores and focus on improving your lowest-scoring areas first.';
}

// Get recommendation for weak section
function getSectionRecommendation(section, score) {
    const recommendations = {
        'section1': 'Consider formalizing your business structure and ensuring all necessary registrations are complete.',
        'section2': 'Implement basic financial tracking and consider consulting with a financial advisor.',
        'section3': 'Develop a simple marketing plan to identify your target customers and how to reach them.',
        'section4': 'Document your key business processes to ensure consistency and identify areas for improvement.',
        'section5': 'Create basic job descriptions and consider implementing regular team meetings.',
        'section6': 'Set aside time regularly to think about how your business could improve or innovate.',
        'section7': 'Establish a system for tracking cash flow and consider using basic accounting software for financial reporting.',
        'section8': 'Focus on identifying and engaging with your local customer base before expanding to regional or international markets.',
        'section9': 'Begin by identifying the environmental regulations applicable to your business and develop basic policies for social responsibility.'
    };
    
    return recommendations[section] || 'Focus on improving this area of your business.';
}

// Get recommendation for strong section
function getStrengthRecommendation(section, score) {
    const recommendations = {
        'section1': 'Your business setup is solid. Consider reviewing your business plan annually to ensure it remains aligned with your goals.',
        'section2': 'Your financial management is strong. Consider more advanced financial planning or exploring growth financing options.',
        'section3': 'Your marketing approach is effective. Consider expanding to new channels or refining your customer targeting.',
        'section4': 'Your operational efficiency is a strength. Consider how you can further optimize processes or potentially scale your operations to handle growth.',
        'section5': 'Your human resource management is strong. Consider developing leadership within your team and planning for future talent needs.',
        'section6': 'Your approach to innovation is a strength. Consider formalizing an innovation process or exploring partnerships for new opportunities.',
        'section7': 'Your financial systems and investment readiness are strong. Consider exploring larger investment opportunities and refining your financial presentations for potential investors.',
        'section8': 'Your market access and value chain integration are strong. Consider expanding to new markets or deepening relationships with existing partners to further strengthen your position.',
        'section9': 'Your ESG integration is a strength. Consider pursuing industry certifications and communicating your sustainability efforts to attract environmentally conscious customers and investors.'
    };
    
    return recommendations[section] || 'Continue to build on your strengths in this area.';
}

// Export results as CSV
function exportResults(results) {
    // Map development level to intervention level (0-3)
    const levelMap = {
        'Pre-Foundation': 0,
        'Foundation': 1,
        'Growth': 2,
        'Scale-Up': 3
    };
    
    const level = levelMap[results.developmentLevel];
    const levelData = interventions[level];
    
    // Create CSV content
    let csvContent = 'SME Diagnostic Tool Results\n\n';
    
    // Add overall results
    csvContent += 'Overall Score,' + Math.round(results.totalScore) + '\n';
    csvContent += 'Development Level,' + results.developmentLevel + '\n\n';
    
    // Add section scores
    csvContent += 'Section,Score\n';
    Object.keys(results.percentageScores).forEach(section => {
        csvContent += getSectionName(section) + ',' + Math.round(results.percentageScores[section]) + '%\n';
    });
    
    // Add recommendations
    csvContent += '\nRecommendations:\n';
    const recommendations = getRecommendations(results);
    recommendations.forEach(rec => {
        csvContent += rec.title + '\n' + rec.text + '\n\n';
    });
    
    // Add interventions
    if (levelData) {
        csvContent += '\nIntervention Highlights for ' + levelData.title + '\n';
        csvContent += 'Score Range: ' + levelData.scoreRange + '\n\n';
        csvContent += 'Objective:\n' + levelData.objective + '\n\n';
        csvContent += 'Areas of Intervention:\n';
        
        levelData.areasOfIntervention.forEach(area => {
            csvContent += area.heading + '\n' + area.content + '\n\n';
        });
    }
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'SME_Diagnostic_Results.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Verify development level calculation
function verifyDevelopmentLevel(totalScore) {
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
    
    console.log(`Verifying development level: Score ${totalScore} => Level ${developmentLevel}`);
    
    // Test boundary cases
    const boundaryTests = [
        { score: 0, expected: 'Pre-Foundation' },
        { score: 24, expected: 'Pre-Foundation' },
        { score: 24.9, expected: 'Pre-Foundation' },
        { score: 25, expected: 'Foundation' },
        { score: 49, expected: 'Foundation' },
        { score: 49.9, expected: 'Foundation' },
        { score: 50, expected: 'Growth' },
        { score: 74, expected: 'Growth' },
        { score: 74.9, expected: 'Growth' },
        { score: 75, expected: 'Scale-Up' },
        { score: 100, expected: 'Scale-Up' }
    ];
    
    boundaryTests.forEach(test => {
        let level = '';
        if (test.score >= 0 && test.score < 25) {
            level = 'Pre-Foundation';
        } else if (test.score >= 25 && test.score < 50) {
            level = 'Foundation';
        } else if (test.score >= 50 && test.score < 75) {
            level = 'Growth';
        } else {
            level = 'Scale-Up';
        }
        
        const isCorrect = level === test.expected;
        console.log(`Boundary test: Score ${test.score} => Level ${level} (Expected: ${test.expected}) - ${isCorrect ? 'PASS' : 'FAIL'}`);
    });
    
    return developmentLevel;
}

// Show interventions modal based on development level
function showInterventions(developmentLevel) {
    // Map development level to intervention level (0-3)
    const levelMap = {
        'Pre-Foundation': 0,
        'Foundation': 1,
        'Growth': 2,
        'Scale-Up': 3
    };
    
    const level = levelMap[developmentLevel];
    
    if (level === undefined || !interventions[level]) {
        alert('Intervention data not available for this level.');
        return;
    }
    
    const levelData = interventions[level];
    
    // Populate modal with intervention data
    document.getElementById('interventions-title').textContent = levelData.title;
    document.getElementById('interventions-score-range').textContent = levelData.scoreRange;
    document.getElementById('interventions-objective').textContent = levelData.objective;
    
    // Populate areas of intervention
    const areasListElement = document.getElementById('interventions-areas-list');
    areasListElement.innerHTML = ''; // Clear existing content
    
    levelData.areasOfIntervention.forEach(area => {
        const areaItem = document.createElement('div');
        areaItem.classList.add('intervention-area-item');
        
        const areaHeading = document.createElement('h4');
        areaHeading.textContent = area.heading;
        
        const areaContent = document.createElement('p');
        areaContent.textContent = area.content;
        
        areaItem.appendChild(areaHeading);
        areaItem.appendChild(areaContent);
        areasListElement.appendChild(areaItem);
    });
    
    // Show the modal with animation
    const modal = document.getElementById('interventions-modal');
    modal.style.display = 'block';
    
    // Add focus trap for accessibility
    setTimeout(() => {
        const closeButton = modal.querySelector('.close-modal');
        closeButton.focus();
    }, 100);
} 