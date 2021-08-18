// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
    const {
        query: { userId },
    } = req;

    if (req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({
            id: userId,
            name: 'John Doe',
            age: 57,
            foo: 'bar'
        }));
    } else {
        // res.statusCode = 403
        // res.json({
        //     message: "Forbidden"
        // });
    }


}
