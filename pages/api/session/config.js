// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req, res) => {
    if (req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({
            status: 200,
            message: '',
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
