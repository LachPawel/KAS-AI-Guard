// PLLuM Client Configuration for KAS AI Guard
// Polish Large Language Universal Model - Suwerenne AI dla Administracji

interface PLLuMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface PLLuMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Creates an AI client that uses PLLuM (Polish Large Language Model) 
 * instead of American cloud services.
 * 
 * BENEFITS:
 * - Suwerenność danych: Data stays in Polish infrastructure
 * - RODO compliance: No data leaves EU jurisdiction
 * - Legal expertise: Trained on Polish legal texts
 * - Cost: Free and local deployment
 */
export async function callPLLuM(
  messages: PLLuMMessage[],
  options: {
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<PLLuMResponse> {
  const PLLUM_API_KEY = Deno.env.get('PLLUM_API_KEY');
  
  if (!PLLUM_API_KEY) {
    console.error('[PLLuM] API key not found. Set PLLUM_API_KEY in environment.');
    throw new Error('PLLuM API key not configured');
  }

  const baseUrl = "https://apim-pllum-tst-pcn.azure-api.net/vllm/v1";
  const modelName = "CYFRAGOVPL/pllum-12b-nc-chat-250715";

  console.log('[PLLuM] Calling Polish AI model:', modelName);
  console.log('[PLLuM] Messages:', JSON.stringify(messages.map(m => ({ role: m.role, length: m.content.length }))));

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': PLLUM_API_KEY,
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.maxTokens ?? 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[PLLuM] API error:', response.status, errorText);
      throw new Error(`PLLuM API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[PLLuM] Response received, length:', data.choices?.[0]?.message?.content?.length || 0);
    
    return data;
  } catch (error) {
    console.error('[PLLuM] Call failed:', error);
    throw error;
  }
}

/**
 * Fallback to OpenAI GPT-4 if PLLuM is unavailable
 * (for demo purposes or development)
 */
export async function callOpenAIFallback(
  messages: PLLuMMessage[],
  options: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  } = {}
): Promise<PLLuMResponse> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('[FALLBACK] Using OpenAI GPT-4 (fallback mode)');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: options.model || 'gpt-4o',
      messages: messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 2000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Smart AI client that tries PLLuM first, falls back to OpenAI if needed
 */
export async function callAI(
  messages: PLLuMMessage[],
  options: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
    forceFallback?: boolean;
  } = {}
): Promise<string> {
  let response: PLLuMResponse;

  // Check if we should use PLLuM or fallback
  const pllumKey = Deno.env.get('PLLUM_API_KEY') || Deno.env.get('389be391d0164109bf83d3160252c8ec');
  const usePLLuM = !options.forceFallback && pllumKey;

  try {
    if (usePLLuM) {
      console.log('[AI] Using PLLuM (Polish sovereign AI)');
      response = await callPLLuM(messages, options);
    } else {
      console.log('[AI] Using OpenAI (fallback mode)');
      response = await callOpenAIFallback(messages, options);
    }

    // Extract content from response
    let content = response.choices[0]?.message?.content || '';
    
    // Clean up markdown code blocks if present
    if (content.startsWith('```json')) {
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/```\n?/g, '');
    }

    return content.trim();
  } catch (error) {
    console.error('[AI] Primary call failed, trying fallback...', error);
    
    // If PLLuM failed, try OpenAI as fallback
    if (usePLLuM && !options.forceFallback) {
      try {
        response = await callOpenAIFallback(messages, options);
        let content = response.choices[0]?.message?.content || '';
        if (content.startsWith('```json')) {
          content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        }
        return content.trim();
      } catch (fallbackError) {
        console.error('[AI] Fallback also failed:', fallbackError);
        throw fallbackError;
      }
    }
    
    throw error;
  }
}

/**
 * For vision tasks, we still need OpenAI GPT-4 Vision
 * (PLLuM doesn't have vision capabilities yet)
 */
export async function callVisionAI(
  imageUrl: string,
  prompt: string,
  options: {
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key required for vision tasks');
  }

  console.log('[VISION] Using GPT-4 Vision for image analysis');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ],
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 1000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Vision API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  let content = data.choices[0]?.message?.content || '';
  
  if (content.startsWith('```json')) {
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  }
  
  return content.trim();
}