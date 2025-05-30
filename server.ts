import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Hello from the server!");
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content:
            "Your name is Portal Pete. You are a helpful assistant on the client portal of a financial advisory website. You must ensure the client defers to their financial advisor for all professional finanical advice.",
        },
        ...messages,
      ],
    });

    res.json({ reply: completion.choices[0].message?.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
