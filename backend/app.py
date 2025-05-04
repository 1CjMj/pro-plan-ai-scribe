from flask import Flask, jsonify, request
from flask_cors import CORS
from task_generator_coding import generate_project_tasks, parse_tasks
from task_generator_non_coding import generate_non_coding_tasks, parse_tasks as parse_non_coding_tasks
from task_allocator import allocate_tasks_with_time_estimation
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
# Enable CORS for the Flask app
CORS(app, resources={r"/*": {"origins": "*"}})

# Sample route to test the server
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the AI Task Generation Backend!"})

# Endpoint for AI task generation (coding)
@app.route('/generate-tasks-coding', methods=['POST'])
def generate_tasks_coding():
    data = request.get_json()
    description = data.get('description', '')
    if not description:
        return jsonify({"error": "Description is required"}), 400

    try:
        raw_output = generate_project_tasks(description)
        tasks = parse_tasks(raw_output)
        return jsonify(tasks)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint for AI task generation (non-coding)
@app.route('/generate-tasks-non-coding', methods=['POST'])
def generate_tasks_non_coding():
    data = request.get_json()
    description = data.get('description', '')
    if not description:
        logging.error("Description is missing in the request payload.")
        return jsonify({"error": "Description is required"}), 400

    try:
        raw_output = generate_non_coding_tasks(description)
        logging.debug(f"Raw output from task generator: {raw_output}")
        tasks = raw_output.get('tasks', [])
        return jsonify({"tasks": tasks})
    except Exception as e:
        logging.exception("Error occurred while generating non-coding tasks.")
        return jsonify({"error": str(e)}), 500

# Endpoint for task allocation
@app.route('/allocate-tasks', methods=['POST'])
def allocate_tasks():
    """API endpoint to allocate tasks to employees."""
    try:
        # Load tasks and candidates from request body
        data = request.get_json()
        tasks = data.get('tasks', [])
        candidates = data.get('candidates', [])

        # Perform task allocation
        assigned_tasks = allocate_tasks_with_time_estimation(tasks, candidates)

        return jsonify({"success": True, "assigned_tasks": assigned_tasks}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)