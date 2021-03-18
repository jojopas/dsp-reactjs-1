import axios from "axios";
import axiosRetry from "axios-retry";
import absoluteUrl from "next-absolute-url";
import { parseCookies, setCookie, destroyCookie } from 'nookies';

import {constants} from '../../config';

async function pageBuilder(opt) {
    let page = {};
    let expIdCookie;
    let marketIdCookie;
    const {session, config, routes, req, res} = opt;

    if (session) {
        const {protocol, host} = absoluteUrl(req);
        try {
            axiosRetry(axios, { retries: constants.AXIOS_RETRY_CNT });
            const allPageRequests = routes.map((r) => {
                    let method = 'GET';
                    let payload;
                    if(r.includes('/api/ln/promotion')) {
                        const { promotionsEndpointUrl } = config.localNow;
                        const cookies = parseCookies({req, res});
                        marketIdCookie = cookies[`_${constants.COOKIE_PREFIX}_myCity`];
                        const marketId = marketIdCookie && JSON.parse(marketIdCookie).market;
                        method = 'POST';
                        payload = {
                            url: promotionsEndpointUrl,
                            type: r.substring(r.lastIndexOf('/') + 1),
                            marketId: marketId
                        };
                    }
                    else if (r === '/api/ln/get-my-mix') {
                        const { myMixPlaybackEndpointUrl } = config.localNow.playback;
                        const { guid } = session;
                        const cookies = parseCookies({req, res});
                        expIdCookie = cookies[`_${constants.COOKIE_PREFIX}_experienceId`];
                        marketIdCookie = cookies[`_${constants.COOKIE_PREFIX}_myCity`];
                        const marketId = marketIdCookie && JSON.parse(marketIdCookie).market;

                        method = 'POST';
                        payload = {
                            url: myMixPlaybackEndpointUrl,
                            guid,
                            experienceIdFromCookie: expIdCookie,
                            marketId: marketId
                        };
                }

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
