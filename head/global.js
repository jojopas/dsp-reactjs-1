import React from 'react';
import Head from "next/head";
import config from "./config";
import GoogleAnalytics from "./ga";
import DotStudioProPlayerScripts from './dot-studio-pro-player-scripts';
import LazySizes from './lazysizes';
import SpringServeScript from './springserve';
import Segment from './segment';

export default function GlobalSEOTags({title = config.title, suffix = config.suffix}) {
    const socialTitle = (title && suffix) ? title : suffix;

    return (
        <Head>
            {title && suffix ? (
                <title>{`${title} | ${suffix}`}</title>
            ) : (
                <title>{`${suffix}`}</title>
            )}

            {/* FONTS */}
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />

            {/* FAVICON */}
            <link rel="shortcut icon" type="image/ico" href="/favicons/favicon.ico"/>

            {/*Basic HTML Meta Tags*/}
            <meta name="keywords" content={config.keywords} key="keywords"/>
            <meta name="description" content={config.description} key="description"/>
            <meta name="copyright" content={config.company}/>
            <meta name="language" content="EN"/>
            <meta name="robots" content="index,follow"/>
            {/*<meta httpEquiv="Expires" content="0"/>
            <meta httpEquiv="Pragma" content="no-cache"/>
            <meta httpEquiv="Cache-Control" content="no-cache"/>*/}

            {/*Open Graph meta tags*/}
            {/*To avoid duplicate tags in your head you can use the key property, which will make sure the tag is only rendered once, as in the following example */}
            <meta name="og:site_name" content={config.suffix}/>
            <meta name="og:title" content={socialTitle} key="og:title"/>
            <meta name="og:description" content={config.description} key="og:description"/>
            <meta name="og:image" content="/favicons/android-chrome-192x192.png" key="og:image"/>

            {/* These tags are included but are mainly here to stop Facebook from whining about them */}
            <meta property="og:url" content={""} />
            <meta property="fb:app_id" content={""} />

            {/* Twitter */}
            <meta name="twitter:site" content={`@${config.twitter}`}/>
            <meta name="twitter:creator" content={`@${config.twitter}`}/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={socialTitle} key="twitter:title"/>
            <meta name="twitter:description" content={config.description} key="twitter:description"/>
            <meta name="twitter:image" content="/favicons/android-chrome-192x192.png"/>


            {/* Google */}
            <meta itemProp="name" content={config.suffix} key="itemProp:name"/>
            <meta itemProp="image" content="/favicons/android-chrome-192x192.png" key="itemProp:image"/>

            {/* Company / Service Meta Tags */}
            {/* =========================== */}
            {/* Apple */}
            <meta name="format-detection" content="telephone=no"/>
            <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>

            <link rel="apple-touch-icon-precomposed" sizes="57x57" href="/favicons/apple-touch-icon-57x57.png"/>
            <link rel="apple-touch-icon-precomposed" sizes="60x60" href="/favicons/apple-touch-icon-60x60.png"/>
            <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/favicons/apple-touch-icon-72x72.png"/>
            <link rel="apple-touch-icon-precomposed" sizes="76x76" href="/favicons/apple-touch-icon-76x76.png"/>
            <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/favicons/apple-touch-icon-114x114.png"/>
            <link rel="apple-touch-icon-precomposed" sizes="120x120" href="/favicons/apple-touch-icon-120x120.png"/>
            <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/favicons/apple-touch-icon-144x144.png"/>
            <link rel="apple-touch-icon-precomposed" sizes="152x152" href="/favicons/apple-touch-icon-152x152.png"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon-180x180.png"/>
            <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color={config.brandColor}/>
            <link rel="icon" sizes="196x196" href="/favicons/favicon-196x196.png"/>
            <link rel="icon" sizes="128x128" href="/favicons/favicon-128.png"/>
            <link rel="icon" sizes="96x96" href="/favicons/favicon-96x96.png"/>
            <link rel="icon" sizes="16x16 32x32" href="/favicons/favicon.ico"/>
            <meta name="msapplication-TileColor" content={config.brandColor}/>
            <meta name="msapplication-TileImage" content="/favicons/mstile-150x150.png"/>
            <meta name="msapplication-square70x70logo" content="/favicons/mstile-70x70.png"/>
            <meta name="msapplication-square150x150logo" content="/favicons/mstile-150x150.png"/>
            <meta name="msapplication-wide310x150logo" content="/favicons/mstile-310x150.png"/>
            <meta name="msapplication-square310x310logo" content="/favicons/mstile-310x310.png"/>
            <meta name="theme-color" content={config.brandColor}/>

            {/* Native App Meta */}
            {/*<meta name="apple-itunes-app" content={config.iosApp}/>
            <meta name="google-play-app" content={config.androidApp}/>*/}

            {/* Internet Explorer */}
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>

            {/* Google Analytics Example */}
            <GoogleAnalytics />
            {/* dotstudioPRO Player Script */}
            <DotStudioProPlayerScripts />
            {/* Lazy Sizes */}
            <LazySizes />
            {/* Spring Serve*/}
            <SpringServeScript />
            {/* Segment */}
            <Segment />
        </Head>
    )
}
