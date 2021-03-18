import {slugify} from "../helpers/utils/strings";

export default class EPG {
    constructor(data) {
        this.channels = data.channels.map((c) => {
            const channel = c;
            return {
                id: channel._id,
                type: 'channel',
                name: channel.name,
                logo: channel.logo || '',
                wallpaper: channel.wallpaper || '',
                genres: channel.genres,
                slug: channel.slug || slugify(channel.name),
                videoId: channel.video_id || null,

                program: channel.program.map((p) => {
                    const program = p;
                    return {
                        title: program.program_title,
                        description: program.program_description,
                        duration: program.duration,
                        starts: program.starts_at,
                        ends: program.ends_at,
                        image: program.image,
                    }
                })
            }
        });
        //this.unformated = data;
    }

    toJSON() {
        return {
            channels: this.channels,
            //unformated: this.unformated
        }
    }
}
