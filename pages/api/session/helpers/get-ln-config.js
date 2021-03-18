import axios from "axios";
import getConfig from "next/config";
import axiosRetry from "axios-retry";

import { constants } from '../../../../config';
const {serverRuntimeConfig} = getConfig();

export default async function getLnConfig() {
    try {
        axiosRetry(axios, { retries: constants.AXIOS_RETRY_CNT });
        const {data} = await axios({
            method: 'GET',
            url: `https://${serverRuntimeConfig.LN_API_URL}/vod/api/v2/Configuration?ClientId=${constants.LN_CLIENT_ID}`,
            headers: {
                "x-api-key": serverRuntimeConfig.LN_API_KEY
            }
        });

        return {
            lnConfig: data
        }

    } catch (e) {
        return {
            lnConfig: null
        }
    }


}
