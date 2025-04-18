const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Add this new endpoint
app.get("/api/info", (req, res) => {
  res.json({
    project: "DevShip",
    status: "CI/CD working!",
    time: new Date().toISOString(),
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
