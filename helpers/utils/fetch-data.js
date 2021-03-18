import axios from "axios";

const fetchData = async (url, options = {}) => await axios({
    method: options.method || 'GET',
    url: url,
    data: options || undefined
});

module.exports = {
    fetchData
};
