import os
import google.generativeai as genai

GEMINI_API_KEY = "AIzaSyBXgkoIoxI7oE24Wr5V-SJ0ZG_lxg1hpLs"  # Replace with your actual key
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel('gemini-2.0-flash')
try:
    response = model.generate_content("Explain how AI works in a few words.")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")