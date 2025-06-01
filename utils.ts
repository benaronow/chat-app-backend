import { Readable } from "node:stream";

export const streamToString = async (streamBody: any): Promise<string> => {
  if (streamBody instanceof Readable) {
    const chunks: Uint8Array[] = [];
    for await (const chunk of streamBody) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks).toString("utf8");
  } else if (streamBody instanceof Uint8Array) {
    // In some cases, it might already be a Uint8Array
    return Buffer.from(streamBody).toString("utf8");
  } else if ("transformToByteArray" in streamBody) {
    // If it's a Uint8ArrayBlobAdapter with transformToByteArray method
    const bytes = await streamBody.transformToByteArray();
    return Buffer.from(bytes).toString("utf8");
  } else {
    throw new Error("Unsupported stream type");
  }
};
