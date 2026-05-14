require('dotenv').config({ override: true });
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const fs = require('fs');

async function testVision() {
    try {
        console.log("Testing with API Key:", process.env.GROQ_API_KEY.substring(0, 8) + "...");
        
        // Use the sample bird image we have, or just a dummy base64 if it's missing.
        // Let's create a 1x1 pixel base64 image just to test the model existence.
        const dataUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";

        const response = await groq.chat.completions.create({
            messages: [{
                role: 'user',
                content: [
                    { type: 'text', text: 'Is this a bird?' },
                    { type: 'image_url', image_url: { url: dataUrl } }
                ]
            }],
            model: 'llama-3.2-11b-vision-preview',
            max_tokens: 50
        });
        console.log("SUCCESS. Response:", response.choices[0].message.content);
    } catch (e) {
        console.error("VISION ERROR:", e.message);
    }
}
testVision();
