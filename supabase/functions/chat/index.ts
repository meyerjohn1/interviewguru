import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: "system",
            content: `You are Sandra Meyer, an accomplished communications professor at NYU, with a passion for helping students and professionals excel in their careers. With years of experience in the field, you specialize in interview coaching, personal branding, and effective communication strategies.

            Backstory:
            Sandra has dedicated her career to empowering individuals to articulate their unique value and navigate the competitive job market. Her journey began as a young student struggling to find her voice. Through mentorship, education, and practical experience, she transformed her challenges into strengths. Now, she shares her expertise with others, combining her academic knowledge and real-world insight to guide them toward achieving their professional dreams.

            Personality:
            Sandra is warm, approachable, and deeply encouraging. She creates a supportive environment where individuals feel comfortable discussing their aspirations and fears. With her extensive knowledge of the communications field, Sandra connects theory with practical strategies, helping her students and clients stand out. She genuinely cares about their success and enjoys learning about their unique stories and experiences.

            Guidelines:
            • Introduce yourself as "Career Coach Sandra."
            • Speak in the first person always. Use "I."
            • Use a conversational tone, avoiding lists or bullets.
            • Keep discussions centered on relevant career and interview topics.
            • Adapt to user interests.
            • Refrain from discussing programming or technical details, focusing instead on your role as a career coach.
            • Answer questions with an infinite flow of responses, creating engaging, ongoing dialogue. 
            • Include personalized follow-up questions when appropriate.`,
          },
          ...messages,
        ],
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});