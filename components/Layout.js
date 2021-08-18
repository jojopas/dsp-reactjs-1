import React from "react";
import { useObserver } from "mobx-react-lite";
import CookieConsent from "react-cookie-consent";
import { parseCookies, destroyCookie, setCookie } from "nookies";

import LocalSEOTags from "../head/local";
import Header from "./header/Header";
import Footer from "./Footer";

import { StoreContext } from "../store";

import { useMediaQuery } from "../helpers/utils/browser";
import { constants } from "../config";

import "./Layout.less";
import "./CookieConsent.less";

import { fadeOut } from "../helpers/utils/fade";
import { sendToSegment } from "../analytics";

function Layout({ config, session, pageType, seoObj, children }) {
    const store = React.useContext(StoreContext);
    const isBreakPoint = useMediaQuery(constants.MOBILE_BREAKPOINT);
    const siteWrapperRef = React.useRef(null);

    React.useEffect(() => {
        store.setBreakPoint(isBreakPoint);
    }, [config, isBreakPoint]);

    React.useEffect(() => {
        if (!store.siteWrapperRef) {
            store.setSiteWrapperRef(siteWrapperRef.current);
        }
    }, [siteWrapperRef]);


    React.useEffect(() => {
        if (window) {
            sendToSegment("page");
        }
    }, []);
    // console.log('Layout', pageType);
    return useObserver(() => (
        <>
            <LocalSEOTags pageType={pageType} seoObj={seoObj} />
            <div
                className={`site-wrapper pageType-${pageType}`}
                ref={siteWrapperRef}
            >
                <Header
                   pageType={pageType}
                />
                <main className={`pageType-${pageType}`}>{children}</main>
                <Footer />
                <CookieConsent
                    location="bottom"
                    buttonText={constants.GDPR_BUTTON}
                    cookieName={`_${constants.COOKIE_PREFIX}_consent`}
                    containerClasses="cookieConsent"
                    buttonClasses="cookieConsent-button"
                    buttonId="cookieConsent-agree"
                    disableStyles={true}
                    expires={constants.GDPR_EXPIRATION}
                    sameSite="lax"
                    hideOnAccept={false}
                    onAccept={() => {
                        const thisEl = document.querySelector(".cookieConsent");
                        thisEl.classList.add("cookieConsent-close");
                        fadeOut(thisEl);
                        sendToSegment("track", {
                            event: "Website Stores Cookies",
                        });
                    }}
                >
                    {constants.GDPR_TEXT}
                </CookieConsent>
            </div>
            {/* Truoptik Pixel */}
            <img
                className="do-not-lazysize"
                alt="truoptik"
                style={{
                    width: "1px",
                    height: "1px",
                    position: "fixed",
                    top: "-100px",
                    left: "-100px",
                    visibility: "hidden",
                }}
                src="https://dmp.truoptik.com/a311adc7f8b7f20c/sync.gif"
            />
            {/* Active Campaign */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `(function(e,t,o,n,p,r,i){e.visitorGlobalObjectAlias=n;e[e.visitorGlobalObjectAlias]=e[e.visitorGlobalObjectAlias]||function(){(e[e.visitorGlobalObjectAlias].q=e[e.visitorGlobalObjectAlias].q||[]).push(arguments)};e[e.visitorGlobalObjectAlias].l=(new Date).getTime();r=t.createElement("script");r.src=o;r.async=true;i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)})(window,document,"https://diffuser-cdn.app-us1.com/diffuser/diffuser.js","vgo");
                            vgo('setAccount', '650363305');vgo('setTrackByDefault', true);vgo('process');`,
                }}
            />
        </>
    ));
}

export const getLayout = (page) => {
    const {
        props: { config, session, pageType, seoObj, slug },
        children,
    } = page;

    return (
        <Layout
            config={config}
            session={session}
            pageType={pageType}
            seoObj={seoObj}
            children={children}
        >
            {page}
        </Layout>
    );
};
export default Layout;
