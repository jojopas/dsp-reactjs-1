import React, { useContext } from "react";
import getConfig from "next/config";
import { useRouter } from "next/router";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import Preloading from "../components/preloading/Preloading";

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

function App({ Component, pageProps }) {
    const router = useRouter();
    const [pageLoading, setPageLoading] = React.useState(false);
    React.useEffect(() => {
        const handleStart = () => {
            setPageLoading(true);
        };
        const handleComplete = () => {
            setPageLoading(false);
        };

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", (url) => {
            // GA Page View
            window.gtag("config", publicRuntimeConfig.GA_ID, {
                page_path: url,
            });
            // Segment Page View
            sendToSegment("page");
            setPageLoading(true);
        });
        router.events.on("routeChangeError", handleComplete);
    }, [router]);

    // If your page has Next.js data fetching methods returning a state for the Mobx store,
    // then you can hydrate it here.
    const getLayout = Component.getLayout || ((page) => page);
    return !pageLoading ? (
        <InjectStoreContext
            initialData={pageProps.initialStoreData}
            sessionData={pageProps.sessionStoreData}
        >
            <GlobalSEOTags title={config.title} suffix={config.suffix} />
            {getLayout(<Component {...pageProps} />)}
        </InjectStoreContext>
    ) : (
        <Preloading />
    );
}

export default App;

export function reportWebVitals(metric) {
    sendWebVitals(metric);
}
