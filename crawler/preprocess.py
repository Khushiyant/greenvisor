import re
import os
from bs4 import BeautifulSoup
import nltk

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

def preprocess_html_content(html_content, language='english'):
    """
    Preprocesses HTML content to extract and clean main text.
    Prioritizes known structures for gesetze-im-internet.de, then uses general selectors.
    """
    if not html_content:
        return "", []

    soup = BeautifulSoup(html_content, 'html.parser')

    # Remove common non-content tags
    for element_type in ["script", "style", "nav", "footer", "header", "aside", "form", "button", "input", "img", "figure", "figcaption", "iframe", "video", "audio", "noscript", "link", "meta"]:
        for element in soup.find_all(element_type):
            element.decompose()
    
    text_content_parts = []
    processed_by_specific_handler = False

    # Handler 1: gesetze-im-internet.de "Einzelnorm" (Specific Law Page)
    jnheader = soup.find('div', class_='jnheader')
    jnhtml_container = soup.find('div', class_='jnhtml') 
    if jnheader and jnhtml_container:
        title_h1 = jnheader.find('h1')
        if title_h1:
            for entity in title_h1.find_all(string=lambda t: isinstance(t, str) and ('&sect;' in t or '§' in t)):
                entity.replace_with(entity.replace('&sect;', '§'))
            title_text = title_h1.get_text(separator=' ', strip=True)
            text_content_parts.append(title_text)
        else: 
            text_content_parts.append(jnheader.get_text(separator=' ', strip=True))

        law_paragraphs = jnhtml_container.find_all('div', class_='jurAbsatz')
        for para in law_paragraphs:
            text_content_parts.append(para.get_text(separator=' ', strip=True))
        
        if text_content_parts: 
            processed_by_specific_handler = True
            print(f"Info: Extracted content using 'gesetze-im-internet.de Einzelnorm' specific selectors for {soup.title.string if soup.title else 'current page'}.")


    # Handler 2: gesetze-im-internet.de "Aktualitätsdienst" (List of Laws)
    if not processed_by_specific_handler:
        content_div_list = soup.find('div', id='paddingLR12') 
        if content_div_list:
            paragraphs = content_div_list.find_all('p')
            for p_tag in paragraphs:
                entry_text = p_tag.get_text(separator=' ', strip=True)
                if entry_text: 
                    text_content_parts.append(entry_text)
            if text_content_parts: 
                processed_by_specific_handler = True
                print(f"Info: Extracted content using 'gesetze-im-internet.de Aktualitätsdienst' specific selectors for {soup.title.string if soup.title else 'current page'}.")
    
    # Generic Handler (if no specific handler matched)
    if not processed_by_specific_handler:
        main_content_selectors = ['main', 'article', 'div[role="main"]', 'div.content', 'div#content', 'div.main-content', 'div#main-content', 'div.post-content', 'div.entry-content', 'div.story-content', 'section.content']
        for selector in main_content_selectors:
            main_element = soup.select_one(selector)
            if main_element:
                generic_text = main_element.get_text(separator=' ', strip=True)
                if generic_text:
                    text_content_parts.append(generic_text)
                    print(f"Info: Extracted content using generic selector: '{selector}' for {soup.title.string if soup.title else 'current page'}.")
                    processed_by_specific_handler = True 
                    break 
    
    if text_content_parts:
        text_content = " ".join(text_content_parts) 
    elif soup.body: 
        text_content = soup.body.get_text(separator=' ', strip=True)
        print(f"Info: No specific or generic main content selectors matched. Extracting from <body> for {soup.title.string if soup.title else 'current page'}.")
    else: 
        text_content = soup.get_text(separator=' ', strip=True)
        print(f"Info: No <body> tag found. Extracting from entire document for {soup.title.string if soup.title else 'current page'}.")

    return clean_and_tokenize_text(text_content, language)

def preprocess_plain_text(plain_text_content, language='english'):
    """Preprocesses plain text content."""
    if not plain_text_content:
        return "", []
    return clean_and_tokenize_text(plain_text_content, language)

def clean_and_tokenize_text(text, language='english'):
    """Shared function for cleaning text and removing stopwords."""
    text = re.sub(r'\s+', ' ', text).strip() 
    text = text.lower() 
    text = re.sub(r'[^\w\s\.,!?\-]', '', text) 
    
    cleaned_text_before_stopwords = text 

    tokens_without_stopwords = []
    word_tokens = [] 

    try:
        try:
            word_tokens = word_tokenize(cleaned_text_before_stopwords)
        except LookupError as e: 
            print(f"NLTK 'punkt' tokenizer models not found (Detail: {e}). Falling back to simple split for tokenization.")
            word_tokens = cleaned_text_before_stopwords.split()
        
        try:
            stop_words_set = set(stopwords.words(language))
        except LookupError as e: 
            print(f"NLTK 'stopwords' for '{language}' not found (Detail: {e}). Stopword removal will be skipped.")
            stop_words_set = set() 
        
        tokens_without_stopwords = [
            word for word in word_tokens
            if word.isalnum() and word not in stop_words_set 
        ]
    except Exception as e: 
        print(f"An unexpected error occurred during tokenization/stopword removal: {e}")
        tokens_without_stopwords = [word for word in cleaned_text_before_stopwords.split() if word.isalnum()]

    return cleaned_text_before_stopwords, tokens_without_stopwords

