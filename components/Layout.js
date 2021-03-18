import React from 'react';
import {useObserver} from "mobx-react-lite";
import CookieConsent from "react-cookie-consent";
import {parseCookies, destroyCookie, setCookie} from 'nookies';

import LocalSEOTags from '../head/local';
import Header from './header/Header';
import Footer from './Footer';

import {StoreContext} from "../store";

import {useMediaQuery} from "../helpers/utils/browser";
import {constants} from "../config";

import './Layout.less';
import './CookieConsent.less';
import MyCityModal from './myCity/MyCityModal';

import {fadeOut} from '../helpers/utils/fade';
import {sendToSegment} from '../analytics';


function Layout({config, session, pageType, seoObj, children}) {
    const store = React.useContext(StoreContext);
    const isBreakPoint = useMediaQuery(constants.MOBILE_BREAKPOINT);
    const siteWrapperRef = React.useRef(null);

    React.useEffect(() => {
        if (!store.getLnConfig) {
            store.updateLnConfig(config);
        }
        store.setBreakPoint(isBreakPoint);
    }, [config, isBreakPoint]);

    React.useEffect(() => {
        if (!store.siteWrapperRef) {
            store.setSiteWrapperRef(siteWrapperRef.current);
        }
    }, [siteWrapperRef]);

    // Poll for if someone deletes their city cookie.  We need a city cookie to locate them.
    const cityCookieCheck = () => {
        const cookies = parseCookies();
        if (!cookies[`_${constants.COOKIE_PREFIX}_myCity`]) {
            if (!store.showMyCityModal) {
                store.setShowMyCityModal(true);
            }
        }
    }

    // Fix for people that had visited the site before we implemented the market cookie for cache strategy
    const addMarketCookie = () => {
        const cookies = parseCookies();
        if (cookies[`_${constants.COOKIE_PREFIX}_myCity`] && !cookies[`_${constants.COOKIE_PREFIX}_myMarket`]) {
            const market = JSON.parse(cookies[`_${constants.COOKIE_PREFIX}_myCity`]).market;
            setCookie(null, `_${constants.COOKIE_PREFIX}_myMarket`, market, {
                expires: constants.COOKIE_NO_EXPIRE,
                sameSite: 'Lax',
                secure: config && config.xForwardedProto === 'https',
                path: '/'
            });
        }
    }

    // Destroy the experience cookie on unload
    const destroyExpCookie = () => {
        //console.log('destroy');
        destroyCookie(null, `_${constants.COOKIE_PREFIX}_experienceId`);
    }

    let interval;
    React.useEffect(() => {
        addMarketCookie();
        cityCookieCheck();
        interval = setInterval(cityCookieCheck, 10000);

        if(window) {
            window.addEventListener('beforeunload', destroyExpCookie);
            sendToSegment('page');
        }


        return () => {
            clearInterval(interval);
        }
    }, []);

    return useObserver(() => (
        <>
            <LocalSEOTags pageType={pageType} seoObj={seoObj}/>
            <div className={`site-wrapper pageType-${pageType}`} ref={siteWrapperRef}>
                <Header/>
                <main className={`pageType-${pageType}`}>{children}</main>
                <Footer/>
                <MyCityModal config={config} session={session} showMyCityModal={store.showMyCityModal}/>
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
                        const thisEl = document.querySelector('.cookieConsent');
                        thisEl.classList.add('cookieConsent-close');
                        fadeOut(thisEl);
                        sendToSegment('track', {event: 'Website Stores Cookies'});
                    }}
                >{constants.GDPR_TEXT}</CookieConsent>
            </div>
            {/* Truoptik Pixel */}
            <img className="do-not-lazysize" alt="truoptik" style={{width:'1px', height:'1px', position: 'fixed', top: '-100px', left: '-100px', visibility: 'hidden'}} src="https://dmp.truoptik.com/a311adc7f8b7f20c/sync.gif"/>
            {/* Active Campaign */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `(function(e,t,o,n,p,r,i){e.visitorGlobalObjectAlias=n;e[e.visitorGlobalObjectAlias]=e[e.visitorGlobalObjectAlias]||function(){(e[e.visitorGlobalObjectAlias].q=e[e.visitorGlobalObjectAlias].q||[]).push(arguments)};e[e.visitorGlobalObjectAlias].l=(new Date).getTime();r=t.createElement("script");r.src=o;r.async=true;i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)})(window,document,"https://diffuser-cdn.app-us1.com/diffuser/diffuser.js","vgo");
                            vgo('setAccount', '650363305');vgo('setTrackByDefault', true);vgo('process');`,
                }}
            />
        </>
    ))
}

export const getLayout = (page) => {
    const {props: {config, session, pageType, seoObj, slug}, children} = page;

    return (
        <Layout config={config} session={session} pageType={pageType} seoObj={seoObj} children={children}>
            {page}
        </Layout>
    )
};
export default Layout
