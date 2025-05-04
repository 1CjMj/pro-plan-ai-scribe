import google.generativeai as genai
import json

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyBXgkoIoxI7oE24Wr5V-SJ0ZG_lxg1hpLs"  # Replace with your actual key
genai.configure(api_key=GEMINI_API_KEY)

# Update generate_project_tasks to use Gemini

def generate_project_tasks(description):
    tasks = [
        # Example task structure
        {
            "title": "Define Project Scope and Objectives",
            "description": "Define the scope and objectives of the project.",
            "skills": ["Project Management", "Requirements Gathering", "Stakeholder Communication"],
            "resources": ["Stakeholder Meetings", "Documentation Software", "Project Management Templates"],
            "estimatedHours": 24,
            "createdBy": "ai",
        },
        # Add more tasks here
    ]
    return {"tasks": tasks}  # Wrap tasks in a dictionary with a 'tasks' key

def parse_tasks(output):
    """Improved task parser to match the format specified in the TSX file."""
    tasks = []

    for line in output.split('\n'):
        line = line.strip()
        if line.startswith("- Task:"):
            task = {
                "title": line.split(":", 1)[1].strip(),
                "description": line.split(":", 1)[1].strip(),
                "status": "not-started",
                "skills": [],
                "estimatedHours": 0,
                "resources": [],
                "createdBy": "ai"
            }
            tasks.append(task)
        elif line.startswith("- Skills:"):
            skills = line.split(":", 1)[1].strip()
            if tasks:
                tasks[-1]['skills'] = [s.strip() for s in skills.split(",")] if skills else []
        elif line.startswith("- Resources:"):
            resources = line.split(":", 1)[1].strip()
            if tasks:
                tasks[-1]['resources'] = [r.strip() for r in resources.split(",")] if resources else []
        elif line.startswith("- Time:"):
            try:
                estimated_hours = int(line.split(":", 1)[1].strip()) * 8  # Convert days to hours
                if tasks:
                    tasks[-1]['estimatedHours'] = estimated_hours
            except ValueError:
                if tasks:
                    tasks[-1]['estimatedHours'] = 0

    return tasks

def recommend_skills_and_resources(task_description):
    """Use AI to recommend skills and resources for a given task description."""
    prompt = f"""For the task described below, recommend the following:
    - Skills: A comma-separated list of skills required to complete the task.
    - Resources: A comma-separated list of resources required to complete the task.

    Task Description: {task_description}

    Output format:
    - Skills: [Comma-separated list of skills]
    - Resources: [Comma-separated list of resources]
    """

    raw_output = generate_project_tasks(prompt)
    tasks = parse_tasks(raw_output)
    if tasks:
        return {
            "skills": tasks[0].get("skills", []),
            "resources": tasks[0].get("resources", [])
        }
    return {"skills": [], "resources": []}

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        # API mode - get description from command line
        project_description = sys.argv[1]
        raw_output = generate_project_tasks(project_description)
        parsed_tasks = parse_tasks(raw_output)
        print(json.dumps(parsed_tasks))  # Only output JSON
    else:
        # Interactive mode
        project_description = input("Enter the project description: ")
        try:
            print("Generating tasks... (This may take a moment)")
            raw_output = generate_project_tasks(project_description)
            parsed_tasks = parse_tasks(raw_output)
            print("\nStructured Tasks:")
            print(json.dumps(parsed_tasks, indent=2))
            with open("tasks_generated.json", "w") as f:
                json.dump(parsed_tasks, f, indent=2)
        except Exception as e:
            print(f"Error: {str(e)}")