export default class Genres {
    constructor(data, type) {
        this.genres = data.genres[`${type}_genres`];
    }

    toJSON() {
        return {
            genres: this.genres,
        }
    }
}
