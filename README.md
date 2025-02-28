# SME Diagnostic Tool

A lightweight, web-based diagnostic tool for Rwandan Small and Medium Enterprises (SMEs) to assess their business development stage and receive personalized recommendations.

## Overview

This tool helps SMEs evaluate their business across six key dimensions:
1. Business Setup
2. Finance
3. Marketing
4. Operations
5. Human Resources
6. Innovation

Based on the assessment, businesses receive a score that places them in one of four development stages:
- Pre-Foundation (0-24)
- Foundation (25-49)
- Growth (50-74)
- Scale-Up (75-100)

## Features

- **Comprehensive Assessment**: Answer questions across 6 business dimensions
- **Real-time Scoring**: Get immediate feedback on your business's development stage
- **Personalized Recommendations**: Receive tailored advice based on your results
- **User Profiles**: Create an account to save your business information
- **Results Dashboard**: Visualize your scores across different business areas
- **Export Functionality**: Download your results as CSV for offline reference

## Technology Stack

This application is built using only:
- HTML5
- CSS3
- JavaScript (ES6+)

All data is stored in the browser's localStorage, making it a completely client-side application with no server requirements.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/sme-diagnostic-tool.git
   ```

2. Open the `index.html` file in your web browser:
   ```
   cd sme-diagnostic-tool
   open index.html  # or double-click the file in your file explorer
   ```

Alternatively, you can use a local development server:
```
npx http-server
```

## Usage

1. **Register/Login**: Create an account or log in to an existing one
2. **Complete Profile**: Fill in your business details
3. **Take Assessment**: Answer questions across all business dimensions
4. **View Results**: See your overall score and breakdown by section
5. **Review Recommendations**: Get personalized advice for improvement
6. **Export Results**: Download your results for offline reference

## Project Structure

```
sme-diagnostic-tool/
├── index.html              # Landing page
├── styles.css              # Main stylesheet
├── app.js                  # Main JavaScript file
├── questionnaire.html      # Assessment questionnaire
├── questionnaire.css       # Questionnaire styles
├── questionnaire.js        # Questionnaire functionality
├── results.html            # Results dashboard
├── results.css             # Results styles
├── results.js              # Results functionality
├── profile.html            # User profile page
├── profile.css             # Profile styles
├── profile.js              # Profile functionality
├── login.html              # Login/registration page
├── login.css               # Login styles
├── login.js                # Authentication functionality
└── README.md               # Project documentation
```

## Future Enhancements

- Backend integration for data persistence across devices
- Advanced analytics and comparison with industry benchmarks
- Multi-language support (English, Kinyarwanda, French)
- Offline functionality with Progressive Web App features
- Administrative dashboard for managing questions and recommendations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Developed for Rwandan SMEs to support business growth and development
- Inspired by existing Excel-based SME diagnostic tools 