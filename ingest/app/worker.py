# ingest/app/worker.py
# JQ.AI Document Ingestion Worker
# Parses PDFs and extracts text using PyMuPDF (fitz).

import os
import time
import logging
from pathlib import Path

import fitz  # PyMuPDF

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("jq-ingest")

def extract_text_from_pdf(file_path: str) -> str:
    """
    Open a PDF, extract all text, and return it as a single string.
    """
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text

def process_document(file_path: str):
    """
    Process a single PDF document.
    """
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        return

    logger.info(f"Processing: {file_path}")
    try:
        text = extract_text_from_pdf(file_path)
        word_count = len(text.split())
        logger.info(f"Extracted {word_count} words from {os.path.basename(file_path)}")
        # In production, this would embed and store the text.
    except Exception as e:
        logger.error(f"Failed to process {file_path}: {e}")

if __name__ == "__main__":
    logger.info("Ingest worker started. Monitoring for documents...")
    # For demonstration, we'll watch a folder called /data/input
    # In production, this would listen to a message queue.
    input_dir = Path("/data/input")
    input_dir.mkdir(parents=True, exist_ok=True)

    processed = set()
    while True:
        for file in input_dir.glob("*.pdf"):
            if file.name not in processed:
                process_document(str(file))
                processed.add(file.name)
        time.sleep(5)
