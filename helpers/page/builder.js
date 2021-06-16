import axios from "axios";
import axiosRetry from "axios-retry";
import absoluteUrl from "next-absolute-url";
import {constants} from '../../config';

async function pageBuilder(opt) {
    let page = {};
    const {session, config, routes, req, res} = opt;

    if (session) {
        const {protocol, host} = absoluteUrl(req);
        try {
            axiosRetry(axios, { retries: constants.AXIOS_RETRY_CNT });
            console.log('url', host);
            const allPageRequests = routes.map((r) => {
                    let method = 'GET';
                    let payload;
                    console.log('confif builder', config);
               
                return axios({
                    method: method,
                    url: `${protocol}//${host}${r}`,
                    data: payload
                });
            })

            const allData = (await Promise.all(allPageRequests)).map(res=>res.data).map((a) => a.data);
            allData.forEach((d) => {
                Object.keys(d).forEach((e, index) => {
                    page[`${e}`] = Object.values(d)[index];
                });
            });
        } catch (e) {
            page = {};
        }
    }

    return page;
}

module.exports = {
    pageBuilder
};
