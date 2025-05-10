from graph_db.vectorizer import process_and_store_documents
from dotenv import load_dotenv
load_dotenv()

# pickle_file_path = "/Users/khushiyantchauhan/Developer/greenvisor/backend/data/badenova/graph_documents.pkl"
# if os.path.exists(pickle_file_path):
#     with open(pickle_file_path, 'rb') as pickle_file:
#         graph_documents = pickle.load(pickle_file)
#         print(graph_documents[0])
process_and_store_documents(
    "/Users/khushiyantchauhan/Developer/greenvisor/backend/data/test"
)

