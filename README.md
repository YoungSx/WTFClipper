# WTFClipper
A video editor.

# Dev
## Requirements
* ffmpeg
* node.js
## Install
```bash
npm install
```
## Run
```bash
npm run start
npm run start-electron
```

# TODO
- [ ] Tracks module
  - [x] Display from store
  - [x] Drag to change time
  - [x] Sync time to store
  - [x] Trim
  - [x] Delete
  - [x] Clip
  - [ ] Change order
  - [ ] Derail
  - [ ] Separate video/audio
  - [x] zoom
- [ ] Preview module
  - [ ] Basic video joint preview
- [ ] Resource library
  - [x] Add private file to database & pre-transcode
  - [ ] Display private file
    - [x] Display from database
    - [x] Display cover image
  - [x] Drag to tracks
  - [x] Insert new track
- [ ] Transcode backend
  - [x] Generate cover image
  - [x] Get duration
  - [x] Clip & joint video
  - [ ] Separate video/audio
- [ ] ...
  - [ ] Filters
  - [ ] Transition
  - [ ] Something about AI
