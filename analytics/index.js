import {sendWebVitals} from './web-vitals';
import {sendToGoogleAnalytics} from './send-ga';
import {sendToSegment} from './send-segment';

module.exports = {
    sendToGoogleAnalytics,
    sendWebVitals,
    sendToSegment
};
