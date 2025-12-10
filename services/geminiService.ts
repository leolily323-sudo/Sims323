import { GoogleGenAI } from "@google/genai";
import { CosmicResponse } from "../types";

const FALLBACK_FACTS: CosmicResponse[] = [
  { 
    phrase: "PROJECT BLUE BEAM", 
    explanation: "A rumored theory claiming governments will use holograms to stage a fake alien invasion to establish a totalitarion world order.",
    theme: 'conspiracy',
    sourceUrl: "https://en.wikipedia.org/wiki/Serge_Monast"
  },
  { 
    phrase: "AKASHIC RECORDS", 
    explanation: "A compendium of all universal events, thoughts, words, emotions, and intent ever to have occurred, believed to be encoded in a non-physical plane of existence.",
    theme: 'mysticism',
    sourceUrl: "https://en.wikipedia.org/wiki/Akashic_records"
  },
  { 
    phrase: "THE HUM", 
    explanation: "A low-frequency noise heard by people worldwide, with no traceable source, believed by some to be communication from the hollow earth.",
    theme: 'paranormal',
    sourceUrl: "https://en.wikipedia.org/wiki/The_Hum"
  },
  { 
    phrase: "SHADOW PEOPLE", 
    explanation: "Dark, humanoid silhouettes seen in peripheral vision. They are often reported during sleep paralysis and are believed by some to be interdimensional entities feeding on fear.",
    theme: 'paranormal',
    sourceUrl: "https://en.wikipedia.org/wiki/Shadow_person"
  },
  { 
    phrase: "EGREGORE", 
    explanation: "An autonomous psychic entity created by a collective group mind. Your thoughts, when shared by enough people, take on a life of their own.",
    theme: 'occult',
    sourceUrl: "https://en.wikipedia.org/wiki/Egregore"
  },
  {
    phrase: "NUMBER STATIONS",
    explanation: "Shortwave radio stations broadcasting generated voices reading streams of numbers. Spies? Ghosts? Or something else entirely?",
    theme: 'conspiracy',
    sourceUrl: "https://en.wikipedia.org/wiki/Numbers_station"
  }
];

export const generateCosmicInsight = async (): Promise<CosmicResponse> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("No API Key found, using fallback.");
      return getRandomFallback();
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Generate a single JSON object containing a cryptic word or short phrase (max 3 words) related to:
      1. Obscure conspiracy theories (e.g., MKUltra, Hollow Earth).
      2. The Occult and Esoteric knowledge (e.g., Alchemy, Demonology).
      3. Paranormal phenomena (e.g., Doppelgangers, Shadow People).
      4. Mysticism and Ancient secrets.

      The "phrase" should be out of context and mysterious.
      The "explanation" should be a chilling or mind-bending revelation of what that phrase implies (max 30 words).
      The "theme" should be one of: 'occult', 'conspiracy', 'paranormal', 'mysticism'.
      The "sourceUrl" should be a valid, specific URL (Wikipedia, Britannica, or reputable paranormal archive) to learn more about this topic.

      Example Output:
      {
        "phrase": "ROKO'S BASILISK",
        "explanation": "A thought experiment stating that an all-powerful AI in the future may retroactively punish those who did not help bring it into existence.",
        "theme": "conspiracy",
        "sourceUrl": "https://en.wikipedia.org/wiki/Roko%27s_basilisk"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a dark oracle. You deal in secrets, forbidden knowledge, and the unsettling truth.",
        temperature: 1.3,
      }
    });

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Empty response from Oracle");
    }

    const jsonResponse = JSON.parse(text) as CosmicResponse;
    return jsonResponse;

  } catch (error) {
    console.error("Oracle error:", error);
    return getRandomFallback();
  }
};

const getRandomFallback = (): CosmicResponse => {
  return FALLBACK_FACTS[Math.floor(Math.random() * FALLBACK_FACTS.length)];
};
