import { appData } from '../config'
import { parseFileNameFromPath, UUID } from '../utils/file'
import { TRACKITEMTYPE, DescriptorModel, TrackModel, TrackVideoItemModel, TrackAudioItemModel } from '../model/type'

import { deepCopy } from '../utils/tool'

const child_process = require('child_process')
const fs = require('fs')

class Transcoder {
    extractVideo (input: string, output: string) {
        let cmd = `ffmpeg -i ${input} -an -y -acodec copy ${output}`
        return new Promise((resolve, reject) => {
            child_process.exec(cmd, (err: string, stdout: string, stderr: string) => {
                if (err) {
                    resolve(err)
                } else if (stdout) {
                    resolve(stdout)
                } else {
                    resolve(stderr)
                }
            })
        })
    }

    extractAudio (input: string, output: string) {
        let cmd = `ffmpeg -i ${input} -vn -y -acodec copy ${output}`
        return new Promise((resolve, reject) => {
            child_process.exec(cmd, (err: string, stdout: string, stderr: string) => {
                if (err) {
                    resolve(err)
                } else if (stdout) {
                    resolve(stdout)
                } else {
                    resolve(stderr)
                }
            })
        })
    }

    generateCoverImage (input: string, dstName: string, callback?: any) {
        let outputPath = `${appData.COVER_DIR}/${dstName}.${appData.COVER_EXT}`
        let cmd = `ffmpeg -i ${input} -ss 1.0 -vframes 1 -vf scale=480:270 ${outputPath} -y`
        let result = child_process.exec(cmd, function(err: string, stdout: string, stderr: string){
            if (err) {
                callback(err)
            } else if (stderr) {
                callback(outputPath)
            } else {
                callback(outputPath)
            }
        })
    }

    generatePreviewVideo (input: string) {
        let { nameWithoutExt } = parseFileNameFromPath(input)
        let outputPath = `${appData.CACHE_DIR}/${nameWithoutExt}_preview.mp4`
        let cmd = `ffmpeg -i ${input} -vf scale=720:360 ${outputPath} -y`
        return new Promise((resolve, reject) => {
            child_process.exec(cmd, (err: string, stdout: string, stderr: string) => {
                if (err) {
                    resolve(err)
                } else if (stdout) {
                    resolve(outputPath)
                } else {
                    resolve(stderr)
                }
            })
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

    clipMedia (input: string, output: string, from: number, duration: number) {
        let cmd = `ffmpeg -ss ${from / 1000} -i ${input} -vcodec libx264 -acodec aac -t ${duration / 1000} ${output} -y`
        return new Promise((resolve, reject) => {
            child_process.exec(cmd, (err: string, stdout: string, stderr: string) => {
                if (err) {
                    resolve(err)
                } else if (stdout) {
                    resolve(stdout)
                } else {
                    resolve(stderr)
                }
            })
        })
    }

    overlayBackground (backgroudnInput: string, input1: string, from: number, output: string) {
        let cmd = `ffmpeg -itsoffset ${from / 1000} -i ${input1} -i ${backgroudnInput} -lavfi "[0:v]scale=1920:1080[a];[1:v][a]overlay=0:0:eof_action=pass[c]" -map [c] -c:v libx264 ${output} -y`
        return new Promise((resolve, reject) => {
            child_process.exec(cmd, (err: string, stdout: string, stderr: string) => {
                if (err) {
                    resolve(err)
                } else if (stdout) {
                    resolve(stdout)
                } else {
                    resolve(stderr)
                }
            })
        })
    }

    async composeVideoTrack (track: TrackModel, backgroundPath: string, composedPath: string) {
        let output = ''
        let input = backgroundPath
        let transcoder = new Transcoder()

        for (let i = 0; i < track.items.length; i++) {
            let item = track.items[i]
            let segment = `${appData.CACHE_DIR}/${item.id}_clip.mp4`

            if (item.path !== undefined)
                await transcoder.clipMedia(item.path, segment, item.clip_from, item.clip_duration)
            
            // specify the final name
            if (i === track.items.length - 1) output = composedPath
            else output = `${appData.CACHE_DIR}/${item.id}_composed.mp4`

            await transcoder.overlayBackground(input, segment, item.from, output)

            // delete clip temp file
            fs.unlink(segment, () => {})
            fs.unlink(input, () => {})

            input = output
        }

        return output
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
                                    sampleRate: number, channelLayout: string) => {
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

            return new Promise((resolve, reject) => {
                console.log('start video...')
                transcoder.generateBlackVideo(duration, frameRate, 'black', width, height, outputPathV, (r: any) => {
                    console.log(r)
                    console.log('start video...')
                    transcoder.generateSilentAudio(duration, sampleRate, channelLayout, outputPathA, (r: any) => {
                        console.log(r)
                        console.log('start merge...')
                        transcoder.mergeVideoAndAudio(outputPathV, outputPathA, output, (r: any) => {
                            console.log(r)

                            // delete temp file
                            fs.unlink(outputPathA, () => {})
                            fs.unlink(outputPathV, () => {})

                            resolve(output)
                        })
                    })
                })
            })
        }

        let bgPath = `${appData.CACHE_DIR}/${descriptor.id}_background.mp4`
        let globalVideoDuration = getGlobalVideoDuration(descriptor)
        let globalAudioDuration = getGlobalAudioDuration(descriptor)
        let globalDuration = globalVideoDuration > globalAudioDuration ? globalVideoDuration : globalAudioDuration

        let bgPromise = generateBackground(deepCopy(descriptor), bgPath, globalDuration, 30, 1920, 1080, 44100, 'stereo')
        bgPromise.then(async () => {
            let transcoder = new Transcoder()
            let composedPath = ''
            let lastPath = bgPath

            for (let trackIndex = descriptor.tracks.length - 1; trackIndex >= 0; trackIndex--) {
                composedPath = `${appData.CACHE_DIR}/track_${descriptor.tracks[trackIndex].id}_composed.mp4`
                
                await transcoder.composeVideoTrack(descriptor.tracks[trackIndex], lastPath, composedPath)

                lastPath = composedPath
            }

            console.log('final path:', lastPath)
        })
    }
}

export default Transcoder