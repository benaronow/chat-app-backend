import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { readFileContent, streamToString } from "./utils";
import multer, { Multer } from "multer";
import fs from "fs/promises";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Use original file name
    cb(null, file.originalname);
  },
});

const upload: Multer = multer({ storage });

interface UploadedFile {
  originalname: string;
  path: string;
  filename: string;
  mimetype: string;
}

interface FileResult {
  filename: string;
  content: string;
}

app.get("/", async (req, res) => {
  res.send("Hello from the server!");
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const bedrock = new BedrockRuntimeClient({ region: "us-east-1" });

app.post("/api/chat", async (req, res) => {
  const { model, instructions, messages, filename } = req.body;

  const fileContent = await readFileContent(`./files/${filename}`);

  const fileSpecificInstructions =
    instructions + `Now here are is the component: ${fileContent}`;

  if (model === "gpt") {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content: fileSpecificInstructions,
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
            content: fileSpecificInstructions,
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
            content: fileSpecificInstructions,
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

app.post("/upload", upload.array("files"), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: "No files uploaded" });
    }

    const fileContents: FileResult[] = await Promise.all(
      files.map(async (file: UploadedFile) => {
        const content = await fs.readFile(file.path, "utf-8");
        return {
          filename: file.originalname,
          content,
        };
      })
    );

    res.status(200).json({
      success: true,
      received: fileContents.length,
      files: fileContents.map((f) => f.filename),
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ error: "Failed to process files" });
  }
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
