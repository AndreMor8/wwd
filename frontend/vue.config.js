const CopyPlugin = require("copy-webpack-plugin");
const route = require("path").join(__dirname, "node_modules", "ruffle-mirror");
const file = require("fs").readdirSync(route).find(e => e.endsWith(".wasm"));
module.exports = {
    configureWebpack: {
        plugins: [
            new CopyPlugin({
                patterns: [{ from: `${route}/${file}`, to: "js" }]
            })
        ]
    }
};