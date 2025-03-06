class Interpreter_:
    def __init__(self):
        self.variables_ = {}  # Store normal variables
        self.global_vars_ = {}  # Store global variables
        self.functions_ = {}  # Store function definitions

    def execute_(self, parsed_code_):
        for command in parsed_code_:
            if command[0] == "assign":
                # Variable assignment
                self.variables_[command[1]] = self.evaluate_expression(command[2])
            elif command[0] == "assign_global":
                # Global variable assignment
                self.global_vars_[command[1]] = self.evaluate_expression(command[2])
            elif command[0] == "print":
                # Print statement
                values = command[1]
                output = self.evaluate_expression(values)
                print(output)  # Print the evaluated expression
            elif command[0] == "read":
                # Read input
                prompt = "".join([self.evaluate_expression([token]) for token in command[1]])
                user_input = input(prompt)
                self.variables_['user_input'] = user_input
            elif command[0] == "assign_read":
                # Assign read input to a variable
                prompt = "".join([self.evaluate_expression([token]) for token in command[2]])
                user_input = input(prompt)
                self.variables_[command[1]] = user_input
            elif command[0] == "func_def":
                self.functions_[command[1]] = command[2]  # Store function body
            elif command[0] == "func_exec":
                func_name = command[1]
                if func_name.startswith("#"):
                    func_name = func_name[1:]  # Remove the leading '#'
                if func_name in self.functions_:
                    func_body = self.functions_[func_name]
                    if command[2]:  # If there are arguments
                        self.variables_['arg'] = self.evaluate_expression(command[2])
                    self.execute_(func_body)
                else:
                    print(f"Error: Function '{func_name}' not found.")

    def evaluate_expression(self, expr):
        # Simplified evaluation for demonstration purposes
        if len(expr) == 1:
            token_type, value = expr[0]
            if token_type == "STRING":
                return str(value).strip('"')  # Ensure value is a string, then strip the quotes
            elif token_type == "NUMBER":
                return int(value)
            elif token_type == "IDENTIFIER":
                return self.variables_.get(value, value)
            elif token_type == "GLOBAL":
                return self.global_vars_.get(value, value)
        elif len(expr) == 3:
            left = self.evaluate_expression([expr[0]])
            operator = expr[1][1]
            right = self.evaluate_expression([expr[2]])
            if operator == "+":
                if isinstance(left, str) or isinstance(right, str):
                    return str(left) + str(right)
                return left + right
            elif operator == "-":
                return left - right
            elif operator == "*":
                return left * right
            elif operator == "/":
                return left / right
        return expr

    def load_and_execute_(self, filename_):
        with open(filename_, 'r') as file:
            code_ = file.read()

        from lexer_ import tokenize_
        from parser_ import Parser_

        tokens_ = tokenize_(code_)
        parser_ = Parser_(tokens_)
        parsed_code_ = parser_.parse_()
        self.execute_(parsed_code_)
