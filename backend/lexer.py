import re

TOKENS = [
    "LET": r'\blet\b',
    "IDENTIFIER": r'=',
    "STRING": r"\".*?\"",
    "NUMBER": r"\d+",
    "COLON": r":",
    "LBRACE": r"\{",
    "RBRACE": r"\}",
    "NEWLINE": r"\n",
]

def Tokenize(code):
    tokens = []
    while code:
        code = code.lstrip()
        for token_type, pattern in TOKENS.items():
            match = re.match(pattern, code)
            if match:
                tokens.append((token_type, match.group(0)))
                code = code[len(match.group(0)):] #moving forward in the code
                break
            else:
                raise SyntaxError(f"Unknown token: {code[:10]}")
        return tokens