class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.i = 0
    
    def parse(self):
        parsed_code = []
        while self.i < len(self.tokens):
            token_type, value = self.tokens[self.i]

            if token_type == "LET":
                var_name = self.tokens[self.i+1][1]
                if self.tokens[self.i+2][0] != "EQUALS":
                    raise SyntaxError("Expected '=' after variable name.")
                var_value = self.tokens[self.i+3][1].strip('"')
                parsed_code.append(('let', var_name, var_value))
                self.i += 4

            elif token_type == "IDENTIFIER":
                func_name = value + ":" + self.tokens[self.i+2][1]
                if func_name == "log":
                    msg = self.tokens[self.i+3][1].strip('"')
                    parsed_code.append(msg)
                self.i += 4

            else:
                self.i += 1

        return parsed_code
