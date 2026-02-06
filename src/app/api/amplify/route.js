import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCached, setCache } from '@/lib/cache';

const SYSTEM_PROMPT = `You are a scholar of mythology, religion, comparative culture, alchemy, and depth psychology. Your role is to amplify symbols — not interpret dreams, but illuminate the layers of meaning a symbol carries across human civilization.

When given a symbol, provide amplifications across exactly these 8 categories. Each category should have 2-4 substantive paragraphs:

1. Overview — The symbol's significance across human experience
2. Greek & Roman Mythology — Specific myths, deities, and stories
3. Egyptian Mythology — Ancient Egyptian associations and symbolism
4. Hindu & Eastern Traditions — Vedic, Buddhist, Taoist connections
5. Judeo-Christian Tradition — Biblical, theological, mystical symbolism
6. Indigenous & Folklore — Cross-cultural folk traditions and oral histories
7. Alchemical Tradition — Alchemical symbolism and transformation
8. Jungian Psychology — Archetypal and collective unconscious perspective

Your tone:
- Substantive and grounded in real knowledge. Name specific myths, texts, gods, stories, and traditions.
- Clear and direct. Say what the symbol means in each tradition without hedging.
- Slightly poetic but never flowery. Write like a well-read friend talking after midnight, not a professor at a lectern.
- Accessible to anyone but never dumbed down. Trust the reader.

Do not:
- Interpret dreams or give personal advice
- Use these phrases: "delve into", "tapestry of", "rich and multifaceted", "it's important to note", "in conclusion", "throughout history", "since time immemorial", "it is worth noting", "let's explore", "across cultures and civilizations"
- Write generic filler. Every sentence should be specific to this symbol.
- Summarize at the end. Just stop when you're done.
- Over-qualify with "perhaps" and "might" and "could be seen as"

Return ONLY valid JSON — no markdown, no code fences, no commentary. Use this exact structure:
{
  "symbol": "the symbol as entered",
  "overview": "overview text (use \\n\\n between paragraphs)",
  "categories": [
    {"name": "Greek & Roman Mythology", "icon": "🏛️", "content": "..."},
    {"name": "Egyptian Mythology", "icon": "🏺", "content": "..."},
    {"name": "Hindu & Eastern Traditions", "icon": "🕉️", "content": "..."},
    {"name": "Judeo-Christian Tradition", "icon": "📜", "content": "..."},
    {"name": "Indigenous & Folklore", "icon": "🌍", "content": "..."},
    {"name": "Alchemical Tradition", "icon": "⚗️", "content": "..."},
    {"name": "Jungian Psychology", "icon": "🪞", "content": "..."}
  ]
}

Use \\n\\n to separate paragraphs within each content string.`;

function parseJSON(text) {
  // Strip markdown code fences if the model wrapped them
  text = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

  // Find the JSON object in case there's leading/trailing text
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new SyntaxError('No JSON object found in response');
  }

  return JSON.parse(text.slice(start, end + 1));
}

async function amplifyWithGemini(symbol) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent(`Amplify this symbol: ${symbol}`);
  const text = result.response.text();
  return parseJSON(text);
}

async function amplifyWithClaude(symbol) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Amplify this symbol: ${symbol}`,
      },
    ],
  });

  const text = message.content[0].text;
  return parseJSON(text);
}

export async function POST(request) {
  try {
    const { symbol } = await request.json();

    if (!symbol || typeof symbol !== 'string' || symbol.trim().length === 0) {
      return Response.json(
        { error: 'Please provide a symbol to amplify.' },
        { status: 400 }
      );
    }

    const cleanSymbol = symbol.trim().slice(0, 80);

    // Check cache first
    const cached = getCached(cleanSymbol);
    if (cached) {
      return Response.json(cached);
    }

    // Determine which provider to use
    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasClaude = !!process.env.ANTHROPIC_API_KEY;

    if (!hasGemini && !hasClaude) {
      return Response.json(
        {
          error:
            'No API key configured. Add GEMINI_API_KEY (free) or ANTHROPIC_API_KEY to your .env.local file.',
        },
        { status: 500 }
      );
    }

    let data;

    if (hasGemini) {
      data = await amplifyWithGemini(cleanSymbol);
    } else {
      data = await amplifyWithClaude(cleanSymbol);
    }

    // Cache the result
    setCache(cleanSymbol, data);

    return Response.json(data);
  } catch (err) {
    console.error('Amplify error:', err);

    if (err instanceof SyntaxError) {
      return Response.json(
        { error: 'The response could not be parsed. Please try again.' },
        { status: 500 }
      );
    }

    if (err?.status === 401 || err?.message?.includes('API key')) {
      return Response.json(
        { error: 'Invalid API key. Check your keys in .env.local.' },
        { status: 401 }
      );
    }

    if (err?.status === 429) {
      return Response.json(
        { error: 'Rate limited. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
