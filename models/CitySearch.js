export default class CitySearch {
    constructor(data) {
        this.cities = data;
    }

    toJSON() {
        return {
            cities: this.cities,
        }
    }
}
