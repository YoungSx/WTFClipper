/**
 * TODO:
 * 1. lodash
 * 2. 抽离 60px
 * 3. 可指定时间单位
 */

/**
 * 
 * @param time 
 * 暂时拟定 60px 代表 1000ms
 */
export function timeToPixel (time: number) {
    return (time / 1000) * 60
}

/**
 * 
 * @param pixel 
 * 暂时拟定 60px 代表 1000ms
 */
export function pixelToTime (pixel: number) {
    return (pixel / 60) * 1000
}