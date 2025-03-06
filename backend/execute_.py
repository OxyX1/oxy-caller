import sys
from interpreter_ import Interpreter_
from lexer_ import tokenize_
from highlighter_ import highlight_syntax

if len(sys.argv) < 2:
    print("Usage: python execute_.py <filename.unx>")
    sys.exit(1)

filename_ = sys.argv[1]

with open(filename_, 'r') as file:
    code_ = file.read()

# Highlight the syntax before tokenizing
highlighted_code = highlight_syntax(code_)
print(highlighted_code)

tokens_ = tokenize_(code_)

interpreter_ = Interpreter_()
interpreter_.load_and_execute_(filename_)
