export default function unauthorized(res) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({status: 401, message: 'Unauthorized'}));
};
