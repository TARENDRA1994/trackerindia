import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  }
});

export async function sendCredentialsEmail(toEmail: string, role: string, loginId: string, password: string) {
  const fromEmail = process.env.AWS_SES_FROM_EMAIL || "info@trackerindia.com";
  
  const roleName = role === "MENTOR" ? "Mentor" : "Aspirant";
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaeb; border-radius: 8px;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #000080; padding-bottom: 10px;">Welcome to UPSC Mentorship</h2>
      <p style="color: #333; font-size: 16px;">Dear ${roleName},</p>
      <p style="color: #333; font-size: 16px;">Your account has been approved and created successfully. Below are your login credentials for the portal:</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>User ID:</strong> ${loginId}</p>
        <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
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
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Your UPSC Mentorship Login Credentials",
      },
    },
    Source: fromEmail,
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("Email sent successfully:", response.MessageId);
    return true;
  } catch (error) {
    console.error("Error sending SES email:", error);
    return false;
  }
}
