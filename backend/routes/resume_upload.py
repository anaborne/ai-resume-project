from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os


resume_upload_bp = Blueprint('resume_upload', __name__)

ALLOWED_EXTENSIONS = {'docx'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# upload template resume route
@resume_upload_bp.route('/api/upload-resume', methods=['POST'])
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
    upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)

    save_path = os.path.join(upload_folder, filename)
    file.save(save_path)

    print(f"✅ File saved at: {save_path}")
    return jsonify({"message": "File uploaded successfully", "filename": filename}), 200