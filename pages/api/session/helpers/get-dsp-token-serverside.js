const axios = require("axios");
const axiosRetry = require("axios-retry");

const {constants} = require('../../../../config');

const getDSPToken = async () => {
    const DSP_API_URL = process.env.DSP_API_URL || constants.ENV_DSP_API_URL;
    const DSP_API_KEY = process.env.DSP_API_KEY || constants.ENV_DSP_API_KEY;
    try {
        axiosRetry(axios, { retries: constants.AXIOS_RETRY_CNT });
        const {data} = await axios({
            method: 'POST',
            url: `https://${DSP_API_URL}/token`,
            data: {key: DSP_API_KEY}
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

module.exports.getDSPToken = getDSPToken;
