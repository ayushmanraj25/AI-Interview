# Prompts configuration for Gemini API calls

SKILL_EXTRACTION_PROMPT = """
You are an expert technical recruiter and resume analyzer.
Analyze the following resume text and return a JSON object with:
1. "skills": a list of extracted technical skills/technologies.
2. "experience_years": estimate of total years of experience as a float.
3. "education": highest degree detected.
4. "suggested_roles": list of matching job roles.

Resume text:
{resume_text}
"""

QUESTION_GENERATION_PROMPT = """
You are an AI Interviewer. Based on the candidate's resume skills and target role, generate {num_questions} relevant, challenging technical and situational interview questions.
Return a JSON list of questions, where each question has:
- "id": integer starting from 1.
- "text": string of the question.

Target Role: {job_title}
Resume Skills: {skills}
"""

ANSWER_EVALUATION_PROMPT = """
Evaluate the candidate's response to the given question.
Question: {question}
Response: {response}

Analyze for:
1. Technical correctness and accuracy.
2. Completeness (did they answer all aspects?).
3. Relevance and depth.

Return a JSON object with:
- "score": integer from 0 to 100.
- "feedback": constructive assessment.
- "suggestions": tips for improvement.
"""

REPORT_GENERATION_PROMPT = """
Analyze the set of candidate answers and generate a final structured review.
Answers:
{answers_json}

Return a JSON object with:
- "overall_score": average score from 0 to 100.
- "technical_score": technical assessment average from 0 to 100.
- "communication_score": speed/clarity rating from 0 to 100.
- "body_language_score": posture/eye-contact score from 0 to 100.
- "feedback": detailed final AI Coach summary.
"""