def process_document_file(file_path, language='english'):
    """
    Processes a single HTML or TXT file for text extraction and cleaning.
    Reads the file, preprocesses its content, and saves the text after stop word removal.

    Args:
        file_path (str): The full path to the HTML or TXT file.
        language (str, optional): The language for stop word removal. Defaults to 'english'.
    
    Returns:
        str: Path to the tokens file if successful, else None.
    """

    raw_content = ""
    print(f"\n--- Processing file: {file_path} ---")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            raw_content = f.read()
    except UnicodeDecodeError:
        print(f"UTF-8 decoding failed for {file_path}, trying iso-8859-1 (latin-1).")
        try:
            with open(file_path, "r", encoding="iso-8859-1") as f:
                raw_content = f.read()
        except Exception as e:
            print(f"Error reading file {file_path} with iso-8859-1: {e}")
            return None
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred while reading the file: {e}")
        return None

    if not raw_content:
        print("No content to process from the file.")
        return None

    file_extension = os.path.splitext(file_path)[1].lower()
    
    cleaned_text_string = "" 
    tokens_after_stopwords = []

    if file_extension in ['.html', '.htm']:
        cleaned_text_string, tokens_after_stopwords = preprocess_html_content(raw_content, language=language)
    elif file_extension == '.txt':
        cleaned_text_string, tokens_after_stopwords = preprocess_plain_text(raw_content, language=language)
    else:
        print(f"Unsupported file type: {file_extension} for {file_path}. Attempting to process as plain text.")
        cleaned_text_string, tokens_after_stopwords = preprocess_plain_text(raw_content, language=language)

    if not tokens_after_stopwords: 
        print(f"No tokens generated after stop word removal for {file_path}.")
        if cleaned_text_string:
            print(f"Cleaned Text (Before Stop Word Removal - for context of {file_path}):")
            print(cleaned_text_string[:200] + "..." if len(cleaned_text_string) > 200 else cleaned_text_string)
        return None
        
    output_dir = os.path.join("data", "cleaned")
    try:
        os.makedirs(output_dir, exist_ok=True)
    except OSError as e:
        print(f"Error creating directory {output_dir}: {e}")
        return None 

    base_name_input_file = os.path.basename(file_path)
    name_without_ext, _ = os.path.splitext(base_name_input_file)
    if name_without_ext.endswith(".html"): 
        name_without_ext, _ = os.path.splitext(name_without_ext)
    
    output_tokens_filename = name_without_ext + "_tokens_no_stopwords.txt"
    full_output_tokens_path = os.path.join(output_dir, output_tokens_filename)

    try:
        with open(full_output_tokens_path, "w", encoding="utf-8") as outfile:
            outfile.write(" ".join(tokens_after_stopwords)) 
        print(f"Tokens (after stopwords) saved to {full_output_tokens_path}")
    except Exception as e:
        print(f"Error saving tokens to {full_output_tokens_path}: {e}")
        return None 
        
    return full_output_tokens_path

def process_directory(directory_path, language='english'):
    """
    Processes all HTML and TXT files in a given directory.

    Args:
        directory_path (str): The path to the directory containing files to process.
        language (str, optional): The language for stop word removal. Defaults to 'english'.
    """
    
    if not os.path.isdir(directory_path):
        print(f"Error: Provided path '{directory_path}' is not a valid directory.")
        return

    print(f"Starting batch processing for directory: {directory_path}")
    processed_files_count = 0
    failed_files_count = 0

    for filename in os.listdir(directory_path):
        full_file_path = os.path.join(directory_path, filename)
        if os.path.isfile(full_file_path):
            if filename.lower().endswith(('.html', '.htm', '.txt')):
                output_path = process_document_file(full_file_path, language=language)
                if output_path:
                    processed_files_count += 1
                else:
                    failed_files_count += 1
            else:
                print(f"Skipping non-HTML/TXT file: {filename}")
        else:
            print(f"Skipping non-file item: {filename}")
            
    print("\n--- Batch processing finished ---")
    print(f"Successfully processed files: {processed_files_count}")
    print(f"Failed to process files: {failed_files_count}")


if __name__ == "__main__":
    raw_data_directory = os.path.join("data", "raw") 
    default_language = "german" 

    if not os.path.isdir(raw_data_directory):
         print(f"Directory '{raw_data_directory}' not found. Please create it and add files to process.")
    else:
        process_directory(raw_data_directory, language=default_language)

