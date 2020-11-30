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

export interface PrivateStoreModel {
    private: {
        media: [
            BaseFileType
        ]
    }
}
