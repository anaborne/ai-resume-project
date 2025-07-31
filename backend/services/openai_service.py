from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_optimized_resume(job_description: str, processed_resume: str) -> str:
    completion = client.chat.completions.create(
        model="gpt-4.1",
        messages=[
            {"role": "system", "content": "You are a professional resume optimization assistant."},
            {"role": "user", "content": f"""You will receive a resume as a structured list of paragraphs, where each paragraph contains formatting metadata and segmented runs of text.

            Your goal is to optimize the **content** to match a job description while **preserving the original structure and formatting metadata**. This resume will be reconstructed into a `.docx` file after your response.
            
            Constraints:
            - Do NOT invent new degrees, job titles, dates, technologies, or experience not present in the original input.
            - Do NOT add or remove paragraphs or runs.
            - You MAY reword the 'TEXT' field of any run to make it clearer, more concise, action-driven, and more relevant to the job description.
            - DO NOT modify formatting attributes like 'BOLD', 'ITALIC', 'FONT_SIZE', 'FONT_NAME', etc.
            - You MUST return the output in the same structured format with updated 'TEXT' values only.
            
            The job description is:
            {job_description}
            
            Optimize the following resume:
            {processed_resume}
            """},
        ]
    )
    return completion.choices[0].message.content