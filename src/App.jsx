import { useState } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState(null);
  const onFileSelect = (e) => {
    if (error) {
      setError(null);
    }
    if (resumeData) {
      setResumeData(null);
    }
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setResumeData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(
          "An error occurred while parsing the resume. Please try again."
        );
        setLoading(false);
      });
  };
  return (
    <>
      <div className="app-wrapper">
        <h1>Resume Parser</h1>
        <ul className="instructions">
          <li>Upload Your Resume here</li>
          <li>Supported formats: PDF, DOC, DOCX</li>
          <li>Max file size: 5MB</li>
          <li>Click on the button below to select your resume file.</li>
        </ul>
        <input
          disabled={loading}
          onChange={onFileSelect}
          type="file"
          accept=".pdf, .doc, .docx"
        />
        {loading ? <p>Parsing Resume...</p> : null}
        {resumeData ? (
          <textarea
            value={JSON.stringify(resumeData, null, 2)}
            readOnly
            rows="40"
            cols="50"
          />
        ) : null}
        {error ? <p className="error">{error}</p> : null}
      </div>
    </>
  );
}

export default App;
