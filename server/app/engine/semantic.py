from sentence_transformers import SentenceTransformer, util

# Step 1: Load a pre-trained sentence transformer model
model = SentenceTransformer('all-mpnet-base-v2')  # lightweight, fast, good for semantic tasks

# Step 2: Inputs
word_list = "apple, banking, dinosaur"
text_blob = """
    The financial institution offered new savings accounts.
    John picked a red fruit from the tree and took a bite.
    In the museum, there was a huge fossil of a T-Rex.
"""

# Step 3: Preprocess
words = [w.strip() for w in word_list.split(",")]

# Step 4: Create embeddings
word_embeddings = model.encode(words, convert_to_tensor=True)
text_embedding = model.encode(text_blob, convert_to_tensor=True)

# Step 5: Compute similarity scores
similarities = util.cos_sim(word_embeddings, text_embedding)

# Step 6: Threshold & output
threshold = 0.1  # adjust as needed

print("Words with semantic similarity to the text:")
for i, word in enumerate(words):
    if similarities[i] > threshold:
        print(f" - {word} (similarity: {similarities[i].item():.2f})")