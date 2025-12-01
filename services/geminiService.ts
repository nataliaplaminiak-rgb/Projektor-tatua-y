
import { GoogleGenAI } from "@google/genai";
import { GenerationRequest } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to strip the "data:image/png;base64," prefix for the API
const getBase64FromUrl = (url: string): string => {
  return url.replace(/^data:image\/(png|jpeg|webp);base64,/, "");
};

const generateImagePart = async (prompt: string, referenceImageBase64?: string): Promise<string> => {
  const parts: any[] = [{ text: prompt }];

  // If a reference image is provided (for the mockup step), add it to the request
  if (referenceImageBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/png",
        data: referenceImageBase64
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: parts,
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1", // Keep 1:1 for consistency
      }
    }
  });

  const candidates = response.candidates;
  if (candidates && candidates.length > 0 && candidates[0].content && candidates[0].content.parts) {
    for (const part of candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${base64Data}`;
      }
    }
  }
  throw new Error("Nie znaleziono danych obrazu w odpowiedzi.");
};

export const generateDesignOnly = async (request: GenerationRequest): Promise<string> => {
  const { subject, style, colorScheme, size, additionalDetails } = request;

  // --- LOGIC TO SEPARATE VISUALS FROM TEXT ---
  // 1. Extract text inside quotes (e.g. "burger")
  const textMatches = subject.match(/"([^"]+)"/g);
  const textToInscribe = textMatches ? textMatches.join(' ') : "NO TEXT";

  // 2. Remove the quoted text from the subject to get the Pure Visual Description
  // e.g. 'snowflake "burger"' becomes 'snowflake'
  let visualSubject = subject.replace(/"([^"]+)"/g, "").replace(/\s+/g, " ").trim();

  // If the user ONLY provided text (e.g. "Mom"), visualSubject is empty.
  // We need to give the AI something to draw around the text.
  if (!visualSubject && textToInscribe !== "NO TEXT") {
    visualSubject = "Calligraphic styling, artistic lettering composition";
  }

  // STEP ONE: Generate ONLY the 2D Design
  const designPrompt = `
    Design a professional high-quality tattoo flash/stencil.

    --- STRICT CONTENT SEPARATION RULES ---
    
    1. VISUAL SUBJECT (DRAW THIS):
    "${visualSubject}"
    - INSTRUCTION: Draw the visual elements described above. 
    - NEGATIVE PROMPT: Do NOT draw the physical objects mentioned in the "TEXT TO INSCRIBE" section below.
    - EXAMPLE: If Visual is "Snowflake" and Text is "Burger", draw a Snowflake. Do NOT draw a hamburger.

    2. TEXT TO INSCRIBE (WRITE THIS EXACTLY):
    ${textToInscribe}
    - INSTRUCTION: If this section contains text in quotes, incorporate these words as LITERAL TEXT into the design.
    - Do NOT visualize the meaning of these words.
    - If it says "Lion", write the word "Lion". Do not draw a lion unless it is also in the Visual Subject.
    - If "NO TEXT", do not generate any letters or numbers.

    --- AESTHETICS ---
    Style: ${style}
    Color Palette: ${colorScheme}
    Target Physical Size: ${size}
    ${additionalDetails ? `Additional Details: ${additionalDetails}` : ''}

    VISUAL INSTRUCTIONS:
    - Pure white background.
    - Flat 2D illustration.
    - Clean lines, no skin texture, no body parts.
    - High contrast, ready for printing.
    - COMPOSITION: The design elements must be balanced to fit within a physical area of ${size}.
  `;

  try {
    return await generateImagePart(designPrompt);
  } catch (error) {
    console.error("Error generating tattoo design:", error);
    throw error;
  }
};

export const generateMockup = async (
  designUrl: string,
  style: string, 
  placement: string, 
  placementDetail: string,
  size: string
): Promise<string> => {
  
  const designBase64 = getBase64FromUrl(designUrl);

  const isBehindEar = placement.includes("Za uchem") || placement.includes("Behind");

  const mockupPrompt = `
    The attached image is a TATTOO DESIGN (Stencil). 
    Apply THIS EXACT DESIGN onto a photorealistic human body part.
    
    Body Part: ${placement}
    Specific Placement: ${placementDetail || 'Natural placement'}
    PHYSICAL SIZE CONSTRAINT: ${size}
    Style context: ${style}
    
    CRITICAL INSTRUCTIONS:
    - Use the ATTACHED IMAGE as the source pattern. Do not change the design.
    - The tattoo MUST appear to be physically ${size} in real life scale relative to the body part.
    - Render a close-up photo of the ${placement}.
    - The tattoo must warp correctly around the muscles/bones.
    - Realistic skin texture, lighting, and pores.

    ${isBehindEar ? `
    IMPORTANT PLACEMENT RULE FOR "BEHIND EAR":
    - The tattoo MUST be placed on the SKIN of the NECK or MASTOID BONE (the hard bone behind the ear).
    - DO NOT place the tattoo ON the ear cartilage/pinna itself.
    - The ear itself should be clean.
    ` : ''}
  `;

  return await generateImagePart(mockupPrompt, designBase64);
};

// Re-export for compatibility if needed, though we use generateMockup now
export const regenerateMockup = generateMockup;
