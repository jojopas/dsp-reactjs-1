export default class MyMix {
    constructor(data) {
        this.myMix = {
            experienceId: data.experienceId,
            videos: data.videos.map((v) => {
                return {
                    assetId: v.assetId,
                    description: v.description,
                    durationSeconds: v.durationSeconds,
                    imageThumbUrl: v.imageThumbUrl,
                    imageUrl: v.imageUrl,
                    rating: (v.rating.toString() === '0') ? '' : v.rating,
                    title: v.title,
                    version: v.version,
                    categories: v.categories,
                    season: v.season,
                    episode: v.episode,
                }
            })
        }
    }

    toJSON() {
        return {
            myMix: this.myMix,
        }
    }
}
