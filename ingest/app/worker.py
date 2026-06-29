# ingest/app/worker.py
# JQ.AI Document Ingestion Worker

import time

def process_document(file_path: str):
    print(f"Processing document: {file_path}")
    time.sleep(2)
    print("Document processed successfully.")

if __name__ == "__main__":
    print("Ingest worker started...")
    # In production, this would listen to a queue
    while True:
        time.sleep(10)
        print("Waiting for documents...")
