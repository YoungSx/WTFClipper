export enum FILETYPE {
    VIDEO = 'video',
    AUDIO = 'audio',
    PICTURE = 'picture',
    UNKNOWN = 'unknown'
}

export enum TRACKITEMTYPE {
    VIDEO = 'video',
    AUDIO = 'audio',
    PICTURE = 'picture'
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
    rid: string,
    type: TRACKITEMTYPE,
    clip_from: number,
    clip_duration: number,
    from: number,
    path?: string
}

export interface TrackMediaItemModel extends TrackItemModel {
}

export interface TrackVideoItemModel extends TrackItemModel {
    type: TRACKITEMTYPE.VIDEO
}

export interface TrackAudioItemModel extends TrackItemModel {
    type: TRACKITEMTYPE.AUDIO
}

export interface TrackModel {
    id: string,
    items: Array<TrackItemModel>
}

export interface MakersStoreModel {
    tracks: Array<TrackModel>,
    itemSelections: Array<any>,
    duration: number,
    zoomLevel: number
}

export interface DescriptorModel {
    id: string,
    createTime: number,
    updateTime: number,
    tracks: Array<TrackModel>
}

export interface PrivateStoreModel {
    private: {
        media: Array<MediaFileType>
    }
}
