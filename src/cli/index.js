import { spawn } from 'child_process'
import run from "./run.js";

const expressProcess = spawn('node', ["./src/index.js"])

expressProcess.stdout.on('data', () => {
    function processFinish(data) {
        const message = data.toString()
        console.log(message)
        if (message.includes('completed')) {
            expressProcess.kill()
        }
    }

    const withBots = process.argv[2] === '--with-bots'
    const cliRunner = run(true, withBots)
    const cliProcess = cliRunner()
    cliProcess.stderr.on('data', processFinish);
    cliProcess.stdout.on('data', processFinish);
});
