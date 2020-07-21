var appData = {
    get RESOURCE_HOME () {
        return 'C:/Users/shangxin/Videos/WTFClipper'
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