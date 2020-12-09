export interface BaseFileType {
    id: string,
    name: string,
    displayName: string,
    type: string
}

export interface MediaFileType extends BaseFileType {
    path: string
}

export interface VideoFileType extends MediaFileType {
    type: 'video'
}

export interface AudioFileType extends MediaFileType {
    type: 'audio'
}

export interface PictureFileType extends MediaFileType {
    type: 'picture'
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
        media: Array<BaseFileType>
    }
}
