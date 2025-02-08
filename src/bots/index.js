import getMove from "./handlers/move.js";
import getInfo from "./handlers/info.js";

console.log(getMove, getMove.dummy)

import bootstrap from '../server/index.js'

const dummyApp = bootstrap({ handleInfo: getInfo.dummy, handleMove: getMove.dummy })
const simpleApp = bootstrap({ handleInfo: getInfo.simple, handleMove: getMove.simple })

dummyApp.listen(7001, () => {
    console.log('Dummy Bot running on :7001...')
})

simpleApp.listen(7002, () => {
    console.log('Simple Bot running on :7002...')
})
