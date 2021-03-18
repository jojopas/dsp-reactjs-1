import axios from "axios";
import getConfig from "next/config";
import axiosRetry from "axios-retry";

import {constants} from '../../../../config';
const {serverRuntimeConfig} = getConfig();

export default async function getDSPToken() {
    try {
        axiosRetry(axios, { retries: constants.AXIOS_RETRY_CNT });
        const {data} = await axios({
            method: 'POST',
            url: `https://${serverRuntimeConfig.DSP_API_URL}/token`,
            data: {key: serverRuntimeConfig.DSP_API_KEY}
        });

        return {
            dspToken: data.token
        }

    } catch (e) {
        return {
            dspToken: null
        }
    }


}
