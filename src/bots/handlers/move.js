export default function getMove(gameState) {

    function floodFillCount(startX, startY, obstacles, boardWidth, boardHeight) {
        let count = 0;
        let queue = [[startX, startY]];
        let visited = new Set();
        visited.add(`${startX},${startY}`);
        
        while (queue.length > 0) {
            const [x, y] = queue.shift();
            count++;
            const neighbors = [
                [x + 1, y],
                [x - 1, y],
                [x, y + 1],
                [x, y - 1]
            ];
            for (const [nx, ny] of neighbors) {
                if (nx < 0 || ny < 0 || nx >= boardWidth || ny >= boardHeight) {
                    continue;
                }
                const key = `${nx},${ny}`;
                if (visited.has(key) || obstacles.has(key)) {
                    continue;
                }
                visited.add(key);
                queue.push([nx, ny]);
            }
        }
        return count; // Возвращаем количество доступных клеток
    }

    // Проверка безопасных направлений
    function isMoveSafe(move, myHead, obstacles, boardWidth, boardHeight) {
        let newHead = { x: myHead.x, y: myHead.y };
        if (move === "up") newHead.y += 1;
        if (move === "down") newHead.y -= 1;
        if (move === "left") newHead.x -= 1;
        if (move === "right") newHead.x += 1;

        // Если новое положение выходит за пределы доски или на клетку с телом змеи — это небезопасно
        if (newHead.x < 0 || newHead.y < 0 || newHead.x >= boardWidth || newHead.y >= boardHeight) {
            return false;
        }
        if (obstacles.has(`${newHead.x},${newHead.y}`)) {
            return false;
        }

        return true;
    }

    const boardWidth = gameState.board.width;
    const boardHeight = gameState.board.height;
    const myBody = gameState.you.body;
    const myHead = myBody[0];
    const obstacles = new Set();
    const food = gameState.board.food || [];
    const opponents = gameState.board.snakes.filter(snake => snake.id !== gameState.you.id);

    // Заполнение множества препятствий
    for (let i = 0; i < myBody.length; i++) {
        const segment = myBody[i];
        obstacles.add(`${segment.x},${segment.y}`);
    }

    for (let i = 0; i < opponents.length; i++) {
        const snake = opponents[i];
        for (let j = 0; j < snake.body.length; j++) {
            const segment = snake.body[j];
            obstacles.add(`${segment.x},${segment.y}`);
        }
    }

    // Массив всех возможных направлений
    const possibleMoves = ['up', 'down', 'left', 'right'];

    // Фильтруем безопасные ходы
    let safeMoves = possibleMoves.filter(move => isMoveSafe(move, myHead, obstacles, boardWidth, boardHeight));

    // Если нет безопасных ходов, выбираем лучший из доступных
    if (safeMoves.length === 0) {
        const bestMove = findBestMoveBasedOnSpace(gameState);
        return { move: bestMove };
    }

    // Выбираем лучший ход, избегая патовых ситуаций
    let bestMove = safeMoves[0];
    let bestScore = -Infinity;

    for (let i = 0; i < safeMoves.length; i++) {
        const move = safeMoves[i];
        
        let newHead = { x: myHead.x, y: myHead.y };
        if (move === "up") newHead.y++;
        if (move === "down") newHead.y--;
        if (move === "left") newHead.x--;
        if (move === "right") newHead.x++;

        // Проверяем доступное пространство в новом месте
        const openArea = floodFillCount(newHead.x, newHead.y, obstacles, boardWidth, boardHeight);

        // Оценка на основе расстояния до еды (предпочитаем двигаться туда, где ближе еда)
        let foodDistance = Infinity;
        if (food.length > 0) {
            for (let j = 0; j < food.length; j++) {
                const item = food[j];
                const distance = Math.abs(newHead.x - item.x) + Math.abs(newHead.y - item.y);
                if (distance < foodDistance) {
                    foodDistance = distance;
                }
            }
        }

        // Оценка хода: предпочтение дается свободному пространству и близости к еде
        let score = openArea - foodDistance;
        
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return { move: bestMove };
}

function findBestMoveBasedOnSpace(gameState) {
    const boardWidth = gameState.board.width;
    const boardHeight = gameState.board.height;
    const myHead = gameState.you.head;

    const moves = ['up', 'down', 'left', 'right'];
    let bestMove = moves[0];
    let maxSpace = 0;

    for (const move of moves) {
        let newHead = { ...myHead };
        if (move === 'up') newHead.y++;
        if (move === 'down') newHead.y--;
        if (move === 'left') newHead.x--;
        if (move === 'right') newHead.x++;

        const space = floodFillCount(newHead.x, newHead.y, new Set(), boardWidth, boardHeight);
        if (space > maxSpace) {
            maxSpace = space;
            bestMove = move;
        }
    }
    
    return bestMove;
}
