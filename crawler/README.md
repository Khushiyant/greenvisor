This Python script preprocesses HTML and TXT files. It extracts text, cleans it, removes language-specific stopwords (e.g., German, English), and saves the resulting tokens.

Usage:

    Place raw HTML/TXT files in the data/raw/ directory.
    Run python preprocess.py.
    Processed files (tokens after stopword removal) are saved to data/cleaned/ with a _tokens_no_stopwords.txt suffix.

The script defaults to processing all files in data/raw/ using German stopwords. You can modify the if __name__ == "__main__": block to process a single file interactively if needed.
