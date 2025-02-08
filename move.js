export default function getMove(gameState) {
    /* 
    ** Вызывается каждый ход и должна возвращать одно
    ** из значений: "up", "down", "left" или "right"
    */
    // Для поиска хавчика
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
        return count;
    }

    const isMoveSafe = {
        up: true,
        down: true,
        left: true,
        right: true
    };

    const myBody = gameState.you.body;
    const myHead = myBody[0];
    const myNeck = myBody[1];
    const boardWidth = gameState.board.width;
    const boardHeight = gameState.board.height;
    
    const food = gameState.board.food || [];
    const opponents = gameState.board.snakes.filter(function(snake) {
        return snake.id !== gameState.you.id;
    });
    
    if (myNeck.x < myHead.x) {
        isMoveSafe.left = false;
    } else if (myNeck.x > myHead.x) {
        isMoveSafe.right = false;
    } else if (myNeck.y < myHead.y) {
        isMoveSafe.down = false;
    } else if (myNeck.y > myHead.y) {
        isMoveSafe.up = false;
    }
    
    // pr gran polia
    if (myHead.x + 1 >= boardWidth) {
        isMoveSafe.right = false;
    }
    if (myHead.x - 1 < 0) {
        isMoveSafe.left = false;
    }
    if (myHead.y + 1 >= boardHeight) {
        isMoveSafe.up = false;
    }
    if (myHead.y - 1 < 0) {
        isMoveSafe.down = false;
    }
    
    // podshet cletoc kotorie mi zanemaem
    const occupiedCells = new Set();
    const bodyWithoutHead = myBody.slice(1);
    for (let i = 0; i < bodyWithoutHead.length; i++) {
        const segment = bodyWithoutHead[i];
        occupiedCells.add(`${segment.x},${segment.y}`);
    }
    
    // vich protivnika ip
    for (let i = 0; i < opponents.length; i++) {
        const snake = opponents[i];
        for (let j = 0; j < snake.body.length; j++) {
            const segment = snake.body[j];
            occupiedCells.add(`${segment.x},${segment.y}`);
        }
    }
    
    // proverka na stolknov s telami vs
    if (occupiedCells.has(`${myHead.x + 1},${myHead.y}`)) {
        isMoveSafe.right = false;
    }
    if (occupiedCells.has(`${myHead.x - 1},${myHead.y}`)) {
        isMoveSafe.left = false;
    }
    if (occupiedCells.has(`${myHead.x},${myHead.y + 1}`)) {
        isMoveSafe.up = false;
    }
    if (occupiedCells.has(`${myHead.x},${myHead.y - 1}`)) {
        isMoveSafe.down = false;
    }
    
    // spisok hodov
    let safeMoves = Object.keys(isMoveSafe).filter(function(key) {
        return isMoveSafe[key];
    });
    if (safeMoves.length === 0) {
        return { move: "down" }; // Если нет безопасных ходов, идём вниз
    }
    
    // my dlina
    const myLength = gameState.you.length || myBody.length;
    
    // Штраф будет применён при расчёте итогового счета для данного хода.
    // Добавил дебаф к ходу, который може привести к столкнавению с сильным противником
    // это должно быть учтено при подщете хода
    // Итог будет = openArea - foodDistance - headToHeadPenalty

    let bestScore = -Infinity;
    let bestMove = safeMoves[0];
    
    for (let i = 0; i < safeMoves.length; i++) {
        const move = safeMoves[i];
        // polozhenie golovi posle hoda
        let newHead = { x: myHead.x, y: myHead.y };
        if (move === "up") {
            newHead.y = newHead.y + 1;
        } else if (move === "down") {
            newHead.y = newHead.y - 1;
        } else if (move === "left") {
            newHead.x = newHead.x - 1;
        } else if (move === "right") {
            newHead.x = newHead.x + 1;
        }
        
        // Оцениваем количество свободного пространства из новой позиции
        let openArea = floodFillCount(newHead.x, newHead.y, occupiedCells, boardWidth, boardHeight);
        
        // Определяем расстояние до ближайшей еды
        let foodDistance = 0;
        if (food.length > 0) {
            let closestFoodDistance = Infinity;
            for (let j = 0; j < food.length; j++) {
                const item = food[j];
                const distance = Math.abs(newHead.x - item.x) + Math.abs(newHead.y - item.y);
                if (distance < closestFoodDistance) {
                    closestFoodDistance = distance;
                }
            }
            foodDistance = closestFoodDistance;
        }

        let headToHeadPenalty = 0;
        for (let k = 0; k < opponents.length; k++) {
            const opponent = opponents[k];
            const opponentLength = opponent.length || opponent.body.length;

            let oppDistance = Math.abs(newHead.x - opponent.head.x) + Math.abs(newHead.y - opponent.head.y);
            if (oppDistance <= 1) {
                if (opponentLength >= myLength) {
                    headToHeadPenalty = headToHeadPenalty + 1000;
                }
            }
        }
        
        let score = openArea - foodDistance - headToHeadPenalty;
        
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    
    return { move: bestMove };
}