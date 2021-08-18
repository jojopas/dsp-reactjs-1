import {randomNum} from '../helpers/utils/numbers';

export default class Promotions {
    constructor(data, type) {
        if(!data || !data[type]){
            this.promos = {};
        } else {
            this.promos = data[type].map((p) => {
                if (p.isEnabled) {
                    return {
                        id: `promo_${randomNum()}`,
                        title: p.title || null,
                        image: p.imageUrl,
                        slug: p.linkUrl,
                    }
                }

                return null;
            }).filter((el) => el);
            //this.unformated = data;
        }
    }

    toJSON() {
        return {
            promos: this.promos,
        }
    }
}
