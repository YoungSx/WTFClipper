import { cellPixels } from './tool'
import store from '../redux'

/**
 * 
 * @param time 
 * 
 */
export function timeToPixel (time: number) {
    return (time / cellPixels(store.getState()['makers']['zoomLevel'])) * 60
}

/**
 * 
 * @param pixel 
 * 
 */
export function pixelToTime (pixel: number) {
    return (pixel / 60) * cellPixels(store.getState()['makers']['zoomLevel'])
}