import { appData } from '../config'
import { parseFileNameFromPath, UUID } from '../utils/file'
import { TRACKITEMTYPE, DescriptorModel, TrackVideoItemModel, TrackAudioItemModel } from '../model/type'

import { deepCopy } from '../utils/tool'

const child_process = require('child_process')

class Transcoder {
    generateCoverImage (input: string, dstName: string, callback?: any) {
        let outputPath = `${appData.COVER_DIR}/${dstName}.${appData.COVER_EXT}`
        let cmd = `ffmpeg -i ${input} -ss 1.0 -vframes 1 -vf scale=480:270 ${outputPath} -y`
        let result = child_process.exec(cmd, function(err: string, stdout: string, stderr: string){
            if (err) {
                callback(err)
            } else if (stdout) {
                callback(stdout)
            } else {
                callback(stderr)
            }
        })
    }

    generateBlackVideo (duration: number, frameRate: number, color: string, width: number, height: number, output: string, callback?: any) {
        let resolution = <string><any>width + 'x' + <string><any>height
        let cmd = `ffmpeg -f lavfi -i color=size=${resolution}:rate=${frameRate}:color=${color} -t ${duration / 1000} ${output}`
        let result = child_process.exec(cmd, function(err: string, stdout: string, stderr: string){
            if (err) {
                callback(err)
            } else if (stdout) {
                callback(stdout)
            } else {
                callback(stderr)
            }
        })
    }
    
    generateSilentAudio (duration: number, sampleRate: number = 44100, channelLayout: string, output: string, callback?: any) {
        let cmd = `ffmpeg -f lavfi -i anullsrc=channel_layout=${channelLayout}:sample_rate=${sampleRate} -t ${duration / 1000} ${output}`
        let result = child_process.exec(cmd, function(err: string, stdout: string, stderr: string){
            if (err) {
                callback(err)
            } else if (stdout) {
                callback(stdout)
            } else {
                callback(stderr)
            }
        })
    }

    mergeVideoAndAudio (inputV: string, inputA: string, output: string, callback?: any) {
        let cmd = `ffmpeg -i ${inputV} -i ${inputA} -vcodec copy -acodec copy ${output}`
        let result = child_process.exec(cmd, function(err: string, stdout: string, stderr: string){
            if (err) {
                callback(err)
            } else if (stdout) {
                callback(stdout)
            } else {
                callback(stderr)
            }
        })
    }

    getDuration (input: string, callback?: any) {
        let cmd = `ffprobe -show_entries format=duration -of default=nk=1:nw=1 ${input}`
        // 结果在 stdout 中, 正常 err 为 null
        let result = child_process.exec(cmd, (err: string, stdout: string, stderr: string) => {
            if (err) {
                callback(err)
            } else if (stdout) {
                callback(<number><unknown>stdout * 1000)
            } else {
                callback(stderr)
            }
        })
    }

    clipMedia (input: string, output: string, from: number, duration: number, callback?: any) {
        let cmd = `ffmpeg -ss ${from} -i ${input} -vcodec libx264 -acodec aac -t ${duration} ${output} -y`
        let result = child_process.exec(cmd, (err: string, stdout: string, stderr: string) => {
            if (err) {
                callback(err)
            } else if (stdout) {
                callback(<number><unknown>stdout * 1000)
            } else {
                callback(stderr)
            }
        })
    }

    produce (descriptor: DescriptorModel) {
        const getGlobalVideoDuration = (descriptor: DescriptorModel) => {
            let maxDuration = 0
            descriptor.tracks.forEach(track => {
                let lastItem = track.items[track.items.length - 1]
                if (lastItem.type === TRACKITEMTYPE.VIDEO && lastItem.from + lastItem.clip_duration > maxDuration) maxDuration = lastItem.from + lastItem.clip_duration
            })
            return maxDuration
        }

        const getGlobalAudioDuration = (descriptor: DescriptorModel) => {
            let maxDuration = 0
            descriptor.tracks.forEach(track => {
                let lastItem = track.items[track.items.length - 1]
                if (lastItem.type === TRACKITEMTYPE.AUDIO && lastItem.from + lastItem.clip_duration > maxDuration) maxDuration = lastItem.from + lastItem.clip_duration
            })
            return maxDuration
        }

        const generateBackground = (descriptor: DescriptorModel, output: string, duration: number,
                                    frameRate: number, width: number, height: number,
                                    sampleRate: number, channelLayout: string, callback?: any) => {
            let outputPathV = `${appData.CACHE_DIR}/${descriptor.id}_background_v.mp4`
            let backgroundVideoItem: TrackVideoItemModel = {
                id: UUID(),
                rid: UUID(), // emmm...
                type: TRACKITEMTYPE.VIDEO,
                clip_from: 0,
                clip_duration: duration,
                from: 0,
                path: outputPathV
            }

            let outputPathA = `${appData.CACHE_DIR}/${descriptor.id}_background_a.aac`
            let backgroundAudioItem: TrackAudioItemModel = {
                id: UUID(),
                rid: UUID(), // emmm...
                type: TRACKITEMTYPE.AUDIO,
                clip_from: 0,
                clip_duration: duration,
                from: 0,
                path: outputPathA
            }

            let transcoder = new Transcoder()
            console.log('start video...')
            transcoder.generateBlackVideo(duration, frameRate, 'black', width, height, outputPathV, (r: any) => {
                console.log(r)
                console.log('start video...')
                transcoder.generateSilentAudio(duration, sampleRate, channelLayout, outputPathA, (r: any) => {
                    console.log(r)
                    console.log('start merge...')
                    transcoder.mergeVideoAndAudio(outputPathV, outputPathA, output, (r: any) => {
                        console.log(r)
                    })
                })
            })

            return descriptor
        }

        let outputPath = `${appData.CACHE_DIR}/${descriptor.id}_background.mp4`
        let globalVideoDuration = getGlobalVideoDuration(descriptor)
        let globalAudioDuration = getGlobalAudioDuration(descriptor)
        let globalDuration = globalVideoDuration > globalAudioDuration ? globalVideoDuration : globalAudioDuration

        generateBackground(deepCopy(descriptor), outputPath, globalDuration,
            30, 1920, 1080, 44100, 'stereo', () => {
                console.log('merge finished')
                /**
                 * TODO:
                 *  1. clip & join
                 *  2. picture in picture
                 */
                
            }
        )
    }
}

export default Transcoder