import axios from "axios";

const fetchData = async (url, options = {}) => await axios({
    method: options.method || 'GET',
    url: url,
    data: options || undefined,
    headers: {
        'x-access-token': options.authorization
    }
});

module.exports = {
    fetchData
};
