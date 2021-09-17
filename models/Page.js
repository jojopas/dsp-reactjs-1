import {isEmpty} from '../helpers/utils/objects';

export default class Page {
    constructor(data) {
        const page = data.page;
        if(data.page && !isEmpty(page)) {
            this.page = {
                name: page.page_name,
                html: page.html ? page.html.replace(/(?:\r\n|\r|\n)/g, '<br>') : null,
                seo: page.seo,
            };
        } else {
            this.page = {};
        }
        //this.unformated = data;
    }

    toJSON() {
        //this.page.unformated = this.unformated;
        return this.page;
    }
}
