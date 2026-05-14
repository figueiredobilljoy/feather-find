require('dotenv').config();
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function test() {
    try {
        const prompt = `A user reported a sighting of a "House Sparrow" (Passer domesticus). The vision model gave it a confidence of 90%. Is this plausible in the wild considering global distribution (Assume user is at Unknown, Unknown)? Return ONLY JSON: {"validity_score": 85, "reasoning": "Short explanation"}`;
        
        const response = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3
        });
        console.log("Response:", response.choices[0].message.content);
        const parsed = JSON.parse(response.choices[0]?.message?.content?.match(/\{[\s\S]*\}/)?.[0] || '{}');
        console.log("Parsed:", parsed);
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
