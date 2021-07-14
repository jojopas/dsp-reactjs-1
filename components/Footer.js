import React from 'react';

import InlineSVG from './InlineSVG';
import Nav from './nav/Nav';
import './Footer.less';
import {StoreContext} from "../store";
import {useObserver} from "mobx-react-lite";

export default function Footer() {
    const store = React.useContext(StoreContext);
    const footer = [
        {id: 'home', inner: 'Home', url: '/', exact: true},
        {id: 'channels', inner: 'Channels', url: '/channels/[[...slug]]', as: '/channels'},
        {id: 'movies', inner: 'Movies', url: '/movies', as: '/movies'},
        {id: 'shows', inner: 'Shows', url: '/shows', as: '/shows'},
        {id: 'search', inner: 'Search', url: '/search/[[...searchQuery]]', as: '/search'},
        {id: 'account', inner: 'Account', url: '/account/[[...slug]]', as: '/account'},
        {id: 'support', inner: 'Support', url: '/about/[[...slug]]', as: '/about/support'},
        {id: 'advertiseWithUs', inner: 'Advertise with Us', url: '/about/[[...slug]]', as: '/about/advertise-with-us'},
        null,
        {id: 'about', inner: 'About', url: '/about/[[...slug]]', as: '/about', exact: true},
        {id: 'contactus', inner: 'Contact', url: '/about/[[...slug]]', as: '/about/contact'},
        {id: 'terms', inner: 'Terms of Use', url: '/about/[[...slug]]', as: '/about/terms-of-use'},
        {id: 'privacy', inner: 'Privacy Policy', url: '/about/[[...slug]]', as: '/about/privacy-policy'},
        {id: 'doNotSell', inner: 'Do Not Sell My Information', url: '/about/[[...slug]]', as: '/about/do-not-sell-my-information'},
        {id: 'ccpa', inner: 'CCPA', url: '/about/[[...slug]]', as: '/about/ccpa'},
    ];

    const apps = [
        {
            id: "ios",
            class: "ios",
            inner: "iTunes App Download",
            url: "https://itunes.apple.com/us/app/local-now-stream-your-city/id1117556939?mt=8",
            newWin: true,
            tracking: {
                event: "Click to Apple Store",
            },
        },
        {
            id: "android",
            class: "android",
            inner: "Google Play App Download",
            url: "https://play.google.com/store/apps/details?id=com.weathergroup.sportstv&hl=en_US",
            newWin: true,
            tracking: {
                event: "Click to Google Play",
            },
        },
    ];

    const social = [
        {
            id: "instagram",
            class: "instagram",
            type: "svg",
            inner: "Instagram",
            svg: "instagram",
            url: "https://www.instagram.com/sportstv",
            newWin: true,
            tracking: {
                event: "Click to Instagram",
            },
        },
        {
            id: "twitter",
            class: "twitter",
            type: "svg",
            inner: "Twitter",
            svg: "twitter",
            url: "https://twitter.com/sportstv",
            newWin: true,
            tracking: {
                event: "Click to Twitter",
            },
        },
        {
            id: "facebook",
            class: "facebook",
            type: "svg",
            inner: "Facebook",
            svg: "facebook",
            url: "https://www.facebook.com/sportstv",
            newWin: true,
            tracking: {
                event: "Click to Facebook",
            },
        },
    ];

    return useObserver(() => (
        <footer>
            <Nav className="footerNav-general" links={footer}></Nav>
            <Nav className="footerNav-apps" links={apps}></Nav>
            <Nav className="footerNav-social" links={social}></Nav>
            <div className="copyright">
                <span>{`© ${new Date().getFullYear()} Sports TV. All rights reserved.`}</span>
                {/* <a
                    href="https://www.babyste.ps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="siteCredit"
                >Site by Baby Steps</a> */}
            </div>
        </footer>
    ))
}
