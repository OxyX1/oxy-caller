import argparse
from interpreter import Interpreter

def main():
    # Setup argument parser
    parser = argparse.ArgumentParser(description="Execute .unx file")
    parser.add_argument("filename", help="The .unx file to execute")

    # Parse command-line arguments
    args = parser.parse_args()

    # Ensure the file has a .unx extension
    if not args.filename.endswith(".unx"):
        print("Error: Only .unx files are allowed.")
        return

    # Create an interpreter instance
    interpreter = Interpreter()

    # Try loading and executing the .unx file
    try:
        interpreter.load_and_execute(args.filename)
    except FileNotFoundError:
        print(f"Error: The file '{args.filename}' was not found.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
