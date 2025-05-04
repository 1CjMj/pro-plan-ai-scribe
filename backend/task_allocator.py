import json
from task_generator_coding import recommend_skills_and_resources
from difflib import SequenceMatcher

def load_data(tasks_file, candidates_file):
    """Load tasks from a JSONL file and candidates from a JSON file."""
    # Read tasks from JSONL file
    tasks = []
    with open(tasks_file, "r") as f:
        for line in f:
            task = json.loads(line.strip())
            # Map keys to expected structure
            tasks.append({
                "task": task["name"],
                "description": task["description"],
                "skills": [skill.strip() for skill in task["required_skills"].split(";")],
                "resources": [resource.strip() for resource in task["required_resources"].split(";")],
                "complexity": task.get("priority", "unknown").lower(),
                "time_days": int(task["time_estimate_days"]) if task["time_estimate_days"].isdigit() else 0,
                "category": task.get("category", "general")
            })
    
    # Read candidates from JSON file
    with open(candidates_file, "r") as f:
        candidates = json.load(f)
    
    return tasks, candidates

def calculate_similarity(skill1, skill2):
    """Calculate similarity between two skills using SequenceMatcher."""
    return SequenceMatcher(None, skill1, skill2).ratio()

def allocate_tasks_with_time_estimation(tasks, candidates):
    """Allocate tasks to candidates with fuzzy skill matching and workload balancing."""
    assigned_tasks = []

    # Initialize workload tracking
    for candidate in candidates:
        candidate["task_count"] = 0

    for task in tasks:
        # Use AI to recommend skills and resources if not already provided
        if not task["skills"] or not task["resources"]:
            recommendations = recommend_skills_and_resources(task["description"])
            task["skills"] = recommendations["skills"]
            task["resources"] = recommendations["resources"]

        best_candidate = None
        best_match_score = 0

        for candidate in candidates:
            match_score = 0

            # Fuzzy skill matching
            for task_skill in task["skills"]:
                for candidate_skill in candidate["skills"]:
                    similarity = calculate_similarity(task_skill, candidate_skill)
                    if similarity > 0.7:  # Threshold for similarity
                        match_score += similarity

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
                "task": task["task"],
                "assigned_to": best_candidate["name"],
                "skills": task["skills"],
                "resources": task["resources"],
                "complexity": task["complexity"],
                "time_days": task["time_days"]
            })
            # Mark the candidate as unavailable and update workload
            best_candidate["availability"] = False
            best_candidate["task_count"] += 1
        else:
            # If no candidate is found, leave the task unassigned
            assigned_tasks.append({
                "task": task["task"],
                "assigned_to": None,
                "skills": task["skills"],
                "resources": task["resources"],
                "complexity": task["complexity"],
                "time_days": task["time_days"]
            })

    return assigned_tasks

def save_assigned_tasks(assigned_tasks, output_file):
    """Save the assigned tasks to a JSON file."""
    with open(output_file, "w") as f:
        json.dump(assigned_tasks, f, indent=2)
    print(f"Assigned tasks have been saved to {output_file}")

if __name__ == "__main__":
    tasks_file = "tasks.jsonl"
    candidates_file = "employees.json"
    output_file = "assigned_tasks.json"

    try:
        tasks, candidates = load_data(tasks_file, candidates_file)
        assigned_tasks = allocate_tasks_with_time_estimation(tasks, candidates)
        save_assigned_tasks(assigned_tasks, output_file)
    except Exception as e:
        print(f"Error: {str(e)}")