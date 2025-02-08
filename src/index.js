import loadConfig from "./server/config.js";
import bootstrap from './server/index.js'

import getMove from "./handlers/move.js";
import getInfo from "./handlers/info.js";

const { host, port } = loadConfig()
const app = bootstrap({ handleInfo: getInfo, handleMove: getMove })

app.listen(port, host, () => {
    console.log('Express running...')
})