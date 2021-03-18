// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({
        id: '1234-1234-1234-1234',
        name: 'John Doe',
        age: 57,
        foo: 'bar'
    }));
}
