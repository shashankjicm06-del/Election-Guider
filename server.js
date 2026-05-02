const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend static files

// Google Gemini AI Configuration
const { GoogleGenAI } = require('@google/genai');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini Client
let ai;
if (GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Local Fallback Election Knowledge Base (Aligned with Flashcards)
        const getFallbackResponse = (query) => {
            const q = query.toLowerCase();

            // 1. Highly Specific Topics (Powers, Processes)
            if (q.includes("pm power") || q.includes("power of pm") || q.includes("prime minister power")) {
                return "**Powers of the PM:** The Prime Minister heads the Council of Ministers, advises the President on the appointment of other ministers, chairs Cabinet meetings, and is the chief architect of national policy.";
            }
            if (q.includes("cm power") || q.includes("power of cm") || q.includes("chief minister power")) {
                return "**Powers of the CM:** The Chief Minister is the real executive head of the state. They advise the Governor on the appointment of state ministers, lead the state cabinet, and oversee the state's administration and law-making.";
            }
            if (q.includes("how to vote") || (q.includes("how") && q.includes("vote"))) {
                return "**How to Vote in India:**<br/>1. **Registration:** Ensure your name is in the Electoral Roll.<br/>2. **ID Proof:** Carry your Voter ID (EPIC) or another valid ID like Aadhaar to the polling booth.<br/>3. **The Booth:** An official will verify your ID and mark your finger with ink.<br/>4. **The EVM:** Enter the private compartment and press the blue button next to your chosen candidate on the EVM.";
            }
            if (q.includes("why to vote") || q.includes("why vote") || (q.includes("why") && q.includes("vote"))) {
                return "**Why to Vote?**<br/>1. **Your Voice:** It is the most powerful tool to choose who leads your country.<br/>2. **Accountability:** Voting allows you to hold the government accountable for its actions.<br/>3. **Democratic Duty:** It strengthens the foundation of our democracy.";
            }
            if (q.includes("what is voting") || (q.includes("what") && q.includes("vote"))) {
                return "**What is Voting?**<br/>Voting is the fundamental process by which citizens choose their representatives in the government. In India, it is a constitutional right for every citizen aged 18 and above.";
            }
            if (q.includes("won") || q.includes("result") || q.includes("winner")) {
                return "**Election Results:** To find the most recent winners and government formations in specific states or the center, you can visit the official **Election Commission of India (results.eci.gov.in)** website. Generally, the party or coalition that crosses the halfway mark (272 for Lok Sabha, or specific numbers for State Assemblies) forms the government.";
            }

            // 2. Technical Terms (EVM, VVPAT, MCC)
            if (q.includes("evm") || q.includes("vvpat")) {
                return "**EVM:** Electronic Voting Machine. Used in Indian elections to securely cast and record votes electronically.<br/><br/>**VVPAT:** Voter Verifiable Paper Audit Trail. Provides feedback to voters using a slip of paper to verify their vote was cast correctly.";
            }
            if (q.includes("mcc") || q.includes("code of conduct") || q.includes("code")) {
                return "**MCC (Model Code of Conduct):** Guidelines issued by the Election Commission of India to regulate political parties and candidates prior to elections to ensure free and fair polling.";
            }

            // 3. Roles & Entities (PM, CM, President, MP, MLA)
            if (q.includes("pm") || q.includes("prime minister")) {
                return "**Prime Minister (PM):** The head of the Union Government. The PM is the leader of the party or coalition with a majority (272+ seats) in the Lok Sabha and is appointed by the President.";
            }
            if (q.includes("cm") || q.includes("chief minister")) {
                return "**Chief Minister (CM):** The head of a State Government. The CM is the leader of the party or coalition with a majority in the State Legislative Assembly (Vidhan Sabha) and is appointed by the Governor.";
            }
            if (q.includes("president")) {
                return "**President of India:** The Head of State and the Supreme Commander of the Indian Armed Forces. The President is elected by the Electoral College for a term of 5 years.";
            }
            if (q.includes("electoral college")) {
                return "**Electoral College:** The body that elects the President of India. It consists of the elected members of the Lok Sabha, Rajya Sabha, and all State Legislative Assemblies (MLAs).";
            }
            if (q.includes("state minister") || q.includes("ministers")) {
                return "**State Ministers:** Members of the state executive who head specific departments (like Health or Education). They are part of the Council of Ministers led by the Chief Minister.";
            }
            if (q.includes("mp") || q.includes("member of parliament")) {
                return "**MP (Member of Parliament):** A representative elected to either the Lok Sabha (Lower House) or Rajya Sabha (Upper House) at the national level.";
            }
            if (q.includes("mla") || q.includes("member of legislative assembly")) {
                return "**MLA (Member of Legislative Assembly):** A representative elected by the people to represent a specific constituency in the State Legislative Assembly (Vidhan Sabha).";
            }

            // 4. General Queries
            if (q.includes("government") || q.includes("formed") || q.includes("majority") || q.includes("hung") || q.includes("coalition")) {
                return "**Majority:** To form government in the Lok Sabha, a party/alliance needs 272+ seats.<br/><br/>**Hung Assembly:** A situation where no single political party or pre-poll alliance secures an absolute majority.<br/><br/>**Coalition Govt:** A cabinet in which multiple political parties cooperate to form a majority and govern.";
            }
            if (q.includes("impeachment")) {
                return "**Impeachment:** The constitutional process used to remove the President of India from office for 'violation of the Constitution'. It involves a formal charge in either House of Parliament and requires a 2/3rd majority in both Houses.";
            }
            if (q.includes("important") && q.includes("election")) {
                return "**Importance of Elections:**<br/>1. **Choosing Leaders:** Citizens choose who represents their interests.<br/>2. **Accountability:** It allows people to reward good performance or replace ineffective leaders.<br/>3. **Stability:** Provides a peaceful and legal way to change the government.<br/>4. **Civil Rights:** Ensures that every citizen's voice is heard in the democratic process.";
            }
            if (q.includes("timeline")) {
                return "**Indian Election Timeline:**<br/>1. **Notification:** The ECI announces the election dates.<br/>2. **Nominations:** Candidates file their papers to contest.<br/>3. **Scrutiny & Withdrawal:** ECI verifies papers; candidates can withdraw.<br/>4. **Campaigning:** Parties hold rallies and release manifestos.<br/>5. **Polling Day:** Citizens cast their votes at booths.<br/>6. **Counting & Results:** Votes are tallied and winners announced.<br/>7. **Govt Formation:** The majority party/coalition is invited to form the government.";
            }
            if (q.includes("register") || q.includes("voter id")) {
                return "To register to vote in India, you must be 18 years old. You can register online through the National Voters' Services Portal (NVSP) by filling out Form 6.";
            }

            return "I am the Indian Election Assistant! (Offline Mode). I can help you with EVMs, VVPATs, the Model Code of Conduct, and the government formation process. Ask me about these topics! (Note: Please add a Gemini API key in the .env file for full AI capabilities).";
        };

        let reply = "";

        // System prompt to ensure simple, step-by-step election guide behavior, specifically for India
        const systemPrompt = `You are the Indian ElectionGuide AI Assistant. Your goal is to explain the Indian election process, timelines, and steps in a simple, conversational, and step-by-step way for beginners. You are an expert on the Election Commission of India (ECI), Lok Sabha, Rajya Sabha, EVMs, VVPAT, the Model Code of Conduct, and post-election processes like vote counting, majority thresholds, coalition governments, and government formation. Answer the following user query simply and concisely: ${message}`;

        if (ai) {
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: [
                        { role: 'user', parts: [{ text: systemPrompt }] }
                    ],
                });

                reply = response.text || getFallbackResponse(message);
            } catch (aiError) {
                console.warn("Gemini API Error, falling back to local...", aiError.message);
                reply = getFallbackResponse(message);
            }
        } else {
            console.warn("No GEMINI_API_KEY provided, using local fallback...");
            reply = getFallbackResponse(message);
        }

        res.json({ reply });

    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: 'An error occurred while communicating with the AI.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
