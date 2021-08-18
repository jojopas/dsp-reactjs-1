export default class Search {
    constructor(data) {
       if (data.channels && data.channels.length > 0) {
           this.results = data.channels.map((c) => {
               const channel = c;
               return {
                   id: channel._id,
                   title: channel.title,
                   image: channel.poster ? channel.poster : null,
                   slug: channel.slug,
                   type:
                       channel.programming_type === "Series"
                           ? "shows"
                           : channel.programming_type === "Live Broadcast"
                           ? "channels"
                           : "movies",
               };
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
