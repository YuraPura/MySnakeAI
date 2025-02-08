export default function loadConfig() {
    return {
        host: process.env?.HOST || "localhost",
        port: process.env?.PORT || 4000
    }
}