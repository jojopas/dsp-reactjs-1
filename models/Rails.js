export default class Rails {
    constructor(data) {
        //this.cnt = 0;
        if(Array.isArray(data)) {
            this.rails = data.map((r) => {
                const category = r.category;
                const channels = r.channels;

                return {
                    category: {
                        id: category._id,
                        name: category.name,
                        displayType: category.display_type,
                    },
                    cards: channels.map((c) => {
                        //this.cnt = this.cnt + 1;
                        const channel = c;
                        return {
                            id: channel._id,
                            title: channel.title,
                            image: channel.poster ? channel.poster : null,
                            slug: channel.slug,
                            type: channel.programming_type === 'Series' ? 'shows' : channel.programming_type === 'Live Broadcast' ? 'channels' : 'movies',
                        }
                    })
                }
            });
        } else {
            if(data.channels.length > 0) {
                this.rails = [
                    {category: {}}
                ];
                this.rails[0].cards = data.channels.map((c) => {
                    //this.cnt = this.cnt + 1;
                    const channel = c;
                    return {
                        id: channel._id,
                        title: channel.title,
                        image: channel.poster ? channel.poster : null,
                        slug: channel.slug,
                        type: channel.programming_type === 'Series' ? 'shows' : channel.programming_type === 'Live Broadcast' ? 'channels' : 'movies',
                    }
                });
            } else {
                this.rails = [];
            }
        }
        //this.unformated = data;
    }

    toJSON() {
        //console.log('card count', this.cnt);
        return {
            rails: this.rails,
            //unformated: this.unformated
        }
    }
}
