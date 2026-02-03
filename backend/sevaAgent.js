import fetch from "node-fetch";

export async function askSevaAgent(question) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing in .env");
      return "Sorry, AI is not configured correctly.";
    }
    const body = {
      contents: [
        {
          parts: [
            {
              text: `You are Seva Agent, a polite Indian KYC assistant. 
Help users with Aadhaar, PAN, and Driving License verification. 
Never ask for Aadhaar number, PAN number, OTP, or password. 
Answer politely. Question: ${question}`
            }
          ]
        }
      ]
    };

    const res = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    process.env.GEMINI_API_KEY,

      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );

    const data = await res.json();

    console.log("Gemini API response:", JSON.stringify(data, null, 2));

    if (data?.candidates?.length > 0) {
      const text = data.candidates[0]?.content?.parts?.map(p => p.text).join(" ") || "";
      return text.trim() || "Sorry, I could not generate an answer.";
    }

    return "Sorry, I could not generate an answer.";

  } catch (err) {
    console.error("Seva Agent fetch error:", err);
    return "Sorry, I could not answer due to a server error.";
  }
}
