import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  // const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const onFileSelect = (e) => {
    console.log(e.target.files[0]);
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
        console.log("Server response:", data);
        setResumeData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        setLoading(false);
      });
  };
  return (
    <>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}

      {/* <p>Upload Your Resume here</p>
      <button>Upload</button> */}
      <div className="app-wrapper">
        <h1>Resume Parser</h1>
        <ul className="instructions">
          <li>Upload Your Resume here</li>
          <li>Supported formats: PDF, DOC, DOCX</li>
          <li>Max file size: 5MB</li>
          <li>Click on the button below to select your resume file.</li>
        </ul>
        <input onChange={onFileSelect} type="file" accept=".pdf, .doc, .docx" />
        {loading ? <p>Parsing Resume...</p> : null}
        {resumeData ? (
          <textarea
            value={JSON.stringify(resumeData, null, 2)}
            readOnly
            rows="40"
            cols="50"
          />
        ) : null}
      </div>
    </>
  );
}

export default App;
