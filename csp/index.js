const {cspConfig} = require('./csp');
const {toKebabCase} = require('./to-kebab-case');

function parseCspConfig() {
    const { directives } = cspConfig;
    let cspString = '';
    const entries = Object.entries(directives);
    entries.forEach((entry) => {
        // making sure entry has actually values
        if (entry[1].length > 0) {
            // add key of object in kebab-case
            cspString += `${toKebabCase(entry[0])}`;
            entry[1].forEach((val) => {
                cspString += ` ${val}`;
            });
            cspString += '; ';
        }
    });
    // strip off '; ' last one as it's not needed
    return cspString.substring(0, cspString.length - 2);
}

module.exports = {
    csp: parseCspConfig()
};
