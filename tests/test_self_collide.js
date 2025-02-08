import tap from 'tap'

import getMove from '../src/handlers/move.js'

const board = {
    height: 11,
    width: 11,
    snakes: []
}

tap.test('avoid backwards self-collide from right', function (t) {
    const game = {
        board: board,
        you: {
            head: {
                x: 6,
                y: 6
            },
            body: [
                { x: 6, y: 6 },
                { x: 7, y: 6 },
            ],
            length: 2
        }
    }

    const result = getMove(game)
    t.ok(result.move != 'right')
    t.end()
})

tap.test('avoid backwards self-collide from left', function (t) {
    const game = {
        board: board,
        you: {
            head: {
                x: 7,
                y: 6
            },
            body: [
                { x: 7, y: 6 },
                { x: 6, y: 6 },
            ],
            length: 2
        }
    }

    const result = getMove(game)
    t.ok(result.move != 'left')
    t.end()
})


tap.test('avoid backwards self-collide from top', function (t) {
    const game = {
        board: board,
        you: {
            head: {
                x: 6,
                y: 6
            },
            body: [
                { x: 6, y: 6 },
                { x: 6, y: 5 },
            ],
            length: 2
        }
    }

    const result = getMove(game)
    t.ok(result.move != 'down')
    t.end()
})

tap.test('avoid backwards self-collide from bottom', function (t) {
    const game = {
        board: board,
        you: {
            head: {
                x: 6,
                y: 5
            },
            body: [
                { x: 6, y: 5 },
                { x: 6, y: 6 },
            ],
            length: 2
        }
    }

    const result = getMove(game)
    t.ok(result.move != 'up')
    t.end()
})


tap.test('avoid self-collide from bottom', function (t) {
    const game = {
        board: board,
        you: {
            head: {
                x: 7,
                y: 5
            },
            body: [
                { x: 7, y: 5 },
                { x: 8, y: 5 },
                { x: 8, y: 6 },
                { x: 7, y: 6 },
                { x: 6, y: 6 }
            ],
            length: 5
        }
    }

    const result = getMove(game)
    t.ok(['left', 'down'].includes(result.move))
    t.end()
})

tap.test('avoid self-collide from top', function (t) {
    const game = {
        board: board,
        you: {
            head: {
                x: 6,
                y: 6
            },
            body: [
                { x: 6, y: 6 },
                { x: 7, y: 6 },
                { x: 8, y: 6 },
                { x: 8, y: 5 },
                { x: 7, y: 5 },
                { x: 6, y: 5 }
            ],
            length: 6
        }
    }

    const result = getMove(game)
    t.ok(['left', 'up'].includes(result.move))
    t.end()
})

tap.test('avoid self-collide from left', function (t) {
    const game = {
        board: board,
        you: {
            head: {
                x: 6,
                y: 6
            },
            body: [
                { x: 6, y: 6 },
                { x: 6, y: 7 },
                { x: 8, y: 6 },
                { x: 7, y: 7 },
                { x: 7, y: 6 },
                { x: 7, y: 5 }
            ],
            length: 6
        }
    }

    const result = getMove(game)
    t.ok(['left', 'down'].includes(result.move))
    t.end()
})

tap.test('avoid self-collide from right', function (t) {
    const game = {
        board: board,
        you: {
            head: {
                x: 6,
                y: 6
            },
            body: [
                { x: 6, y: 6 },
                { x: 6, y: 7 },
                { x: 8, y: 6 },
                { x: 5, y: 7 },
                { x: 5, y: 6 },
                { x: 5, y: 5 }
            ],
            length: 6
        }
    }

    const result = getMove(game)
    t.ok(['right', 'down'].includes(result.move))
    t.end()
})
