import { cellTime } from './tool'
import store from '../redux'

/**
 * 
 * @param time 
 * 
 */
export function timeToPixel (time: number) {
    return (time / cellTime(store.getState()['makers']['zoomLevel'])) * 60
}

/**
 * 
 * @param pixel 
 * 
 */
export function pixelToTime (pixel: number) {
    return (pixel / 60) * cellTime(store.getState()['makers']['zoomLevel'])
}