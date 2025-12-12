/**
 * SIMULATOR: Psicosocial AI Logic
 * 
 * This script simulates the logic inside PsicosocialService to test:
 * 1. JSON Parsing robustness (AI might return Markdown blocks).
 * 2. Error handling when API fails.
 * 3. Data mapping.
 */

// Mock of the interface used in Service
interface AIAnalysis {
    summary: string;
    sentiment: string;
    risk: boolean;
    referral: boolean;
}

// 1. EXTRACTED LOGIC: The parser function from PsicosocialService
function parseAIResponse(text: string): AIAnalysis {
    console.log(`\n[PARSER] Input text: ${text}`);
    try {
        // Clean markdown code blocks (Common Gemini behavior)
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error('[PARSER ERROR] Failed to parse JSON:', e.message);
        throw e;
    }
}

// 2. SCENARIOS
const scenarios = [
    {
        name: "Perfect JSON",
        input: `{"summary": "Patient is fine.", "sentiment": "Positive", "risk": false, "referral": false}`
    },
    {
        name: "Markdown Wrapped JSON (Common AI Output)",
        input: "```json\n{\n  \"summary\": \"Patient shows signs of anxiety.\",\n  \"sentiment\": \"Negative\",\n  \"risk\": false,\n  \"referral\": true\n}\n```"
    },
    {
        name: "Broken JSON (Simulation of Hallucination)",
        input: `{"summary": "Cut off text...`
    }
];

// 3. RUN SIMULATION
async function runSimulation() {
    console.log("=== STARTING AI LOGIC SIMULATION ===");

    for (const scenario of scenarios) {
        console.log(`\n--- Scenario: ${scenario.name} ---`);
        try {
            const result = parseAIResponse(scenario.input);
            console.log("✅ SUCCESS:", result);

            // Validate fields
            if (!result.summary || typeof result.risk !== 'boolean') {
                console.warn("⚠️ WARNING: Result missing required fields!");
            }

        } catch (error) {
            console.log("❌ HANDLED ERROR: Parsing failed safely.");
            // In real service, we catch this and return a default object.
            const fallback = {
                summary: 'Error al analizar la respuesta de IA.',
                sentiment: 'Neutro',
                risk: false,
                referral: false
            };
            console.log("   -> Service would save fallback:", fallback);
        }
    }
}

runSimulation();
