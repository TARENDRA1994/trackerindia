const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

export async function sendWhatsAppMessage(
  to: string, 
  type: "text" | "interactive" | "template", 
  payload: any
) {
  if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_ID) {
    throw new Error("WhatsApp credentials not configured");
  }

  // Ensure the phone number is correctly formatted (remove + if present, etc.)
  const formattedTo = to.replace(/[^0-9]/g, '');

  const url = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`;

  const body: any = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: formattedTo,
    type: type,
  };

  if (type === "text") {
    body.text = payload;
  } else if (type === "interactive") {
    body.interactive = payload;
  } else if (type === "template") {
    body.template = payload;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API Error:", data);
      throw new Error(data.error?.message || "Failed to send WhatsApp message");
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error: any) {
    console.error("WhatsApp Request Failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export function buildDailyReminderInteractivePayload(studentName: string) {
  // Replace this with your actual app URL if you have it in env
  const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";
  
  return {
    type: "button",
    header: {
      type: "text",
      text: "UPSC Tracker - Daily Log"
    },
    body: {
      text: `Hello ${studentName}! 🌟\n\nThis is your daily reminder to submit your study log for today. Consistency is the key to clearing UPSC!\n\nSubmit your log here: ${APP_URL}/dashboard/student/daily-log\n\nHave you already submitted it?`
    },
    footer: {
      text: "Track your progress"
    },
    action: {
      buttons: [
        {
          type: "reply",
          reply: {
            id: "log_submitted_yes",
            title: "Yes, I filled already"
          }
        }
      ]
    }
  };
}
