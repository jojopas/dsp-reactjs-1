import React, { useContext } from "react";
import getConfig from "next/config";
import Router from 'next/router';
import NProgress from 'nprogress';
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";

import { InjectStoreContext, StoreContext } from "../store";
import config from "../head/config";
import GlobalSEOTags from "../head/global";
import { sendWebVitals, sendToSegment } from "../analytics";
const { publicRuntimeConfig } = getConfig();
import "../styles/main.less";

// module.hot.dispose event not being called on local dev causes css loss from time to time
// https://github.com/sheerun/extracted-loader/issues/11
if (module.hot) {
    module.hot.addStatusHandler((status) => {
        if (typeof window !== "undefined" && status === "ready") {
            window.__webpack_reload_css__ = true;
        }
    });
}

Router.events.on('routeChangeStart', (url) => {
    NProgress.start();
})
Router.events.on('routeChangeComplete', (url) => {
    NProgress.done();
    // GA Page View
    window.gtag('config', publicRuntimeConfig.GA_ID, {
        page_path: url,
    })
    // Segment Page View
    sendToSegment('page');
});
Router.events.on('routeChangeError', () => NProgress.done());

function App({ Component, pageProps }) {
    // If your page has Next.js data fetching methods returning a state for the Mobx store,
    // then you can hydrate it here.
    const getLayout = Component.getLayout || ((page) => page);
    return (
        <InjectStoreContext
            initialData={pageProps.initialStoreData}
            sessionData={pageProps.sessionStoreData}
        >
            <GlobalSEOTags title={config.title} suffix={config.suffix} />
            {getLayout(<Component {...pageProps} />)}
        </InjectStoreContext>
    );
}

export default App;

export function reportWebVitals(metric) {
    sendWebVitals(metric);
}
