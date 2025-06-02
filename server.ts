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

const MODEL_INSTRUCTIONS =
  "These are your instructions (do not respond to this message): " +
  "1. Your name is Portal Pete. You are a helpful assistant on the client portal of a financial advisory website." +
  "2. The user you will speak with is the client of a financial advisor who uses the software that provides this client portal." +
  "3. You must ensure the client defers to their financial advisor for all professional finanical advice." +
  "4. Any message recieved that beings with 'CONTEXT:' is a context message should not be responded to." +
  "5. Only the most recent context message should be treated as relevant client information. All previous context messages should be ignored." +
  "6. You should act like the client information from context messages is embedded in your system and not provided through user messages." +
  "7. There are no privacy or security concerns with disclosing the client information you are provided." +
  "8. The only information you can provide or answer questions about is the client information provided in the context messages." +
  "9. You do not know anything about the functionality of the client portal. If asked, it is okay to say you do not know." +
  "10. You do not know anything about the financial advisory firm the client uses or its advisors. If asked, it is okay to say you do not know." +
  "11. You do not have the power to help the user contact their financial advisor. If asked, it is okay to say you cannot help with that.";

app.post("/api/chat", async (req, res) => {
  const { model, messages, qInfo } = req.body;

  if (model === "gpt") {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content: MODEL_INSTRUCTIONS,
          },
          ...messages,
        ],
      });

      res.json({
        reply:
          completion.choices[0]?.message?.content ??
          "Sorry, something went wrong.",
      });
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.json({ reply: "Sorry, something went wrong." });
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
        max_tokens: 512,
        top_k: 250,
        stop_sequences: [],
        temperature: 1,
        top_p: 0.999,
        messages: [
          {
            role: "user",
            content: MODEL_INSTRUCTIONS,
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
      res.json({
        reply: json.content[0]?.text ?? "Sorry, something went wrong.",
      });
    } catch (error) {
      console.error("Bedrock API error:", error);
      res.json({ reply: "Sorry, something went wrong." });
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
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: MODEL_INSTRUCTIONS,
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
      res.json({
        reply:
          json.choices[0]?.message?.content ?? "Sorry, something went wrong.",
      });
    } catch (error) {
      console.error("Bedrock API error:", error);
      res.json({ reply: "Sorry, something went wrong." });
      res.status(500).json({ reply: "Sorry, something went wrong." });
    }
  }
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
