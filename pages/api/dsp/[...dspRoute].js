import axios from "axios";
import axiosRetry from "axios-retry";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();
import { constants } from "../../../config";
import unauthorized from "../../../helpers/auth/unauthorized";
import { validateCors } from "../../../helpers/cors";
import {
    EPG,
    Genres,
    Page,
    PDP,
    Rails,
    Recommendation,
    Search,
} from "../../../models";

export default async (req, res) => {
    await validateCors(req, res);
    let {
        query: { dspRoute },
        body,
    } = req;
    const dspTokenObj = serverRuntimeConfig.DSP_TOKEN
        ? JSON.parse(serverRuntimeConfig.DSP_TOKEN)
        : null;
    const authorization = dspTokenObj ? dspTokenObj.token : null; // JUST WOW 2.0
    const ogRoute = dspRoute;
    dspRoute = dspRoute.join("/");

    /*console.log('=====================================');
    console.log(serverRuntimeConfig.DSP_TOKEN);
    console.log('=====================================');*/

    const platformRoutes = ["homepage", "movies", "series"];
    const countryRoutes = [
        "homepage",
        "movies",
        "series",
        "live/epg",
        "channels",
    ];
    const RailsModelRoutes = ["homepage", "movies", "series", "channels"];

    // Recommendation
    if (ogRoute[0] === "search") {
        if (ogRoute[1] === "recommendation") {
            dspRoute = `${ogRoute[0]}/${ogRoute[1]}/${ogRoute[2]}?q=${ogRoute[3]}&size=${constants.RECO_SIZE}`;
        } else {
            dspRoute = `${ogRoute[0]}?q=${ogRoute[1]}&size=${constants.SEARCH_SIZE}`;
        }
    }

    // Search
    if (ogRoute[0] === "find") {
        dspRoute = `find/channels/${constants.DSP_PLATFORM}?q=${ogRoute[1]}&size=${constants.SEARCH_SIZE}`;
    }

    // Genres
    let genres = "";
    if (ogRoute[2] === "genres") {
        genres = ogRoute[ogRoute.length - 1];
        const genreRoute = ogRoute.pop();
        dspRoute = ogRoute.join("/");
    }

    // Genre
    let genre = "";
    let genreType = "";
    if (ogRoute[1] === "genre") {
        //genre = encodeURIComponent(ogRoute[ogRoute.length-1].replace(/-/g,' '));
        //remove last two elements before creating dsp route.  these are for us to pass params to this page
        genre = encodeURIComponent(ogRoute.pop().replace(/-/g, " "));
        ogRoute.pop();
        genreType = ogRoute.pop();
        dspRoute = "channels";
        //https://api.myspotlight.tv/channels/US?genre=<genre>&programming_type=<movie || series>
    }
    let apiUrl = `https://${serverRuntimeConfig.DSP_API_URL}/${dspRoute}`;

    if (countryRoutes.includes(dspRoute)) {
        apiUrl = `${apiUrl}/${constants.DSP_COUNTRY}`;
    }

    if (platformRoutes.includes(dspRoute)) {
        apiUrl = `${apiUrl}/${constants.DSP_PLATFORM}`;
    }

    // Genre
    if (genre !== "") {
        apiUrl = `${apiUrl}?genre=${genre}&programming_type=${genreType}`;
    }
    console.log("url", apiUrl, dspRoute, ogRoute);
    const axiosOptions = {
        url: apiUrl,
        method: req.method,
        headers: {
            "x-access-token": authorization,
        },
    };

    if (req.method === "POST") {
        axiosOptions.body = JSON.stringify(body);
    }
    axiosRetry(axios, { retries: constants.AXIOS_RETRY_CNT });
    const { data } = await axios(axiosOptions);
    let pageData = data;

    // Rails Model
    if (RailsModelRoutes.includes(dspRoute)) {
        pageData = new Rails(genre !== "" ? data : data[dspRoute]);
    }

    //Genres Model
    else if (genres !== "") {
        pageData = new Genres(data, genres);
    }

    // EPG Model
    else if (dspRoute === "live/epg") {
        pageData = new EPG(data);
    }

    // PDP Model
    else if (ogRoute[0] === "channel") {
        pageData = new PDP(data);
    }
    // Recommendation Model
    else if (ogRoute[0] === "search") {
        pageData = new Recommendation(data);
    }

    // Recommendation Model
    else if (ogRoute[0] === "find") {
        pageData = new Search(data);
    }

    // Pages Model
    else if (dspRoute.includes("pages")) {
        pageData = new Page(data);
    }

    /*res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({status: 200, data: pageData}));*/

    res.status(200).json({ data: pageData });
};
