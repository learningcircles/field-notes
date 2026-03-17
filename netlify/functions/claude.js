
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
 
  try {
    console.log("API Key present:", !!process.env.ANTHROPIC_API_KEY);
    console.log("Request body:", event.body);
 
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: event.body
    });
 
    console.log("Anthropic status:", response.status);
    const text = await response.text();
    console.log("Anthropic response:", text);
 
    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: text
    };
  } catch (err) {
    console.log("Error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
 
