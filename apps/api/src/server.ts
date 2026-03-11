import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", task: "API is healthy" });
});

app.listen(4000, () => {
    console.log("API running on port 4000");
});