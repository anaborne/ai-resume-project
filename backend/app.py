from flask import Flask
from flask_cors import CORS
import os

from routes.resume_upload import resume_upload_bp
from routes.resume_generation import resume_generation_bp
from config import DevelopmentConfig


def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    CORS(app)

    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)

    app.register_blueprint(resume_upload_bp)
    app.register_blueprint(resume_generation_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000)
