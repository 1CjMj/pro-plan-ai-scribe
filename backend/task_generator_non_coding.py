import google.generativeai as genai
import json
from difflib import SequenceMatcher

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyBXgkoIoxI7oE24Wr5V-SJ0ZG_lxg1hpLs"  # Replace with your actual key
genai.configure(api_key=GEMINI_API_KEY)

# Update generate_non_coding_tasks to use Gemini

def generate_non_coding_tasks(description):
    tasks = [
        # Example task structure
        {
            "title": "Conduct Stakeholder Analysis",
            "description": "Analyze stakeholders to understand their needs and expectations.",
            "skills": ["Stakeholder Communication", "Analysis", "Documentation"],
            "resources": ["Stakeholder Interviews", "Survey Tools", "Analysis Templates"],
            "estimatedHours": 16,
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

    raw_output = generate_non_coding_tasks(prompt)
    tasks = parse_tasks(raw_output)
    if tasks:
        return {
            "skills": tasks[0].get("skills", []),
            "resources": tasks[0].get("resources", [])
        }
    return {"skills": [], "resources": []}

def calculate_similarity(skill1, skill2):
    """Calculate similarity between two skills using SequenceMatcher."""
    return SequenceMatcher(None, skill1, skill2).ratio()

def classify_skills_with_gemini(skill):
    """Use Gemini AI to classify a skill into a broader category."""
    # Example: Replace this with actual Gemini API integration
    skill_groups = {
        "Frontend Programming Language": ["HTML", "React", "CSS", "JavaScript"],
        "Backend Programming Language": ["Node.js", "Python", "Java", "Ruby"],
        "Database Management": ["SQL", "MongoDB", "PostgreSQL", "Redis"],
    }
    for group, skills in skill_groups.items():
        if skill in skills:
            return group
    return "Other"

def allocate_tasks_with_time_estimation(tasks, candidates):
    """Allocate tasks to candidates with enhanced fuzzy skill matching."""
    assigned_tasks = []

    # Initialize workload tracking
    for candidate in candidates:
        candidate["task_count"] = 0

    for task in tasks:
        best_candidate = None
        best_match_score = 0

        for candidate in candidates:
            match_score = 0

            # Enhanced fuzzy skill matching
            for task_skill in task["skills"]:
                task_skill_group = classify_skills_with_gemini(task_skill)
                for candidate_skill in candidate["skills"]:
                    candidate_skill_group = classify_skills_with_gemini(candidate_skill)
                    if task_skill_group == candidate_skill_group:
                        match_score += 1

            # Add score for availability and workload balancing
            if candidate["availability"]:
                match_score += 1
            match_score -= candidate["task_count"] * 0.1  # Penalize candidates with more tasks

            # Update the best candidate if this one is better
            if match_score > best_match_score:
                best_match_score = match_score
                best_candidate = candidate

        # Assign the task to the best candidate
        if best_candidate:
            assigned_tasks.append({
                "task": task["title"],
                "assigned_to": best_candidate["name"],
                "skills": task["skills"],
                "resources": task["resources"],
                "estimatedHours": task["estimatedHours"]
            })
            # Mark the candidate as unavailable and update workload
            best_candidate["availability"] = False
            best_candidate["task_count"] += 1
        else:
            # If no candidate is found, assign to the closest match or leave unassigned
            assigned_tasks.append({
                "task": task["title"],
                "assigned_to": None,
                "skills": task["skills"],
                "resources": task["resources"],
                "estimatedHours": task["estimatedHours"]
            })

    return assigned_tasks

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        # API mode - get description from command line
        project_description = sys.argv[1]
        raw_output = generate_non_coding_tasks(project_description)
        parsed_tasks = parse_tasks(raw_output)
        print(json.dumps(parsed_tasks))  # Only output JSON
    else:
        # Interactive mode
        project_description = input("Enter the project description: ")
        try:
            print("Generating tasks... (This may take a moment)")
            raw_output = generate_non_coding_tasks(project_description)
            parsed_tasks = parse_tasks(raw_output)
            print("\nStructured Tasks:")
            print(json.dumps(parsed_tasks, indent=2))
            with open("tasks_generated.json", "w") as f:
                json.dump(parsed_tasks, f, indent=2)
        except Exception as e:
            print(f"Error: {str(e)}")