import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { streamToString } from "./utils";

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

const bedrock = new BedrockRuntimeClient({ region: "us-east-1" });

const MODEL_IDENTITY_MESSAGE =
  "Your name is Portal Pete. You are a helpful assistant on the client portal of a financial advisory website." +
  "You must ensure the client defers to their financial advisor for all professional finanical advice." +
  "The first user message will provide context about the client and their financial situation." +
  "You should not respond to this message, but instead wait for the client to ask a question." +
  "You do have access to the client's personal and financial information." +
  "Any message recieved that beings with 'CONTEXT:' should be treated as context about the client and their financial situation, and should not be responded to.";

app.post("/api/chat", async (req, res) => {
  const { model, messages } = req.body;

  if (model === "gpt") {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content: MODEL_IDENTITY_MESSAGE,
          },
          ...messages,
        ],
      });

      res.json({ reply: completion.choices[0].message?.content });
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.status(500).json({ reply: "Sorry, something went wrong." });
    }
  }

  if (model === "claude") {
    const command = new InvokeModelCommand({
      modelId:
        "arn:aws:bedrock:us-east-1:862205457520:prompt-router/bt7f7xg3wez3",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 200,
        top_k: 250,
        stop_sequences: [],
        temperature: 1,
        top_p: 0.999,
        messages: [
          {
            role: "user",
            content: MODEL_IDENTITY_MESSAGE,
          },
          ...messages,
        ],
      }),
    });

    try {
      const response = await bedrock.send(command);
      const responseBody: string = (await streamToString(
        response.body
      )) as string;
      const json = JSON.parse(responseBody);
      res.json({ reply: json.content[0].text });
    } catch (error) {
      console.error("Bedrock API error:", error);
      res.status(500).json({ reply: "Sorry, something went wrong." });
    }
  }

  if (model === "deepseek") {
    const command = new InvokeModelCommand({
      modelId: "us.deepseek.r1-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: MODEL_IDENTITY_MESSAGE,
          },
          ...messages,
        ],
      }),
    });

    try {
      const response = await bedrock.send(command);
      const responseBody: string = (await streamToString(
        response.body
      )) as string;
      const json = JSON.parse(responseBody);
      res.json({ reply: json.choices[0].message.content });
    } catch (error) {
      console.error("Bedrock API error:", error);
      res.status(500).json({ reply: "Sorry, something went wrong." });
    }
  }
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
