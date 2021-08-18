// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getDSPToken from "./helpers/get-dsp-token";

export default async (req, res) => {
    if (req.method === 'GET') {
        const {dspToken} = await getDSPToken();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({
            status: 200,
            message: '',
            session: {
                dspToken: dspToken
            }
        }));
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({
            status: 200,
            message: 'Method not supported'
        }));
    }
}
