const CopyPlugin = require("copy-webpack-plugin");
const route = require("path").join(__dirname, "node_modules", "ruffle-mirror");
module.exports = {
    configureWebpack: {
        plugins: [
            new CopyPlugin({
                patterns: [{ from: `${route}`, to: "js/ruffle" }]
            })
        ]
    }
};