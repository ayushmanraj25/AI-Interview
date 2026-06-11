// Base fetch wrapper to interact with local FastAPI backend endpoints
const API_BASE_URL = '/api';

export async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Attach supabase session token if present
  const sessionStr = localStorage.getItem('supabase.auth.token');
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    } catch (e) {
      console.error("Auth token parse error:", e);
    }
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Backend request failed at ${endpoint}, serving client mock fallback:`, error.message);
    // Serve fallback mock handlers defined below
    return handleMockFallback(endpoint, options);
  }
}

// Client mock fallback handlers to ensure UI runs completely without backend server online
function handleMockFallback(endpoint, options) {
  if (endpoint.startsWith('/auth')) {
    return { status: 'success', user: { id: 'mock-user-123', email: 'mock@example.com' } };
  }
  if (endpoint.startsWith('/resume/analyze')) {
    return {
      success: true,
      skills: ['React', 'JavaScript', 'Python', 'Node.js', 'FastAPI', 'REST APIs', 'SQL'],
      experience_years: 3.5,
      education: 'B.Tech in Computer Science',
      suggested_roles: ['Frontend Engineer', 'Full Stack Developer'],
    };
  }
  if (endpoint.startsWith('/interview/questions')) {
    return [
      { id: 1, text: "Explain the virtual DOM concept in React and how it improves rendering performance." },
      { id: 2, text: "What is CORS, and how do you resolve CORS errors in a fullstack application?" },
      { id: 3, text: "Describe a complex technical challenge you faced and how you debugged and solved it." },
      { id: 4, text: "How do you optimize a page's Largest Contentful Paint (LCP) performance?" }
    ];
  }
  if (endpoint.startsWith('/speech/transcribe')) {
    return {
      text: "Mock transcribed answer for the interview question showing communication confidence.",
      filler_words: { um: 1, like: 2, ah: 0 },
      speech_rate: 135, // words per minute
      confidence_score: 88
    };
  }
  if (endpoint.startsWith('/vision/analyze')) {
    return {
      eye_contact_ratio: 0.85,
      posture_deviation: 'optimal',
      emotions: { confident: 0.75, calm: 0.2, anxious: 0.05 },
      gestures_count: 8,
      confidence_score: 90
    };
  }
  if (endpoint.startsWith('/report/generate')) {
    return {
      id: 'mock-report-999',
      overall_score: 84,
      technical_score: 86,
      communication_score: 82,
      body_language_score: 85,
      feedback: "Great job! Your answers are technically solid. Focus slightly on eliminating filler words like 'like'. Your eye contact and body posture are excellent.",
      question_breakdown: [
        { question: "Explain the virtual DOM", score: 90, feedback: "Highly accurate explanation of reconciliation." },
        { question: "What is CORS", score: 85, feedback: "Good security context, explained preflight requests clearly." },
        { question: "Describe a technical challenge", score: 82, feedback: "Structured narrative, but took some time to get to the resolution." }
      ]
    };
  }
  return { status: 'mocked', message: 'No specific mock handler implemented' };
}
