
# TaskMaster - AI-Powered Project Management Platform

TaskMaster (formerly ProPlanAI) is an advanced project management application that leverages artificial intelligence to automate task generation, resource allocation, and provide insightful analytics for project managers and team members.

## Core Features

### For Project Managers

- **AI Task Generation**: Convert project descriptions into detailed task lists with required skills, resources, and estimated time.
- **Smart Task Allocation**: Automatically assign tasks to team members based on skills matching, workload balancing, and resource availability.
- **Resource Management**: Track and optimize resource allocation across all projects.
- **Progress Tracking**: Monitor task completion status and overall project progress.
- **Advanced Analytics**: Gain insights from task completion times, resource usage, and team performance metrics.
- **Employee Management**: Import employee data and manage their skills profiles.

### For Team Members

- **Task Dashboard**: View all assigned tasks in one place.
- **Task Status Updates**: Update task status from "Not Started" to "In Progress" to "Completed".
- **Project Visibility**: See how individual tasks contribute to the overall project.

## System Architecture

The application follows a hybrid architecture combining frontend React components with a Python-based AI backend:

### Frontend Architecture (React + TypeScript)

- **Authentication System**: Secure login and role-based access control via AuthContext.
- **Dashboard**: Customized views for managers and team members.
- **Project Management**: Creation, viewing, and management of projects via ProjectContext.
- **Task Management**: Task lists, status updates, and assignments.
- **Analytics**: Data visualizations using Recharts for project insights.
- **Resource Management**: Tracking and allocation of project resources.

### Backend AI Services (Python + Flask)

The backend is built with Flask and exposes several AI-powered endpoints:

1. `/generate-tasks-coding` - Generates tasks for technical projects
2. `/generate-tasks-non-coding` - Generates tasks for non-technical projects
3. `/allocate-tasks` - AI-powered task allocation to team members

### AI Integration Details

The system integrates multiple AI models and components:

#### 1. Task Generation AI (Google Gemini)

- **Models Used**: Gemini 2.0 Flash for text generation tasks
- **Integration Point**: `backend/task_generator_coding.py` and `backend/task_generator_non_coding.py`
- **Functionality**: Takes a project description and produces a structured list of tasks with required skills, resources, and estimated time. 
- **Client Integration**: `src/utils/ai.ts:generateTasksFromText()` calls the backend API to generate tasks from project descriptions.
- **Prompt Engineering**: Carefully crafted prompts instruct the model to generate comprehensive task lists covering the entire project lifecycle.

#### 2. Skill Matching & Task Allocation AI

- **Integration Point**: `backend/task_allocator.py` and `src/utils/ai.ts:calculateSkillMatch()`
- **Algorithm**: Uses fuzzy skill matching with SequenceMatcher for semantic matching between employee skills and task requirements.
- **Optimization Factors**:
  - Prioritizes essential skills (top 60% of required skills)
  - Applies workload balancing to distribute tasks evenly
  - Considers employee availability and current workload
  - Uses a scoring system that weighs skill matches against current workload
- **Load Balancing**: Implements a sophisticated workload factor that penalizes overallocation of tasks to the same employees.
- **Deployed In**: Both frontend (for immediate UI feedback) and backend (for bulk processing).

#### 3. Skills & Resources Recommendation AI

- **Integration Point**: `src/utils/ai.ts:recommendSkillsAndResources()`
- **Model Used**: Gemini API
- **Functionality**: Analyzes task descriptions to recommend appropriate skills and resources.
- **Implementation**: Uses the Gemini API with task-specific prompting to generate contextually appropriate skill and resource recommendations.

#### 4. AI Skill Classification

- **Integration Point**: `backend/task_allocator.py:classify_skills_with_gemini()`
- **Functionality**: Categorizes skills into broader groups (e.g., "Frontend Programming Language") to improve matching between similar but differently named skills.
- **Application**: Used in both task allocation and employee recommendation features.

### Data Flow & Processing

1. **Project Creation Flow**:
   - User creates project with title, description, and category
   - Project is stored in localStorage (development) or database (production)
   - AI task generation is triggered on request

