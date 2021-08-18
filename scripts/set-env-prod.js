const axios = require('axios');
const fs = require('fs');
const { constants } = require("../config");

var DSP_API_KEY_DEFAULT = constants.ENV_DSP_API_KEY;
var DSP_API_KEY_ENV = DSP_API_KEY;
var DSP_API_KEY = DSP_API_KEY || DSP_API_KEY_DEFAULT;
console.log(`Running from ${__dirname}`);

console.log(`Attempting to request token from DSP using API Key "${DSP_API_KEY}"...`);
axios
  .post('https://api.myspotlight.tv/token', {
    key: DSP_API_KEY
  })
  .then(res => {
    var fileName = ".env.production";
    console.log(`Received a token:`);
    console.log(res.data);
    
    try {
        fs.unlinkSync(fileName);
        console.log('Successfully deleted ' + fileName);
    } catch (err) {
        console.log("Failed to delete " + fileName)
    }

    try {
        console.log("Writing to file: " + fileName);
        fs.writeFile(fileName, "DSP_TOKEN=" + JSON.stringify(res.data), err => {
            if (err) {
                console.error(`Failed to write to file: ${err}`);
                return;
            }
        });
    } catch (err) {
        console.log("Failed to delete " + fileName)
    }
})
.catch(error => {
    console.error(`Failed to retrieve token: ${error}`);
  });