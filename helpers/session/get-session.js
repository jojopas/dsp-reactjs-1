import axios from "axios";
import absoluteUrl from "next-absolute-url";
import { parseCookies, setCookie } from 'nookies';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();
import {constants} from '../../config';
import {guid} from '../../helpers/utils/strings';


export default async function getSession(req, res) {
    if (typeof window === "undefined") {
        const headers = JSON.parse(JSON.stringify(req.headers));
        const xForwardedProto = headers['x-forwarded-proto'] || headers['X-Forwarded-Proto'] || null;

        const {protocol, host} = absoluteUrl(req);

        const dspTokenObj = serverRuntimeConfig.DSP_TOKEN ? JSON.parse(serverRuntimeConfig.DSP_TOKEN) : null;


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

        return {
            session: {
                guid: guidCookie
            },
            config: {
                dspToken: dspTokenObj && dspTokenObj.token,
            }
        }
    }
}
