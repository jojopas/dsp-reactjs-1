import getConfig from 'next/config';
import {parseCookies} from 'nookies';
import {constants} from '../config';

const {publicRuntimeConfig} = getConfig();

const sendToSegment = (type, data= {}) => {
    if(window && window.analytics) {
        const cookies = parseCookies();
        const timestamp = new Date().toISOString();
        switch (type) {
            case 'page':
                analytics.page({
                    source_version: publicRuntimeConfig.APP_VERSION,
                    source_name: "LocalNowApp",
                    channel_id: cookies[`_${constants.COOKIE_PREFIX}_myMarket`],
                    session_id: `${cookies[`_${constants.COOKIE_PREFIX}_guid`]}${timestamp}`
                });
                break;
            case 'track':
                if(data.event) {
                    const evt = data.event;
                    delete data.event;
                    analytics.track(evt, data);
                }
                break;
            default:
                break;
        }
    }
};

module.exports = {
    sendToSegment
};
