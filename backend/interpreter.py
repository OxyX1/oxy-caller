class Interpreter:
    def __init__(self):
        self.variables = {}

    def execute(self, parsed_code):
        for command in parsed_code:
            if command[0] == 'let':
                self.variables[command[1]] = command[2]
            elif command[0] == 'log':
                print(command[1])
            else:
                print(f"Unknown command: {command}")

    def load_and_execute(self, filename):
        with open(filename, 'r') as file:
            code = file.read()
        
        from lexer import tokenize
        from parser import Parser
        
        tokens = tokenize(code)
        parser = Parser(tokens)
        parsed_code = parser.parse()
        self.execute(parsed_code)
