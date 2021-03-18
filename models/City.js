export default class City {
    constructor(data) {
        this.city = {
            name: data.city.cityStateName,
            market: data.city.market
        };
    }

    toJSON() {
        return {
            city: this.city,
        }
    }
}
