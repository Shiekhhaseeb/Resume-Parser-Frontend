import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF, DOC, or DOCX file.");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    if (error) setError(null);
    if (resumeData) setResumeData(null);

    setFileName(file.name);
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

  const onFileSelect = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const resetUpload = () => {
    setResumeData(null);
    setError(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className="app-container">
      <div className="app-wrapper">
        {/* Header Section */}
        <div className="header">
          <div className="header-icon">📄</div>
          <h1 className="title">Resume Parser</h1>
          <p className="subtitle">
            Extract structured data from resumes instantly
          </p>
        </div>

        {/* Upload Section */}
        {!resumeData && (
          <div className="upload-section">
            <div
              className={`upload-area ${dragActive ? "drag-active" : ""} ${
                loading ? "loading" : ""
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <label htmlFor="resume-input" className="upload-content">
                {loading ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <h3>Processing Resume...</h3>
                    <p>Extracting information from {fileName}</p>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">⬆️</div>
                    <h3>Drop your resume here</h3>
                    <p>or click to browse files</p>
                    <div className="file-types">
                      <span className="file-type">PDF</span>
                      <span className="file-type">DOC</span>
                      <span className="file-type">DOCX</span>
                    </div>
                    <p className="size-limit">Maximum file size: 5MB</p>
                  </>
                )}
              </label>

              <input
                ref={fileInputRef}
                className="file-input"
                id="resume-input"
                disabled={loading}
                onChange={onFileSelect}
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
              />
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {resumeData && (
          <div className="results-section">
            <div className="results-header">
              <h2>Parsed Resume Data</h2>
              <button className="reset-btn" onClick={resetUpload}>
                Upload Another Resume
              </button>
            </div>

            <div className="results-content">
              <div className="json-viewer">
                <pre className="json-data">
                  {JSON.stringify(resumeData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
