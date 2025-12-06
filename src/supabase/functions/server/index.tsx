import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { orchestrateAgents } from "./agents.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-efef8e69/health", (c) => {
  return c.json({ status: "ok" });
});

// Run multi-agent analysis (Proactive Mode)
app.post("/make-server-efef8e69/analyze/proactive", async (c) => {
  try {
    const { query } = await c.req.json();
    
    const exaApiKey = Deno.env.get('EXA_API_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!exaApiKey || !openaiApiKey) {
      return c.json({ 
        error: 'Missing API keys. Please configure EXA_API_KEY and OPENAI_API_KEY' 
      }, 500);
    }

    console.log('[SERVER] Starting proactive analysis with query:', query);

    const results = await orchestrateAgents(
      'proactive',
      { query },
      { exaApiKey, openaiApiKey }
    );

    // Store results in KV
    const timestamp = new Date().toISOString();
    await kv.set(`analysis:proactive:${timestamp}`, results);

    return c.json({ 
      success: true, 
      results,
      timestamp 
    });
  } catch (error) {
    console.error('[SERVER] Proactive analysis error:', error);
    return c.json({ 
      error: error.message || 'Analysis failed' 
    }, 500);
  }
});

// Run multi-agent analysis (Reaction Mode)
app.post("/make-server-efef8e69/analyze/reaction", async (c) => {
  try {
    const { url, screenshot, description } = await c.req.json();
    
    const exaApiKey = Deno.env.get('EXA_API_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!exaApiKey || !openaiApiKey) {
      return c.json({ 
        error: 'Missing API keys. Please configure EXA_API_KEY and OPENAI_API_KEY' 
      }, 500);
    }

    console.log('[SERVER] Starting reaction analysis for URL:', url);

    const results = await orchestrateAgents(
      'reaction',
      { url, screenshot },
      { exaApiKey, openaiApiKey }
    );

    // Store results in KV
    const timestamp = new Date().toISOString();
    await kv.set(`analysis:reaction:${url}:${timestamp}`, {
      ...results,
      description,
    });

    return c.json({ 
      success: true, 
      results,
      timestamp 
    });
  } catch (error) {
    console.error('[SERVER] Reaction analysis error:', error);
    return c.json({ 
      error: error.message || 'Analysis failed' 
    }, 500);
  }
});

// Get analysis history
app.get("/make-server-efef8e69/history", async (c) => {
  try {
    const proactiveResults = await kv.getByPrefix('analysis:proactive:');
    const reactionResults = await kv.getByPrefix('analysis:reaction:');
    
    return c.json({
      proactive: proactiveResults,
      reaction: reactionResults,
    });
  } catch (error) {
    console.error('[SERVER] History retrieval error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get legal operators list
app.get("/make-server-efef8e69/legal-operators", async (c) => {
  try {
    const operators = await kv.get('legal:operators');
    
    if (!operators) {
      // Initialize with default data
      const defaultOperators = [
        { name: 'TOTALbet', domain: 'totalbet.pl', type: 'bukmacher', license: 'PL' },
        { name: 'Fortuna', domain: 'efortuna.pl', type: 'bukmacher', license: 'PL' },
        { name: 'STS', domain: 'sts.pl', type: 'bukmacher', license: 'PL' },
        { name: 'Betclic', domain: 'betclic.pl', type: 'bukmacher', license: 'PL' },
        { name: 'Superbet', domain: 'superbet.pl', type: 'bukmacher', license: 'PL' },
      ];
      await kv.set('legal:operators', defaultOperators);
      return c.json(defaultOperators);
    }
    
    return c.json(operators);
  } catch (error) {
    console.error('[SERVER] Legal operators retrieval error:', error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);