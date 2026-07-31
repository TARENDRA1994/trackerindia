

async function runTests() {
  console.log("--- Starting Fraud Detection Tests ---\n");

  const baseUrl = "http://localhost:3000/api/register";

  const testCases = [
    {
      description: "Test 1: Normal Valid User",
      payload: {
        name: "Rahul Kumar",
        email: `rahul.kumar.${Date.now()}@gmail.com`,
        whatsapp: "9876543210",
        dob: "1995-05-15",
        state: "Delhi",
        city: "New Delhi",
        medium: "English",
        exam: "UPSC CSE",
        targetYear: "2025"
      },
      expectedStatus: "Registration successful. Awaiting admin approval."
    },
    {
      description: "Test 2: Disposable Email Bot",
      payload: {
        name: "Test Bot",
        email: `bot.${Date.now()}@tempmail.com`,
        whatsapp: "9123456789",
        dob: "2000-01-01",
        state: "Delhi",
        city: "New Delhi",
        medium: "English",
        exam: "UPSC CSE",
        targetYear: "2025"
      },
      expectedStatus: "Registration received. Your account is under manual review."
    },
    {
      description: "Test 3: Keyboard Smash Gibberish & Sequential Phone",
      payload: {
        name: "qwrtypsdfg", // all consonants
        email: `spammer.${Date.now()}@yahoo.com`,
        whatsapp: "1234567890",
        dob: "2000-01-01",
        state: "Delhi",
        city: "New Delhi",
        medium: "English",
        exam: "UPSC CSE",
        targetYear: "2025"
      },
      expectedStatus: "Registration received. Your account is under manual review."
    }
  ];

  for (const tc of testCases) {
    console.log(`\n${tc.description}`);
    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tc.payload)
      });
      const data = await res.json();
      console.log(`Response Status: ${res.status}`);
      console.log(`Response Message: ${data.message || data.error}`);
      if (data.message === tc.expectedStatus) {
        console.log("✅ PASSED");
      } else {
        console.log("❌ FAILED (Expected: " + tc.expectedStatus + ")");
      }
    } catch (e) {
      console.error("Error:", e.message);
    }
  }
}

runTests();
