import re

TOKEN_PATTERNS_ = [
    ("FUNC", r"\bfunc\b"),  # Function keyword
    ("READ", r"\bread\b"),  # Read function
    ("IDENTIFIER", r"[a-zA-Z_][a-zA-Z0-9_]*"),  # Variable & function names
    ("GLOBAL", r"@\w+"),  # Global variables
    ("HASH_EXEC", r"#\w+"),  # Function execution calls
    ("NUMBER", r"\d+"),  # Numbers
    ("STRING", r"\".*?\""),  # String literals
    ("BOOL", r"\b(?:true|false)\b"),  # Boolean values
    ("EQUALS", r"="),  # Assignment operator
    ("SEMICOLON", r";"),  # End of statement
    ("LBRACE", r"\{"),  # Opening brace
    ("RBRACE", r"\}"),  # Closing brace
    ("LPAREN", r"\("),  # Opening parenthesis
    ("RPAREN", r"\)"),  # Closing parenthesis
    ("PRINT", r"\bprint\b"),  # Print function
    ("COMMA", r","),  # Add this line for commas
    ("OPERATOR", r"[\+\-\*/]"),  # Math operators
    ("WHITESPACE", r"\s+"),  # Ignore spaces
]

def tokenize_(code):
    tokens = []
    position = 0

    while position < len(code):
        matched = False
        for token_type, pattern in TOKEN_PATTERNS_:
            regex = re.compile(pattern)
            match = regex.match(code, position)

            if match:
                if token_type != "WHITESPACE":  # Ignore spaces
                    tokens.append((token_type, match.group(0)))
                position = match.end()
                matched = True
                break

        if not matched:
            raise SyntaxError(f"Unknown token near: {code[position:position+15]}...")

    return tokens
