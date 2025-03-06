class Parser_:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def parse_(self):
        parsed_code = []
        while self.pos < len(self.tokens):
            token_type, value = self.tokens[self.pos]
            # End of a block (function body)
            if token_type == "RBRACE":
                break

            if token_type == "IDENTIFIER" and value == "print":
                self.pos += 1
                self.consume("LPAREN")  # Skip '('
                # Allow printing expressions
                expr = self.parse_expression(end_token="RPAREN")
                parsed_code.append(("print", expr))
                self.consume("RPAREN")  # Skip ')'
                self.consume("SEMICOLON")  # Skip ';'
                continue  # Add this line to continue parsing

            elif token_type == "FUNC":
                self.pos += 1
                func_name = self.tokens[self.pos][1]
                self.consume("IDENTIFIER")
                self.consume("LPAREN")
                self.consume("RPAREN")
                self.consume("LBRACE")
                func_body = self.parse_()  # Parse until the corresponding '}'
                self.consume("RBRACE")
                parsed_code.append(("func_def", func_name, func_body))

            elif token_type == "IDENTIFIER":
                # Variable assignment (e.g. x = 10; )
                var_name = value
                self.consume("IDENTIFIER")
                self.consume("EQUALS")
                expr = self.parse_expression()  # Parse until SEMICOLON
                parsed_code.append(("assign", var_name, expr))
                self.consume("SEMICOLON")

            elif token_type == "GLOBAL":
                # Global variable assignment (e.g. @result = x + y; )
                var_name = value
                self.consume("GLOBAL")
                self.consume("EQUALS")
                expr = self.parse_expression()
                parsed_code.append(("assign_global", var_name, expr))
                self.consume("SEMICOLON")

            elif token_type == "HASH_EXEC":
                # Function execution call, possibly with an argument
                func_exec_name = value[1:]  # remove the leading '#'
                self.consume("HASH_EXEC")
                self.consume("LPAREN")
                # If there's an argument before the RPAREN, parse it.
                arg_expr = None
                if self.tokens[self.pos][0] != "RPAREN":
                    arg_expr = self.parse_expression(end_token="RPAREN")
                self.consume("RPAREN")
                self.consume("SEMICOLON")
                parsed_code.append(("func_exec", func_exec_name, arg_expr))
            else:
                # Skip any tokens that don't match our rules
                self.pos += 1
        return parsed_code

    def parse_expression(self, end_token="SEMICOLON"):
        """
        Collect tokens that form an expression until the end token is reached.
        When used in normal assignments, end_token defaults to SEMICOLON.
        For function call arguments, use end_token="RPAREN".
        """
        tokens_expr = []
        while self.pos < len(self.tokens) and self.tokens[self.pos][0] != end_token:
            if self.tokens[self.pos][0] == "COMMA":
                self.pos += 1  # Skip commas
                continue
            tokens_expr.append(self.tokens[self.pos])
            self.pos += 1
        return tokens_expr

    def consume(self, token_type):
        if self.pos < len(self.tokens) and self.tokens[self.pos][0] == token_type:
            self.pos += 1
        else:
            raise SyntaxError(f"Expected {token_type}, got {self.tokens[self.pos][0]}")
