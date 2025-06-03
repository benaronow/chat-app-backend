import { Readable } from "node:stream";
import fs from "fs/promises";

export const streamToString = async (streamBody: any): Promise<string> => {
  if (streamBody instanceof Readable) {
    const chunks: Uint8Array[] = [];
    for await (const chunk of streamBody) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks).toString("utf8");
  } else if (streamBody instanceof Uint8Array) {
    return Buffer.from(streamBody).toString("utf8");
  } else if ("transformToByteArray" in streamBody) {
    const bytes = await streamBody.transformToByteArray();
    return Buffer.from(bytes).toString("utf8");
  } else {
    throw new Error("Unsupported stream type");
  }
};

export const readFileContent = async (filePath: string) => {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error("Error reading file:", error);
    return "";
  }
};
