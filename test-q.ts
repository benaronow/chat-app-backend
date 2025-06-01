import { QBusinessClient, ChatSyncCommand } from "@aws-sdk/client-qbusiness";

const appId = "fc97c93d-c1ce-4d4f-9104-27667528d328";

const client = new QBusinessClient({ region: "us-east-1" });

async function queryAmazonQ(inputText: string) {
  const command = new ChatSyncCommand({
    applicationId: appId,
    userMessage: inputText,
  });

  try {
    const response = await client.send(command);
    const answer = response.systemMessage || "No response.";
    console.log("Amazon Q Answer:", answer);
    return answer;
  } catch (err) {
    console.error("Error invoking Amazon Q:", err);
    throw err;
  }
}

queryAmazonQ("What is");
