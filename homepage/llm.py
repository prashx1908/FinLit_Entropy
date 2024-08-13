from transformers import pipeline

# Initialize the text-generation pipeline
llm = pipeline('text-generation', model='gpt2', tokenizer='gpt2')


def generate_personalized_feedback(score, user_data):
    prompt = f"User's financial literacy quiz score is {score} out of 10. Based on their score, provide detailed and personalized feedback. User data: {user_data}."

    results = llm(prompt, max_length=500, truncation=True)
    return results[0]['generated_text']
