const file = {
    allowedVideoExts: [
        'mp4',
        'mkv',
        'avi',
        '3gp',
        'webm',
        'flv',
        'yuv'
    ],
    allowedAudioExts: [
        'mp3',
        'wav',
        'mp4',
        'flv',
        'webm'
    ],
    allowedPictureExts: [
        'jpg',
        'jpeg',
        'png',
        'webp',
        'bmp',
        'tif'
    ],
    get allowedExts () {
        return [...this.allowedVideoExts, ...this.allowedAudioExts, ...this.allowedPictureExts]
    }
}

export default file