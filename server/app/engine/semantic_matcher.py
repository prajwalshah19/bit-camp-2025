from sentence_transformers import SentenceTransformer, util
import nltk
nltk.download('punkt_tab')
from nltk.tokenize import sent_tokenize


class SemanticMatcher:
    # Load the model
    def __init__(self, topics_file, input_file):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.scored_sentences: dict[str, list[tuple]] = {}

        with open(topics_file, 'r') as f:
            self.word_list = f.read()
        with open(input_file, 'r') as f:
            self.text_blob = f.read()
    
    def score(self):

        overall = 0
        # Preprocess
        words = [w.strip() for w in self.word_list.split(",")]
        sentences = sent_tokenize(self.text_blob)
        # Encode all words and sentences
        word_embeddings = self.model.encode(words, convert_to_tensor=True)
        sentence_embeddings = self.model.encode(sentences, convert_to_tensor=True)

        similarity_matrix = util.cos_sim(word_embeddings, sentence_embeddings)

        for i, word in enumerate(words):
            sentence_scores = [(sentences[j], similarity_matrix[i][j].item()) for j in range(len(sentences))]
            for sentence, score in sentence_scores:
                overall += score
                try:
                    self.scored_sentences[word].append((score, sentence))
                except KeyError as e:
                    self.scored_sentences[word] = []
                    self.scored_sentences[word].append((score, sentence))
            # print(word, self.scored_sentences[word])
            self.scored_sentences[word].sort(key=lambda x: x[0], reverse=True)
        return overall
    
    # def get_similarities(self):

    

sm = SemanticMatcher("topics.txt", "example.txt")
sm.score()