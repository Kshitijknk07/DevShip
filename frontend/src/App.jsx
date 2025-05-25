import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";

function App() {
  const [info, setInfo] = useState(null);
  const [realTime, setRealTime] = useState("");
  const [showAbout, setShowAbout] = useState(false);

  // Fetch API info
  useEffect(() => {
    fetch("/api/info")
      .then((res) => res.json())
      .then((data) => setInfo(data))
      .catch(() => setInfo(null));
  }, []);

  // Real-time WebSocket
  useEffect(() => {
    const socket = io();
    socket.on("time", (data) => setRealTime(data.time));
    return () => socket.disconnect();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f5f6fa", minHeight: "100vh" }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            DevShip 🚀
          </Typography>
          <Button color="inherit" onClick={() => setShowAbout(false)}>
            Home
          </Button>
          <Button color="inherit" onClick={() => setShowAbout(true)}>
            About
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {!showAbout ? (
          <>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Welcome to DevShip
                </Typography>
                <Typography>
                  <b>Real-time time from backend:</b>{" "}
                  {realTime ? (
                    <span style={{ color: "#1976d2" }}>{realTime}</span>
                  ) : (
                    <CircularProgress size={16} />
                  )}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">Backend Info:</Typography>
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
                  <CircularProgress />
                )}
              </CardContent>
            </Card>
            <Paper elevation={0} sx={{ p: 2, mt: 2, textAlign: "center" }}>
              <Typography className="read-the-docs">
                This is a production-ready, real-time, full-stack starter kit.
              </Typography>
            </Paper>
          </>
        ) : (
          <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
            <Typography variant="h4" gutterBottom>
              About DevShip
            </Typography>
            <Typography>
              DevShip is a modern multi-container application starter kit using
              React, Node.js, Docker, and GitHub Actions.
              <br />
              This demo shows live frontend-backend integration and a working
              CI/CD pipeline!
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default App;
