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
    return count;
  }

  function canReachTail(startX, startY, target, obstacles, boardWidth, boardHeight) {
    let queue = [[startX, startY]];
    let visited = new Set();
    visited.add(`${startX},${startY}`);
    while (queue.length > 0) {
      const [x, y] = queue.shift();
      if (x === target.x && y === target.y) {
        return true;
      }
      const neighbors = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1]
      ];
      for (const [nx, ny] of neighbors) {
        if (nx < 0 || ny < 0 || nx >= boardWidth || ny >= boardHeight) continue;
        const key = `${nx},${ny}`;
        if (visited.has(key) || obstacles.has(key)) continue;
        visited.add(key);
        queue.push([nx, ny]);
      }
    }
    return false;
  }

  const isMoveSafe = { up: true, down: true, left: true, right: true };
  const myBody = gameState.you.body;
  const myHead = myBody[0];
  const myNeck = myBody[1];
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;
  const food = gameState.board.food || [];
  const opponents = gameState.board.snakes.filter(snake => snake.id !== gameState.you.id);

  if (myNeck) {
    if (myNeck.x < myHead.x) {
      isMoveSafe.left = false;
    } else if (myNeck.x > myHead.x) {
      isMoveSafe.right = false;
    } else if (myNeck.y < myHead.y) {
      isMoveSafe.down = false;
    } else if (myNeck.y > myHead.y) {
      isMoveSafe.up = false;
    }
  }

  if (myHead.x + 1 >= boardWidth) isMoveSafe.right = false;
  if (myHead.x - 1 < 0) isMoveSafe.left = false;
  if (myHead.y + 1 >= boardHeight) isMoveSafe.up = false;
  if (myHead.y - 1 < 0) isMoveSafe.down = false;

  const occupiedCells = new Set();
  const bodyWithoutHead = myBody.slice(1);
  for (const segment of bodyWithoutHead) {
    occupiedCells.add(`${segment.x},${segment.y}`);
  }
  for (const snake of opponents) {
    for (const segment of snake.body) {
      occupiedCells.add(`${segment.x},${segment.y}`);
    }
  }

  if (occupiedCells.has(`${myHead.x + 1},${myHead.y}`)) isMoveSafe.right = false;
  if (occupiedCells.has(`${myHead.x - 1},${myHead.y}`)) isMoveSafe.left = false;
  if (occupiedCells.has(`${myHead.x},${myHead.y + 1}`)) isMoveSafe.up = false;
  if (occupiedCells.has(`${myHead.x},${myHead.y - 1}`)) isMoveSafe.down = false;

  let safeMoves = Object.keys(isMoveSafe).filter(move => isMoveSafe[move]);
  if (safeMoves.length === 0) return { move: "down" };

  const myLength = gameState.you.length || myBody.length;
  let bestScore = -Infinity;
  let bestMove = safeMoves[0];

  for (const move of safeMoves) {
    let newHead = { x: myHead.x, y: myHead.y };
    if (move === "up") newHead.y += 1;
    else if (move === "down") newHead.y -= 1;
    else if (move === "left") newHead.x -= 1;
    else if (move === "right") newHead.x += 1;

    if (myNeck && newHead.x === myNeck.x && newHead.y === myNeck.y) continue;

    const willEat = food.some(item => item.x === newHead.x && item.y === newHead.y);
    let localObstacles = new Set(occupiedCells);
    if (!willEat && myBody.length > 2) {
      const tail = myBody[myBody.length - 1];
      localObstacles.delete(`${tail.x},${tail.y}`);
    }
    let openArea = floodFillCount(newHead.x, newHead.y, localObstacles, boardWidth, boardHeight);
    if (!willEat && myBody.length > 0) {
      const tail = myBody[myBody.length - 1];
      if (!canReachTail(newHead.x, newHead.y, tail, localObstacles, boardWidth, boardHeight)) {
        openArea = 0;
      }
    }
    let foodDistance = 0;
    if (food.length > 0) {
      let closestFoodDistance = Infinity;
      for (const item of food) {
        const distance = Math.abs(newHead.x - item.x) + Math.abs(newHead.y - item.y);
        if (distance < closestFoodDistance) closestFoodDistance = distance;
      }
      foodDistance = closestFoodDistance;
    }
    let headToHeadPenalty = 0;
    let headToHeadBonus = 0;
    for (const opponent of opponents) {
      const opponentLength = opponent.length || opponent.body.length;
      let oppDistance = Math.abs(newHead.x - opponent.head.x) + Math.abs(newHead.y - opponent.head.y);
      if (oppDistance <= 1) {
        if (opponentLength >= myLength) headToHeadPenalty += 1000;
        else headToHeadBonus += 1000;
      }
    }
    let lowAreaPenalty = 0;
    if (openArea < myLength * 2) {
      lowAreaPenalty = (myLength * 2 - openArea) * 100;
    }
    let score = openArea - foodDistance - headToHeadPenalty + headToHeadBonus - lowAreaPenalty;
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return { move: bestMove };
}