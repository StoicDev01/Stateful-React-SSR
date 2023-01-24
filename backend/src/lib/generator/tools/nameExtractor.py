# EXTRACT NAMES FROM TEXT, MAINLY BOOKS

from transformers import AutoTokenizer, AutoModelForTokenClassification
from transformers import pipeline
import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup
import argparse

# SETUP PARSER
parser = argparse.ArgumentParser()
parser.add_argument("file", help="file to extract names")
parser.add_argument("output", help="file extracted output")
args = parser.parse_args()

# LOAD BERT MODEL FOR (NER)
tokenizer = AutoTokenizer.from_pretrained("Davlan/bert-base-multilingual-cased-ner-hrl")
model = AutoModelForTokenClassification.from_pretrained("Davlan/bert-base-multilingual-cased-ner-hrl")
nlp = pipeline("ner", model=model, tokenizer=tokenizer,  grouped_entities=True)

# TODO: CREATE A GENDER CLASSIFICATOR


def extract_book_pages(path):
    book = epub.read_epub(path)
    items = list(book.get_items_of_type(ebooklib.ITEM_DOCUMENT))
    chapters_str = []

    for item in items:
        soup = BeautifulSoup(item.get_body_content(), 'lxml')
        chapters_str.append(soup.text.strip())
    return chapters_str

def extract_names(data):
    ner_results = nlp(data)

    names = []

    for ner_result in ner_results:
        if (ner_result["entity_group"] == "PER"):
            if (ner_result["word"] in names):
                continue
            
            print("EXTRACTED: ", ner_result["word"])
            names.append(ner_result["word"])
    return names

def main():
    if (".epub" in args.file or ".pdf" in args.file):
        print("- EXTRACTING NAMES FROM EBOOK")
        pages = extract_book_pages(args.file)
        names = []
        print(f"- EBOOK TOTAL CHAPTERS : {len(pages)}")

        for page in pages:
            names.extend(
                extract_names(page)
            )

        print("- CLEANING EXTRACTED DATA")
        names = list(set(names))
        names.sort()
        names = "\n".join(names)

        print(f"- SAVING EXTRACTED DATA")
        with open(f"{args.output}", "w") as f:
            f.write(names)
            
        print("- DONE.")

if __name__ == "__main__":
    main()