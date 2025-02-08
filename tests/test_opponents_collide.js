import tap from 'tap'

import getMove from '../src/handlers/move.js'

tap.test('avoid head to head: one safe option', (t) => {
    const game = {
        board: {
            height: 11,
            width: 11,
            snakes: [
                {
                    id: 'c8cb622e-7bde-4bdf-b570-2303c83777c0',
                    name: 'us',
                    health: 99,
                    length: 3,
                    head: { x: 5, y: 5 },
                    body: [
                        { x: 5, y: 5 },
                        { x: 5, y: 6 },
                        { x: 4, y: 6 }
                    ],
                    latency: 0,
                    shout: '',
                    squad: ''
                },
                {
                    id: 'opponent-123asd',
                    name: 'them',
                    health: 99,
                    length: 3,
                    head: { x: 6, y: 4 },
                    body: [
                        { x: 6, y: 4 },
                        { x: 7, y: 4 },
                        { x: 7, y: 3 }
                    ],
                    latency: 0,
                    shout: '',
                    squad: ''
                }
            ],
            hazards: []
        },
        you: {
            head: { x: 5, y: 5 },
            body: [
                { x: 5, y: 5 },
                { x: 5, y: 6 },
                { x: 4, y: 6 }
            ],
            length: 3
        }
    }

    const expected = 'left'
    const result = getMove(game)
    t.equal(result.move, expected)
    t.end()
})

tap.test('avoid head to head: two safe options', (t) => {
    const you = {
        head: { x: 9, y: 2 },
        body: [
            { x: 9, y: 2 },
            { x: 9, y: 1 },
            { x: 9, y: 0 }
        ],
        length: 3
    }

    const game = {
        board: {
            height: 11,
            width: 11,
            snakes: [
                {
                    id: 'c8cb622e-7bde-4bdf-b570-2303c83777c0',
                    name: 'us',
                    health: 99,
                    length: 3,
                    head: you.head,
                    body: you.body,
                    latency: 0,
                    shout: '',
                    squad: ''
                },
                {
                    id: 'opponent-123asd',
                    name: 'them',
                    health: 99,
                    length: 3,
                    head: { x: 9, y: 4 },
                    body: [
                        { x: 9, y: 4 },
                        { x: 9, y: 5 },
                        { x: 9, y: 6 }
                    ],
                    latency: 0,
                    shout: '',
                    squad: ''
                }
            ],
            hazards: []
        },
        you: you
    }

    const result = getMove(game)
    t.ok(result.move === 'left' || result.move === 'right')
    t.end()
})
