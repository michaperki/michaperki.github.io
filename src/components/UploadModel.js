
import React, { useState } from 'react';

const UploadModel = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file.');
      return;
    }
    const formData = new FormData();
    // Note: Use the field name 'model' and accept only Python files
    formData.append('model', file);
    setUploading(true);
    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.modelId) {
          setMessage('Upload successful!');
          onUpload(data.modelId);
        } else {
          setMessage('Upload failed.');
        }
        setUploading(false);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        setMessage('Upload error.');
        setUploading(false);
      });
  };

  return (
    <div className="upload-model">
      <h2>Upload Custom AI Model (Python)</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".py" onChange={handleFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadModel;

