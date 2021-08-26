import {isEmpty} from '../helpers/utils/objects';
import {constants} from '../config';

export default class PDP {
    constructor(data) {
        const pdp = data.channels[0];
        if(!pdp){
            this.pdp = {};
        } else if ((!pdp.video || (pdp.video && isEmpty(pdp.video))) && (!pdp.playlist || pdp.playlist.length === 0) && (!pdp.childchannels || pdp.childchannels.length === 0)){
            this.pdp = {};
        } else {
            this.pdp = {
                id: pdp._id,
                title: pdp.title,
                poster: pdp.poster || '',
                wallpaper: pdp.wallpaper || '',
                description: pdp.description,
                shortDescription: pdp.short_description ? pdp.short_description : pdp.video && pdp.video.short_description ? pdp.video.short_description : pdp.description,
                duration: (pdp.video && pdp.video.duration) ? pdp.video.duration : 0,
                year: pdp.year,
                rating: pdp.rating,
                genres: pdp.genres,
                tags: pdp.tags,
                trailer: (pdp.trailer && pdp.trailer.video_id) ? pdp.trailer.video_id : null,
                videoId: pdp.video && pdp.video._id || null
            };

            if (pdp.childchannels && pdp.childchannels.length > 0) {
                const seasons = pdp.childchannels.map((c, index) => {
                    const episodes = c.playlist;
                    return {
                        season: {
                            number: episodes[0].season ? episodes[0].season : index+1,
                            episodes: episodes.length.toString(),
                        },
                        cards: episodes.map((e) => {
                            const episode = e;
                            return {
                                id: episode._id,
                                title: episode.title,
                                description: episode.short_description,
                                image: `${constants.DSP_IMG_PREFIX}${episode.thumb}` || null,
                                slug: episode.slug,
                                episode: episode.episode,
                                duration: episode.duration,
                            }
                        })
                    }
                });
                this.pdp.seasons = seasons;
            }
        }
        //this.unformated = data;
    }

    toJSON() {
        return {
            pdp: this.pdp,
            //unformated: this.unformated
        }
    }
}
