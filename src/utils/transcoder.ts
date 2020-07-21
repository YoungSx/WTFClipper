import { appData } from '../config'
import { parseFileNameFromPath } from '../utils/file'

const child_process = require('child_process')

class Transcoder {
    generateCoverImage (input: string, callback?: any) {
        let outputPath = `${appData.COVER_DIR}/${parseFileNameFromPath(input).nameWithoutExt}.${appData.COVER_EXT}`
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
}

export default Transcoder