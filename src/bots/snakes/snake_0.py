import random


# See https://docs.battlesnake.com/api/example-move for available data
def handle_move(game_state: dict) -> dict:
    is_move_safe = {"up": True, "down": True, "left": True, "right": True}

    # prevent from moving backwards
    my_head = game_state["you"]["body"][0]  # Coords of your head
    my_neck = game_state["you"]["body"][1]  # Coords of your "neck"

    if my_neck["x"] < my_head["x"]:  # Neck is left of head, don't move left
        is_move_safe["left"] = False

    elif my_neck["x"] > my_head["x"]:  # Neck is right of head, don't move right
        is_move_safe["right"] = False

    elif my_neck["y"] < my_head["y"]:  # Neck is below head, don't move down
        is_move_safe["down"] = False

    elif my_neck["y"] > my_head["y"]:  # Neck is above head, don't move up
        is_move_safe["up"] = False

    # Prevent moving out of bounds
    board_width = game_state["board"]["width"]
    board_height = game_state["board"]["height"]

    if my_head["x"] + 1 >= board_width:
        is_move_safe["right"] = False
    if my_head["x"] - 1 < 0:
        is_move_safe["left"] = False
    if my_head["y"] + 1 >= board_height:
        is_move_safe["up"] = False
    if my_head["y"] - 1 < 0:
        is_move_safe["down"] = False

    # Prevent colliding with its own body
    my_body = game_state["you"]["body"]
    occupied_cells = set()
    for segment in my_body[1:]:  # excluding the head
        occupied_cells.add((segment["x"], segment["y"]))

    if (my_head["x"] + 1, my_head["y"]) in occupied_cells:
        is_move_safe["right"] = False
    if (my_head["x"] - 1, my_head["y"]) in occupied_cells:
        is_move_safe["left"] = False
    if (my_head["x"], my_head["y"] + 1) in occupied_cells:
        is_move_safe["up"] = False
    if (my_head["x"], my_head["y"] - 1) in occupied_cells:
        is_move_safe["down"] = False

    # Prevent colliding with other snakes
    opponents = game_state["board"]["snakes"]
    for snake in opponents:
        if snake["id"] == game_state["you"]["id"]:
            continue
        for segment in snake["body"]:
            if (my_head["x"] + 1, my_head["y"]) == (segment["x"], segment["y"]):
                is_move_safe["right"] = False
            if (my_head["x"] - 1, my_head["y"]) == (segment["x"], segment["y"]):
                is_move_safe["left"] = False
            if (my_head["x"], my_head["y"] + 1) == (segment["x"], segment["y"]):
                is_move_safe["up"] = False
            if (my_head["x"], my_head["y"] - 1) == (segment["x"], segment["y"]):
                is_move_safe["down"] = False

    # Are there any safe moves left?
    safe_moves = [move for move, is_safe in is_move_safe.items() if is_safe]

    if not safe_moves:
        return {"move": "down"}

    # Step 4 - Move towards food instead of random, to regain health
    food = game_state["board"].get("food", [])
    if food:
        best_move = None
        min_distance = float("inf")
        for move in safe_moves:
            new_head = my_head.copy()
            if move == "up":
                new_head["y"] += 1
            elif move == "down":
                new_head["y"] -= 1
            elif move == "left":
                new_head["x"] -= 1
            elif move == "right":
                new_head["x"] += 1

            # Find closest food
            for item in food:
                distance = abs(new_head["x"] - item["x"]) + abs(new_head["y"] - item["y"])
                if distance < min_distance:
                    min_distance = distance
                    best_move = move

        if best_move:
            return {"move": best_move}

    # Choose a random move if no food found
    next_move = random.choice(safe_moves)

    print(f"MOVE {game_state.get('turn', '')}: {next_move}")
    return {"move": next_move}
