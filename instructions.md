
# Connect 4 AI Model Submission

## Overview
Your task is to create a Python-based AI model that can play Connect 4. Your model will be executed by the game engine to decide moves during gameplay. It must follow a specific command-line interface so that the game server can interact with it seamlessly.

## What Your Model Must Do
- **Accept Command-Line Arguments:**  
  Use `argparse` to read in the following required parameters:
  - `--board`: A JSON-encoded 2D list representing the game board (6 rows × 7 columns).  
    *Empty cells are `0`, while player tokens are represented by `1` and `-1`.*
  - `--player`: An integer (`1` or `-1`) indicating the current player.

- **Process the Input:**  
  Convert the JSON string into a Python list (or array) and the player value into an integer.

- **Determine a Move:**  
  Your AI should analyze the board state and decide on a valid move. The move must be the column index where you want to drop the token.

- **Output the Move:**  
  Print the chosen move (an integer) to standard output, and flush stdout so that the move is sent immediately.

- **Dependencies:**  
  If your AI uses additional libraries (e.g., `numpy`, `scipy`), list them in a `requirements.txt` file.

## Starter Template / Boilerplate Code

Below is a minimal template to get you started:

```python
#!/usr/bin/env python
import argparse
import json

def main():
    parser = argparse.ArgumentParser(description="Connect 4 AI Model")
    parser.add_argument('--board', required=True, help="JSON-encoded board (2D list)")
    parser.add_argument('--player', required=True, help="Player number (1 or -1)")
    args = parser.parse_args()
    
    try:
        board = json.loads(args.board)
    except Exception as e:
        print("Error parsing board", flush=True)
        exit(1)
    
    player = int(args.player)
    
    # --- Your AI Logic Starts Here ---
    # For this starter example, choose the first column that isn't full.
    move = 0
    for col in range(len(board[0])):
        if board[0][col] == 0:
            move = col
            break
    # --- Your AI Logic Ends Here ---
    
    print(move, flush=True)

if __name__ == '__main__':
    main()
```

## Testing Your Model
You can test your model locally from the command line. For example:

```bash
python your_ai_model.py --board '[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]' --player 1
```

## Submission Guidelines
- Submit your Python file (and any additional files, like `requirements.txt` if needed).
- Ensure your model adheres to the interface specified above.
- Test thoroughly to make sure your move is printed correctly and that the program exits gracefully on errors.

Happy coding and good luck building your Connect 4 AI!
