import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function addFile() {
  const file = await openai.files.create({
    file: fs.createReadStream(
      "../chat-app-frontend/src/components/Accounts.txt"
    ),
    purpose: "assistants",
  });

  console.log(file);
}

async function createThread() {
  const thread = await openai.beta.threads.create();
  console.log("Thread ID:", thread.id);
}

async function getResponse() {
  try {
    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: "Explain the concept of quantum entanglement.",
    });

    console.log("Response:", response.output_text);
  } catch (error) {
    console.error("Error:", error);
  }
}

getResponse();
