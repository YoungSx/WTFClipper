module.exports = (config, env) => {
    // 为了方便使用 electron 以及 node.js 相关的 api
    // 需要将 target 设置为 electron-renderer
    // 设置了 target 之后，原生浏览器的环境将无法运行此 react 项目(因为不支持 node.js 相关的 api)，会抛出 Uncaught ReferenceError: require is not defined 异常
    // 需要在 electron 的环境才能运行(因为支持 node.js 相关的 api)
    // 这一步的操作, 都是为了能与 electron 进行更好的集成
    config.target = 'electron-renderer';
    return config;
};