2. **Task Generation Flow**:
   - Project description is sent to the appropriate AI endpoint based on category
   - Backend AI processes description and returns structured task data
   - Tasks are added to project and displayed in the UI

3. **Task Assignment Flow**:
   - System analyzes task requirements and employee skills
   - Fuzzy matching algorithm identifies suitable employees
   - Load balancing algorithm distributes work evenly
   - Assignments are suggested to project manager or automatically applied

4. **Task Status Updates**:
   - Status changes trigger project progress recalculation
   - Analytics are updated in real-time
   - Project timeline is adjusted based on task completion

## Technical Implementation

### Core Technologies

- **Frontend**: React with TypeScript, TailwindCSS, shadcn/ui components
- **State Management**: React Context API
- **Routing**: React Router
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **AI Integration**: Google Gemini API (formerly PaLM)
- **Backend**: Flask (Python)
- **Natural Language Processing**: Custom algorithms for skill matching

### AI Performance & Optimization

The AI components are optimized for both performance and accuracy:

1. **Fallback Mechanisms**: All AI features include fallback strategies if the AI service fails, ensuring the application remains functional.
2. **Caching**: AI responses are cached where appropriate to reduce API calls and improve performance.
3. **Local Computation**: Some AI features (like basic skill matching) can run locally in the browser for immediate feedback.
4. **Hybrid Approach**: Combination of frontend and backend AI processing to balance responsiveness and computational power.

### Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── layout/        # Layout components (Header, Sidebar)
│   ├── tasks/         # Task-related components
│   └── ui/            # UI components from shadcn
├── contexts/          # React contexts for state management
│   ├── AuthContext.tsx   # Authentication state
│   └── ProjectContext.tsx # Project management state
├── utils/             # Utility functions
│   └── ai.ts          # AI integration utilities
├── pages/             # Application pages
│   ├── Home.tsx       # Landing page
│   ├── Dashboard.tsx  # User dashboard
│   ├── Login.tsx      # Authentication
│   └── ...
└── lib/               # Utility functions

backend/
├── app.py             # Flask application entry point
├── task_allocator.py  # AI-powered task allocation
├── task_generator_coding.py      # AI task generation for technical projects 
└── task_generator_non_coding.py  # AI task generation for non-technical projects
```

## AI Model Details

### Google Gemini Integration

The application uses Google's Gemini AI models for natural language processing tasks:

- **Gemini 2.0 Flash**: Used for generating tasks and classifying skills
- **API Integration**: Direct integration via the Gemini API
- **API Key**: Securely stored and used for authentication

### Custom AI Algorithms

1. **Fuzzy Skill Matching Algorithm**:
   - Located in `backend/task_allocator.py` and `src/utils/ai.ts`
   - Uses Python's SequenceMatcher for semantic similarity detection
   - Calculates similarity ratios between skills to account for variations in terminology

2. **Workload Balancing Algorithm**:
   - Located in `src/contexts/ProjectContext.tsx` (autoAssignTasks) and `backend/task_allocator.py`
   - Factors employee's current task count when making assignments
   - Applies a non-linear penalty to overloaded employees
   - Formula: `workloadFactor = 1 / (1 + (taskCount * 0.2))`

3. **Task Prioritization Algorithm**:
   - Identifies essential skills (top 60% of skills for the task)
   - Weighs essential skills higher in the matching process (70% essential, 30% other skills)

## Data Storage

The current implementation uses local storage for data persistence, allowing users to:
- Save projects and their associated tasks locally
- Track project progress and task status
- Simulate AI features for demonstration purposes

In a production environment, this would be replaced with:
- A relational database for structured project data
- Document storage for unstructured project artifacts
- Secure API endpoints for data access

## Future Enhancements

1. **Backend Integration**: Replace local storage with a real database service.
2. **Enhanced AI Models**: Integrate more sophisticated models for improved task generation and allocation.
3. **Real-time Collaboration**: Add WebSocket integration for live updates between team members.
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
- [Google Gemini AI](https://ai.google.dev/gemini-api)
- [Flask](https://flask.palletsprojects.com/)
