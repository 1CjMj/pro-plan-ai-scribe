
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

def calculate_candidate_skill_match(candidate_skills, task_skills):
    """Calculate the skill match score between a candidate and task."""
    if not task_skills or not candidate_skills:
        return 0
    
    total_match = 0
    # Find best matches for each task skill
    for task_skill in task_skills:
        best_match = 0
        for candidate_skill in candidate_skills:
            similarity = calculate_similarity(task_skill, candidate_skill)
            best_match = max(best_match, similarity)
        total_match += best_match
    
    # Normalize by number of task skills
    return total_match / len(task_skills) if task_skills else 0

def allocate_tasks_with_time_estimation(tasks, candidates):
    """Allocate tasks to candidates with fuzzy skill matching and improved workload balancing."""
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

        # Identify essential skills (top 60% of skills for the task)
        essential_skill_count = max(1, int(len(task["skills"]) * 0.6))
        essential_skills = task["skills"][:essential_skill_count]

        # First, find the candidates with the best skill match
        candidates_with_scores = []
        for candidate in candidates:
            skill_match = calculate_candidate_skill_match(candidate["skills"], task["skills"])
            essential_skill_match = calculate_candidate_skill_match(candidate["skills"], essential_skills)
            
            # Calculate final score considering skill match and workload
            # Higher weight on essential skills
            match_score = (essential_skill_match * 0.7) + (skill_match * 0.3)
            
            # Apply workload penalty (more tasks = lower score)
            workload_factor = 1 / (1 + (candidate["task_count"] * 0.2))
            
            # Adjust score based on availability
            availability_bonus = 1 if candidate["availability"] else 0.5
            
            final_score = match_score * workload_factor * availability_bonus
            
            candidates_with_scores.append({
                "candidate": candidate,
                "score": final_score,
                "skill_match": skill_match,
                "essential_match": essential_skill_match
            })
        
        # Sort candidates by final score (descending)
        candidates_with_scores.sort(key=lambda x: x["score"], reverse=True)
        
        # Assign the task to the best candidate
        if candidates_with_scores and candidates_with_scores[0]["score"] > 0:
            best_candidate = candidates_with_scores[0]["candidate"]
            assigned_tasks.append({
                "task": task["task"],
                "assigned_to": best_candidate["name"],
                "skills": task["skills"],
                "resources": task["resources"],
                "complexity": task["complexity"],
                "time_days": task["time_days"],
                "match_quality": candidates_with_scores[0]["skill_match"]  # Store match quality for reporting
            })
            # Update workload for the assigned candidate
            best_candidate["task_count"] += 1
        else:
            # If no candidate is found, leave the task unassigned
            assigned_tasks.append({
                "task": task["task"],
                "assigned_to": None,
                "skills": task["skills"],
                "resources": task["resources"],
                "complexity": task["complexity"],
                "time_days": task["time_days"],
                "match_quality": 0
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
