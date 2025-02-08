import tap from 'tap'

import getMove from '../src/handlers/move.js'

tap.test('avoid hitting the north wall', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 1,
        y: 10
      },
      body: [
        { x: 1, y: 10 },
        { x: 1, y: 9 },
        { x: 1, y: 8 }
      ],
      length: 3
    }
  }

  const result = getMove(game)
  t.ok(result.move === 'left' || result.move === 'right')
  t.end()
})

tap.test('avoid hitting the west wall', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 0,
        y: 5
      },
      body: [
        { x: 0, y: 5 },
        { x: 1, y: 5 },
        { x: 2, y: 5 }
      ],
      length: 3
    }
  }

  const result = getMove(game)
  t.ok(result.move === 'up' || result.move === 'down')
  t.end()
})

tap.test('avoid hitting the northwest corner', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 0,
        y: 10
      },
      body: [
        { x: 0, y: 10 },
        { x: 1, y: 10 },
        { x: 2, y: 10 }
      ],
      length: 3
    }
  }

  const expected = 'down'
  const result = getMove(game)
  t.equal(result.move, expected)

  t.end()
})

tap.test('avoid hitting the southwest corner, southbound', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 0,
        y: 0
      },
      body: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 }
      ],
      length: 3
    }
  }

  const expected = 'right'
  const result = getMove(game)
  t.equal(result.move, expected)

  t.end()
})

tap.test('avoid hitting the south wall', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 5,
        y: 0
      },
      body: [
        { x: 5, y: 0 },
        { x: 5, y: 1 },
        { x: 5, y: 2 }
      ],
      length: 3
    }
  }

  const result = getMove(game)
  t.ok(result.move === 'left' || result.move === 'right')
  t.end()
})

tap.test('avoid hitting the southeast corner, eastbound', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 10,
        y: 0
      },
      body: [
        { x: 10, y: 0 },
        { x: 9, y: 0 },
        { x: 8, y: 0 }
      ],
      length: 3
    }
  }

  const expected = 'up'
  const result = getMove(game)
  t.equal(result.move, expected)

  t.end()
})

tap.test('survive the northeast corner, northbound', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 10,
        y: 10
      },
      body: [
        { x: 10, y: 10 },
        { x: 10, y: 9 },
        { x: 10, y: 8 }
      ],
      length: 3
    }
  }

  const expected = 'left'
  const result = getMove(game)
  t.equal(result.move, expected)

  t.end()
})

tap.test('avoid hitting the northeast corner, eastbound', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 10,
        y: 10
      },
      body: [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
      ],
      length: 3
    }
  }

  const expected = 'down'
  const result = getMove(game)
  t.equal(result.move, expected)

  t.end()
})

tap.test('avoid hitting the east wall, southbound', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: []
    },
    you: {
      head: {
        x: 10,
        y: 9
      },
      body: [
        { x: 10, y: 9 },
        { x: 10, y: 10 },
        { x: 9, y: 10 }
      ],
      length: 3
    }
  }

  const result = getMove(game)
  t.ok(result.move === 'left' || result.move === 'down')
  t.end()
})

tap.test('avoid hitting the east wall and another snake, eastbound', function (t) {
  const game = {
    board: {
      height: 11,
      width: 11,
      snakes: [
        {
          id: 'c8cb622e-7bde-4bdf-b570-2303c83777c0',
          name: 'me',
          health: 92,
          body: [
            { x: 10, y: 5 },
            { x: 9, y: 5 },
            { x: 8, y: 5 }
          ],
          latency: 0,
          head: { x: 10, y: 5 },
          length: 3,
          shout: '',
          squad: ''
        },
        {
          id: 'ca66924c-d5fe-4035-9bc1-17f63ba39852',
          name: 'opp',
          health: 96,
          body: [
            { x: 10, y: 4 },
            { x: 9, y: 4 },
            { x: 8, y: 4 }
          ],
          latency: 0,
          head: { x: 5, y: 9 },
          length: 4,
          shout: '',
          squad: ''
        }
      ]
    },
    you: {
      head: {
        x: 10,
        y: 5
      },
      body: [
        { x: 10, y: 5 },
        { x: 9, y: 5 },
        { x: 8, y: 5 }
      ],
      length: 3
    }
  }

  const expected = 'up'
  const result = getMove(game)
  t.equal(result.move, expected)
  t.end()
})
