from .snake_1 import Snake1
from .snake_0 import Snake0


def get_snake(snake_name):
    if snake_name == "dummy":
        return Snake0
    if snake_name == "simple":
        return Snake1
