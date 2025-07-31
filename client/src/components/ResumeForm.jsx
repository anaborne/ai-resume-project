import { useState } from 'react';
import { uploadResume, generateOptimizedResume } from '../services/api.js';

const ResumeForm = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [optimizedResume, setOptimizedResume] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [showPreview, setShowPreview] = useState(false);


  const onFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!resumeFile) {
      alert('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const response = await uploadResume(formData);
      console.log('Upload successful:', response.data);
      setUploadedFilename(response.data.filename);
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
      alert('Failed to upload resume.');
    }
  };

  const handleJobDescriptionSubmit = async () => {
    if (!uploadedFilename) {
      alert('Please upload a resume before generating.');
      return;
    }

    try {
      const response = await generateOptimizedResume(jobDescription, uploadedFilename);
      setOptimizedResume(response.data.optimizedResume);
      setShowPreview(true);
    } catch (error) {
      console.error('Generation error:', error.response?.data || error.message);
      alert('Failed to generate optimized resume.');
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: 'auto' }}>
      <h2>Upload Resume & Paste Job Description</h2>

      {/* Upload Section */}
      <div>
        <input type="file" onChange={onFileChange} />
        <button onClick={onFileUpload}>Upload Template Resume</button>
        {resumeFile && (
          <div>
            <p><strong>File:</strong> {resumeFile.name}</p>
          </div>
        )}
      </div>

      {/* Job Description Section */}
      <div>
        <textarea
          rows={12}
          style={{ width: '100%', padding: '10px', marginTop: '20px' }}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here..."
        />
        <button onClick={handleJobDescriptionSubmit}>Generate Resume</button>
      </div>

      {/* Optimized Resume Output */}
      {optimizedResume && (
        <div style={{ marginTop: '20px' }}>
          <h3>Optimized Resume Output:</h3>
          <pre style={{ background: '#f4f4f4', padding: '10px' }}>{optimizedResume}</pre>

          {showPreview && (
            <div style={{ marginTop: '30px' }}>
                <h3>Optimized Resume Preview</h3>
                <iframe
                    src="http://127.0.0.1:5000/api/download-resume-pdf"
                    style={{ width: '100%', height: '800px', border: '1px solid #ccc' }}
                    title="Optimized Resume PDF"
                />
            </div>

        )}
        </div>
      )}
        
    </div>
  );
};

export default ResumeForm;
