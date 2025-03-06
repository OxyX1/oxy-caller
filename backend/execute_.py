import sys
from interpreter_ import Interpreter_
from lexer_ import tokenize_

if len(sys.argv) < 2:
    print("Usage: python execute_.py <filename.unx>")
    sys.exit(1)

filename_ = sys.argv[1]

with open(filename_, 'r') as file:
    code_ = file.read()

tokens_ = tokenize_(code_)

interpreter_ = Interpreter_()
interpreter_.load_and_execute_(filename_)
