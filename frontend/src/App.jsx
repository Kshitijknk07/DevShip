import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [backendMessage, setBackendMessage] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.text())
      .then((data) => setBackendMessage(data))
      .catch(() => setBackendMessage("Could not fetch backend message"));
  }, []);

  // Fetch /api/info from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/info")
      .then((res) => res.json())
      .then((data) => setInfo(data))
      .catch(() => setInfo(null));
  }, []);

  return (
    <>
      <nav className="navbar">
        <span className="nav-title">DevShip 🚀</span>
        <button className="nav-btn" onClick={() => setShowAbout(false)}>
          Home
        </button>
        <button className="nav-btn" onClick={() => setShowAbout(true)}>
          About
        </button>
      </nav>
      {!showAbout ? (
        <>
          <h2>Welcome to DevShip! 🚀</h2>
          <div>
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
          <div className="card">
            <h3>Backend says:</h3>
            <p>{backendMessage}</p>
          </div>
          <div className="card">
            <h3>Custom Message:</h3>
            <input
              type="text"
              placeholder="Type your message here"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
            <p>{customMessage && `You typed: ${customMessage}`}</p>
          </div>
          <div className="card">
            <h3>Backend Info:</h3>
            {info ? (
              <ul>
                <li>
                  <b>Project:</b> {info.project}
                </li>
                <li>
                  <b>Status:</b> {info.status}
                </li>
                <li>
                  <b>Time:</b> {info.time}
                </li>
              </ul>
            ) : (
              <p>Loading backend info...</p>
            )}
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
        </>
      ) : (
        <section className="about-section">
          <h2>About DevShip</h2>
          <p>
            DevShip is a modern multi-container application starter kit using
            React, Node.js, and Docker.
            <br />
            This demo shows live frontend-backend integration and a working
            CI/CD pipeline!
          </p>
        </section>
      )}
    </>
  );
}

export default App;
