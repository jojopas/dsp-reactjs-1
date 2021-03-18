export default class MyMixVideo {
    constructor(videoData, vmap) {
        this.myMixVideo = {
            url: videoData.url,
            vmap: vmap
        };
    }

    toJSON() {
        return {
            myMixVideo: this.myMixVideo,
        }
    }
}
