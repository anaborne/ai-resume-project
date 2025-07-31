import { useState } from 'react';
import axios from 'axios';

const ResumeForm = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [optimizedResume, setOptimizedResume] = useState('');
    const [resumeFile, setResumeFile] = useState(null);

    const onFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const onFileUpload = async () => {
        const formData = new FormData();
        formData.append('resume', resumeFile); 
        console.log('Uploading file:', resumeFile);
        if (!resumeFile) {
            alert("No file selected.");
            return;
        }   
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/upload-resume', formData);
            console.log('Upload successful:', response.data);
        } catch (error) {
            console.error('Axios error:', error.response?.data || error.message);
        }
    };

    const fileData = () => {
		if (resumeFile) {
			return (
				<div>
					<h2>File Details:</h2>
					<p>File Name: {resumeFile.name}</p>
					<p>File Type: {resumeFile.type}</p>
					<p>
						Last Modified: {resumeFile.lastModifiedDate.toDateString()}
					</p>
				</div>
			);
		} else {
			return (
				<div>
					<br />
					<h4>Choose before Pressing the Upload button</h4>
				</div>
			);
		}
	};

    const handleJobDescriptionSubmit = async (e) => {
        try {
            const response = await axios.post (
                'http://127.0.0.1:5000/api/generate-resume',
                { jobDescription }
            );

            setOptimizedResume(response.data.optimizedResume);
        } catch (error) {
            alert('Something went wrong!');
            console.error(error);
        }
    };

  

    return (
        <div style={{ maxWidth: '700px', margin: 'auto' }}>
            <h2>Paste Job Description</h2>
            <div>
                <textarea
                    rows={12}
                    style={{ width: '100%', padding: '10px' }}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job description here..."
                />

                <button onClick={handleJobDescriptionSubmit}>
                    Generate Resume
                </button>
                <div>
                    <input type="file" onChange={onFileChange} />
                    <button onClick={onFileUpload}>
                    Upload Template Resume
                    </button>
                </div>
                {fileData()}
            </div>

            {(
            <div>
                {optimizedResume && <pre>{optimizedResume}</pre>}
            </div>
            )}
        </div>
    );
    };

export default ResumeForm;