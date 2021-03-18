import axios from 'axios';
import axiosRetry from 'axios-retry';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();
import { constants } from '../../../config';
import unauthorized from "../../../helpers/auth/unauthorized";
import { City, CitySearch, Promotions, MyMix, MyMixVideo } from '../../../models';
import {validateCors} from "../../../helpers/cors";

export default async (req, res) => {
    await validateCors(req, res);
    let {
        query: { lnRoute },
        body: {
            type,
            url,
            guid,
            playback,
            advertising,
            noOfMyMixItems,
            experienceIdFromCookie,
            marketId,
            zipcode,
            senderName,
            senderEmailAddress,
            device,
            provider,
            message
        }
    } = req;

    const allLnRequests = [];

    if (lnRoute[0] === 'get-my-mix') {
        const queryParams = {
            ClientId: constants.LN_CLIENT_ID,
            UserId: guid,
            MixPercentage: constants.MY_MIX_PERCENTAGE,
            MarketId: marketId || constants.MY_MIX_DEFAULT_MARKET,
            NumberOfItems: noOfMyMixItems || constants.MY_MIX_NO_OF_ITEMS,
            ExperienceId: experienceIdFromCookie
        };

        const axiosOptions = {
            url: url,
            method: 'GET',
            headers: {
                'x-api-key': serverRuntimeConfig.LN_API_KEY
            },
            params: queryParams
        }
        allLnRequests.push(axios(axiosOptions));

    } else if (lnRoute[0] === 'get-video') {
        const {AssetId, Version} = playback;
        const playbackQueryParams = {
            ClientId: constants.LN_CLIENT_ID,
            AssetId: AssetId,
            Version: Version
        };
        allLnRequests.push(axios({
            url: playback.url,
            method: 'GET',
            headers: {
                'x-api-key': serverRuntimeConfig.LN_API_KEY
            },
            params: playbackQueryParams
        }));

        /*const {Video_Id, Video_Version, Page_Url, Device_DeviceType, Player_Width, Player_Height} = advertising;
        const adQueryParams = {
            Device_DeviceType: Device_DeviceType,
            //ClientId: constants.LN_CLIENT_ID,
            Video_Id: Video_Id,
            Video_Version: Video_Version,
            Player_Width: Player_Width,
            Player_Height: Player_Height,
            App_Bundle: 'com.localnow',
            App_Name: 'Local Now',
            Device_Ifa: '',
            Device_Make: '',
            Device_Model: '',
            Vpi: 'MP4',
            Page_Url: Page_Url,
            User_Gender: '',
            User_Yob: ''
        };
        allLnRequests.push(axios({
            url: advertising.url,
            method: 'GET',
            headers: {
                'x-api-key': serverRuntimeConfig.LN_API_KEY
            },
            params: adQueryParams
        }));*/
    } else if (lnRoute[0] === 'city') {
        const queryParams = {};
        const axiosOptions = {
            url: url,
            method: 'GET',
            headers: {
                'x-api-key': serverRuntimeConfig.LN_API_KEY
            },
            params: queryParams
        }
        allLnRequests.push(axios(axiosOptions));
    } else if (lnRoute[0] === 'city-search') {
        const queryParams = {
            Text: zipcode,
        };
        const axiosOptions = {
            url: url,
            method: 'GET',
            headers: {
                'x-api-key': serverRuntimeConfig.LN_API_KEY
            },
            params: queryParams
        }
        if (zipcode !== '') {
            allLnRequests.push(axios(axiosOptions));
        }
    } else if (lnRoute[0] === 'send-feedback') {
        const queryParams = {
            SenderName: senderName,
            SenderEmailAddress: senderEmailAddress,
            Zipcode: zipcode,
            Device: device,
            Provider: provider,
            Message: message
        };
        const axiosOptions = {
            url: `https://${serverRuntimeConfig.LN_API_URL}${constants.LN_API_PREFIX}/Feedback`,
            method: 'GET',
            headers: {
                'x-api-key': serverRuntimeConfig.LN_API_KEY
            },
            params: queryParams
        }
        allLnRequests.push(axios(axiosOptions));
    } else {
        const queryParams = {
            ClientId: constants.LN_CLIENT_ID,
            MarketId: marketId || constants.MY_MIX_DEFAULT_MARKET
        };
        const axiosOptions = {
            url: url,
            method: 'GET',
            headers: {
                'x-api-key': serverRuntimeConfig.LN_API_KEY
            },
            params: queryParams
        }
        allLnRequests.push(axios(axiosOptions));
    }

    axiosRetry(axios, { retries: constants.AXIOS_RETRY_CNT });
    const data = (await Promise.all(allLnRequests)).map((a) => { return a.data; });
    let pageData = data;

    // Promotions Model
    if (lnRoute[0] === 'promotion') {
        pageData = new Promotions(data[0], type);
    } else if (lnRoute[0] === 'get-my-mix') {
        pageData = new MyMix(data[0]);
    } else if (lnRoute[0] === 'get-video') {
        //pageData = new MyMixVideo(data[0], data[1]);
        pageData = new MyMixVideo(data[0], null);
    } else if (lnRoute[0] === 'city') {
        pageData = new City(data[0]);
    } else if (lnRoute[0] === 'city-search') {
        pageData = new CitySearch(data[0] || []);
    } else if (lnRoute[0] === 'send-feedback') {
        pageData = data;
    }
    /*res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({status: 200, data: pageData}))*/

    res.status(200).json({ data: pageData });
}
