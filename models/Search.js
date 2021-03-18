export default class Search {
    constructor(data) {
        if(data.data && data.data.hits && data.data.hits.length > 0){
            this.results = data.data.hits.map((r) => {
                const programmingType = (r.programming_type) ? r.programming_type : (r._source.programming_type) ? r._source.programming_type : null;
                return {
                    id: r._id,
                    title: r._source.title,
                    image: r.poster ? r.poster : r._source.poster ? r._source.poster : null,
                    slug: r.slug ? r.slug : r._source.slug ? r._source.slug : '',
                    type: programmingType === 'Series' ? 'shows' : programmingType === 'Live Broadcast' ? 'channels' : 'movies',
                }
            });
        } else {
            this.results = {};
        }
        //this.unformated = data;
    }

    toJSON() {
        return {
            results: {cards: this.results},
            //unformated: this.unformated
        }
    }
}
