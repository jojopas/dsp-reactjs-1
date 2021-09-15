import {isEmpty} from '../helpers/utils/objects';

export default class Page {
    constructor(data) {
        const page = data.page;
        if(data.page && !isEmpty(page)) {
            this.page = {
                name: page.page_name,
                html: page.html.replace(new RegExp('\r?\n','g'), '<br />'),
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
