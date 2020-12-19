import { appData } from '../config'
import { parseFileNameFromPath } from '../utils/file'

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
}

export default Transcoder