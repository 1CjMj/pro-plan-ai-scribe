
# ProPlanAI - AI-Powered Project Management Platform

ProPlanAI is an advanced project management application that leverages artificial intelligence to automate task generation, resource allocation, and provide insightful analytics for project managers and team members.

## Features

### For Project Managers

- **AI Task Generation**: Convert project descriptions into detailed task lists with required skills, resources, and estimated time.
- **Smart Task Allocation**: Automatically assign tasks to team members based on skills matching and resource availability.
- **Resource Management**: Track and optimize resource allocation across all projects.
- **Progress Tracking**: Monitor task completion status and overall project progress.
- **Advanced Analytics**: Gain insights from task completion times, resource usage, and team performance metrics.
- **Employee Management**: Import employee data and manage their skills profiles.

### For Team Members

- **Task Dashboard**: View all assigned tasks in one place.
- **Task Status Updates**: Update task status from "Not Started" to "In Progress" to "Completed".
- **Project Visibility**: See how individual tasks contribute to the overall project.

## Project Architecture

### Frontend Components (React + TypeScript)

- **Authentication System**: Secure login and role-based access control.
- **Dashboard**: Customized views for managers and team members.
- **Project Management**: Creation, viewing, and management of projects.
- **Task Management**: Task lists, status updates, and assignments.
- **Analytics**: Data visualizations using Recharts for project insights.
- **Resource Management**: Tracking and allocation of project resources.

### Data Storage

The current implementation uses local storage for data persistence, allowing users to:
- Save projects and their associated tasks locally
- Track project progress and task status
- Simulate AI features for demonstration purposes

### AI Integration (Conceptual)

In a production environment, the application would integrate with AI models from HuggingFace Transformers to:

1. **Task Generation**: Convert project descriptions into comprehensive task lists.
   - Model: T5 or GPT-based models for text generation
   - Input: Project description
   - Output: Structured list of tasks with details

2. **Skill Matching**: Match employee skills to task requirements.
   - Model: Sentence-transformer models for semantic matching
   - Input: Task skills and employee skills
   - Output: Compatibility scores for matching

3. **Resource Optimization**: Optimize resource allocation across projects.
   - Model: ML-based optimization models
   - Input: Resource availability and task requirements
   - Output: Optimal resource allocation plan

4. **Time Estimation**: Predict task completion times.
   - Model: Regression models trained on historical project data
   - Input: Task characteristics and complexity
   - Output: Estimated hours required

5. **Advanced Analytics**: Generate insights from project data.
   - Model: Various analytical models for pattern recognition
   - Input: Project progress and resource usage data
   - Output: Actionable insights and recommendations

## Technical Implementation

### Core Technologies

- **Framework**: React with TypeScript
- **Styling**: TailwindCSS with shadcn/ui components
- **State Management**: React Context API
- **Routing**: React Router
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

### Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── layout/        # Layout components (Header, Sidebar)
│   └── ui/            # UI components from shadcn
├── contexts/          # React contexts for state management
│   ├── AuthContext.tsx   # Authentication state
│   └── ProjectContext.tsx # Project management state
├── pages/             # Application pages
│   ├── Home.tsx        # Landing page
│   ├── Dashboard.tsx   # User dashboard
│   ├── Login.tsx       # Authentication
│   ├── Projects.tsx    # Project listing
│   ├── Tasks.tsx       # Task management
│   └── ...
└── lib/               # Utility functions
```

### Key Files

- **AuthContext.tsx**: Manages user authentication and session state
- **ProjectContext.tsx**: Core business logic for project and task management
- **Dashboard.tsx**: Main user interface for project overview
- **ProjectDetail.tsx**: Detailed project view with task management
- **Analytics.tsx**: Data visualizations and project insights

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/proplanai.git
```

2. Navigate to the project directory:
```
cd proplanai
```

3. Install dependencies:
```
npm install
```

4. Start the development server:
```
npm run dev
```

5. Open your browser and navigate to `http://localhost:8080`

### Demo Login Credentials

- **Manager**: Email: manager@example.com, Password: password
- **Worker**: Email: worker@example.com, Password: password

## Future Enhancements

1. **Backend Integration**: Connect to a real backend service for data persistence.
2. **AI Model Integration**: Implement actual HuggingFace Transformers models for AI features.
3. **Real-time Collaboration**: Add WebSocket integration for live updates.
4. **Advanced Resource Planning**: Implement more sophisticated resource allocation algorithms.
5. **Gantt Charts**: Add timeline visualization for project planning.
6. **Mobile Application**: Develop companion mobile apps for on-the-go access.

## License

MIT License

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)
