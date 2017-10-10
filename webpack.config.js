function buildConfig(env) {
    return require("./" + env + '.js')
}

module.exports = buildConfig;