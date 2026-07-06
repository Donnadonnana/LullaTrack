import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});