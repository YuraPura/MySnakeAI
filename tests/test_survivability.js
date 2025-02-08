import tap from 'tap'
import { spawn } from 'child_process'

import run from '../src/cli/run.js'

tap.test('must survive at least 20 turns', function (t) {
    const expressProcess = spawn('node', ["./src/index.js"])

    expressProcess.stdout.on('data', () => {
        function processFinish(data) {
            const message = data.toString()
            if (message.includes('completed')) {
                const turns = Number(message.split(' ').at(-2))
                t.ok(turns > 20)
                t.end()
                cliProcess.kill()
                expressProcess.kill()
            }
        }

        const cliRunner = run(false)
        const cliProcess = cliRunner()
        cliProcess.stderr.on('data', processFinish);
        cliProcess.stdout.on('data', processFinish);
    });
})


