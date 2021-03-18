import axios from "axios";
import axiosRetry from "axios-retry";
import jwt_decode from 'jwt-decode';
import absoluteUrl from "next-absolute-url";
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();
import {constants} from '../../config';
import {guid} from '../../helpers/utils/strings';


export default async function getSession(req, res) {
    if (typeof window === "undefined") {
        const headers = JSON.parse(JSON.stringify(req.headers));
        const xForwardedProto = headers['x-forwarded-proto'] || headers['X-Forwarded-Proto'] || null;

        const {protocol, host} = absoluteUrl(req);


        // ============= GUID COOKIE ===========================
        const cookies = parseCookies({req, res});
        let guidCookie = cookies[`_${constants.COOKIE_PREFIX}_guid`];
        if (!guidCookie) {
            guidCookie = guid();
            setCookie({req, res}, `_${constants.COOKIE_PREFIX}_guid`, guidCookie, {
                expires: constants.COOKIE_NO_EXPIRE,
                sameSite: 'Lax',
                secure: xForwardedProto === 'https',
                path: '/'
            });
        }
        // ============= END GUID COOKIE =======================
        // ============= LN CONFIG =====================
        let config = null;
        try {
            const {data} = await axios({
                method: 'GET',
                url: `${protocol}//${host}/api/session/config`,
            });

            config = {
                ...data.config,
                xForwardedProto: xForwardedProto,
            };
        } catch(e) {
            config = {}
        }
        // ============= LN CONFIG END =====================

        return {
            session: {
                guid: guidCookie
            },
            config: {
                ...config,
                xApiKey: serverRuntimeConfig.LN_API_KEY
            }
        }
    }
}
