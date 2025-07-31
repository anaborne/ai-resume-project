from flask import Flask, request, jsonify
from flask_cors import CORS 
from werkzeug.utils import secure_filename
from openai import OpenAI
from dotenv import load_dotenv
import os


app = Flask(__name__)
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'docx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# upload template resume route
@app.route('/api/upload-resume', methods=['POST'])
def upload_resume():
    print("Received request to upload resume")
    print("Request.files keys:", request.files.keys())

    if 'resume' not in request.files:
        print("No file part in the request")
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['resume']

    if file.filename == '':
        print("No file selected")
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        print("Invalid file type")
        return jsonify({"error": "Invalid file type"}), 400

    filename = secure_filename(file.filename)
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(save_path)

    print(f"✅ File saved at: {save_path}")
    return jsonify({"message": "File uploaded successfully"}), 200


# openAI request route
@app.route('/api/generate-resume', methods=['POST'])
def generate_resume():
    job_description = request.json.get('jobDescription')
    completion = client.chat.completions.create(
        model="gpt-4.1",
        messages=[
            {"role": "system", "content": "You are an expert resume optimizer."},
            {"role": "user", "content": f"Summarize the following job description into one sentence: {job_description}"}
        ]
    )
    print(completion.choices[0].message.content)
    return jsonify({"optimizedResume": completion.choices[0].message.content})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
