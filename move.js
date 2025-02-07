export default function getMove(gameState) {
    /* 
    ** Вызывается каждый ход и должна возвращать одно
    ** из значений: "up", "down", "left" или "right"
    */

    const isMoveSafe = {
        up: true,
        down: true,
        left: true,
        right: true,
    };

    // Избегаем движения в обратном направлении

    const myHead = gameState.you.body[0];
    const myNeck = gameState.you.body[1];

    if (myNeck.x < myHead.x) {
        isMoveSafe.left = false;
    } else if (myNeck.x > myHead.x) {
        isMoveSafe.right = false;
    } else if (myNeck.y < myHead.y) {
        isMoveSafe.down = false;
    } else if (myNeck.y > myHead.y) {
        isMoveSafe.up = false;
    }

    // Улучшение 1 - Защити своего червячка от выхода за границы поля

    const boardWidth = gameState.board.width;
    const boardHeight = gameState.board.height;

    if (myHead.x + 1 >= boardWidth) {
        isMoveSafe.right = false;
    } else if (myHead.x - 1 < 0) {
        isMoveSafe.left = false;
    } else if (myHead.y + 1 >= boardHeight) {
        isMoveSafe.up = false;
    } else if (myHead.y - 1 < 0) {
        isMoveSafe.down = false;
    }

    // Улучшение 2 - Защити своего червячка от столкновения со своим телом
    const myBody = gameState.you.body.slice(1); // пропускаем голову
    for (const segment of myBody) {
        if (segment.x === myHead.x + 1 && segment.y === myHead.y) {
            isMoveSafe.right = false;
        } else if (segment.x === myHead.x - 1 && segment.y === myHead.y) {
            isMoveSafe.left = false;
        } else if (segment.x === myHead.x && segment.y === myHead.y + 1) {
            isMoveSafe.up = false;
        } else if (segment.x === myHead.x && segment.y === myHead.y - 1) {
            isMoveSafe.down = false;
        }
    }

    // Улучшение 3 - Защити своего червячка от столкновения с телами соперников 
    const opponents = gameState.board.snakes.filter(snake => snake.id !== gameState.you.id);
    for (const snake of opponents) {
        for (const segment of snake.body) {
            if (segment.x === myHead.x + 1 && segment.y === myHead.y) {
                isMoveSafe.right = false;
            } else if (segment.x === myHead.x - 1 && segment.y === myHead.y) {
                isMoveSafe.left = false;
            } else if (segment.x === myHead.x && segment.y === myHead.y + 1) {
                isMoveSafe.up = false;
            } else if (segment.x === myHead.x && segment.y === myHead.y - 1) {
                isMoveSafe.down = false;
            }
        }
    }

    // Проверка, остались ли безопасные ходы (если нет, то куда угодно)
    const safeMoves = Object.keys(isMoveSafe).filter((key) => isMoveSafe[key]);
    if (safeMoves.length == 0) {
        return { move: "down" };
    } else {
        // Если безопасные ходы есть – выбирается рандомный
        const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];
        return { move: nextMove };
    }
}