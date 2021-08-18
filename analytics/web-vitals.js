import {sendToGoogleAnalytics} from './send-ga';

const sendWebVitals = (metric) => {
    let value = metric.value;
    switch (metric.name) {
        case 'FCP': // first contentful paint
            // handle FCP results
            // console.log('FCP: ', metric);
            break;
        case 'LCP': // largets contentful paint
            // handle LCP results
            // console.log('LCP: ', metric);
            break;
        case 'CLS': // cumulative layout shift
            // console.log('CLS: ', metric);
            // handle CLS results
            value = metric.value * 1000;
            break;
        case 'FID': // first input delay
            // console.log('FID: ', metric);
            // handle FID results
            break;
        case 'TTFB': // time to first byte
            // console.log('TTFB: ', metric);
            // handle TTFB results
            break;
        case 'Next.js-hydration':
            // Length of time it takes for the page to start and finish hydrating (in ms)
            // handle hydration results
            // console.log('Next.js-hydration: ', metric);
            break;
        case 'Next.js-route-change-to-render':
            // Length of time it takes for a page to start rendering after a route change (in ms)
            // handle route-change to render results
            // console.log('Next.js-route-change-to-render: ', metric);
            break;
        case 'Next.js-render':
            // Length of time it takes for a page to finish render after a route change (in ms)
            // handle render results
            // console.log('Next.js-render: ', metric);
            break;
        default:
            break
    }
    sendToGoogleAnalytics({
        action: metric.name,
        label: metric.id,
        value: value,
        category: 'Web Vitals',
        nonInteraction: true
    });
};

module.exports = {
    sendWebVitals
}
