var appData = {
    /**
     * TODO:
     *  1. 检测目录是否存在，不存在则创建
     */
    get RESOURCE_HOME () {
        return 'C:/Users/shangxin/Videos/WTFClipper'
    },
    get PRIVATE_DIR () {
        return this.RESOURCE_HOME + '/private'
    },
    get CACHE_DIR () {
        return this.RESOURCE_HOME + '/cache'
    },
    get COVER_DIR () {
        return this.CACHE_DIR + '/cover'
    },
    get COVER_EXT () {
        return 'jpg'
    }
}

export default appData