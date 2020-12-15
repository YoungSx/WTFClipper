export enum FILETYPE {
    VIDEO = 'video',
    AUDIO = 'audio',
    PICTURE = 'picture',
    UNKNOWN = 'unknown'
}

export interface BaseFileType {
    id: string,
    name: string,
    displayName: string,
    type: FILETYPE
}

export interface MediaFileType extends BaseFileType {
    path: string,
    duration: number
}

export interface VideoFileType extends MediaFileType {
    type: FILETYPE.VIDEO
}

export interface AudioFileType extends MediaFileType {
    type: FILETYPE.AUDIO
}

export interface PictureFileType extends MediaFileType {
    type: FILETYPE.PICTURE
}

export interface TrackItemModel {
    id: string,
    clip_from: number,
    clip_duration: number,
    from: number
}

export interface TrackModel {
    id: string,
    items: Array<TrackItemModel>
}

export interface MakersStoreModel {
    tracks: Array<TrackModel>,
    selectedTrackItemsId: Array<any>
}

export interface PrivateStoreModel {
    private: {
        media: Array<MediaFileType>
    }
}
