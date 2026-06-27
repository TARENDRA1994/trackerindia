import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  }
});

async function testEmail() {
  // ⚠️ CHANGE THIS to the email address you verified in AWS SES Identities!
  const TO_EMAIL = "sahilgrewal1994@gmail.com";

  const fromEmail = process.env.AWS_SES_FROM_EMAIL || "info@trackerindia.com";

  console.log(`Attempting to send test email...`);
  console.log(`From: ${fromEmail}`);
  console.log(`To: ${TO_EMAIL}`);
  console.log(`Region: ${process.env.AWS_REGION || "ap-southeast-1"}`);
  console.log(`Access Key Loaded: ${process.env.AWS_ACCESS_KEY_ID ? "Yes (Starts with " + process.env.AWS_ACCESS_KEY_ID.substring(0, 4) + ")" : "NO"}`);

  if (TO_EMAIL.includes("ENTER_YOUR")) {
    console.error("❌ ERROR: Please edit scripts/test-email.mjs and enter your verified TO_EMAIL first!");
    return;
  }

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaeb; border-radius: 8px;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #000080; padding-bottom: 10px;">Welcome to UPSC Mentorship</h2>
      <p style="color: #333; font-size: 16px;">Dear Test User,</p>
      <p style="color: #333; font-size: 16px;">Your account has been approved and created successfully. Below are your login credentials for the portal:</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>User ID:</strong> TI-123456</p>
        <p style="margin: 5px 0;"><strong>Password:</strong> abcd1234</p>
      </div>
      
      <p style="color: #333; font-size: 16px;">
        <a href="https://trackerindia.com/login" style="background-color: #000080; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Login to Portal</a>
      </p>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        Stay consistent. Success is near.<br/>
        - A Unit of Mentorship India
      </p>
    </div>
  `;

  const params = {
    Destination: { ToAddresses: [TO_EMAIL] },
    Message: {
      Body: { Html: { Charset: "UTF-8", Data: htmlBody } },
      Subject: { Charset: "UTF-8", Data: "TEST: Your UPSC Mentorship Login Credentials" },
    },
    Source: fromEmail,
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("✅ SUCCESS! Email sent successfully. Message ID:", response.MessageId);
    console.log("Check your inbox to see how it looks!");
  } catch (error) {
    console.error("❌ ERROR FAILED TO SEND EMAIL:");
    console.error(error);
  }
}

testEmail();
