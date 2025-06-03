import axios from "axios";
import fs from "fs";
import NodeFormData from "form-data";
import fg from "fast-glob";
import fsExtra from "fs-extra";

const BACKEND_URL = "http://localhost:3001/upload";
const GLOB_PATTERN = "../chat-app-frontend/src/components/**/*.{tsx,jsx}";

async function uploadFiles() {
  await fsExtra.emptyDir("files");

  const files = await fg(GLOB_PATTERN);

  if (files.length === 0) {
    console.log("No files matched.");
    return;
  }

  const form = new NodeFormData();

  for (const filePath of files) {
    form.append("files", fs.createReadStream(filePath), {
      filename: filePath,
    });
  }

  try {
    const res = await axios.post(BACKEND_URL, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    });

    console.log("Upload successful:", res.data);
  } catch (error: any) {
    console.error("Upload failed:", error.message);
  }
}

uploadFiles();
