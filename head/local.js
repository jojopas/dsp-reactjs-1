import React from 'react';
import Head from "next/head";

import config from './config';

export default function LocalSEOTags({pageType, seoObj}) {
    // console.log('seoObj', seoObj,'pageTYpe', pageType  );
    const title = (seoObj && seoObj.title) || config.title;
    const suffix = (seoObj && seoObj.suffix) || config.suffix;
    let jsonLD;
    if(pageType === 'movie' || pageType === 'show' || pageType === "channel") {
        jsonLD = {
            '@context': 'http://schema.org',
            '@type': 'VideoObject',
            name: seoObj.title,
            description: seoObj.description,
            thumbnailUrl: seoObj.image,
            //uploadDate: new Date(vidInfo.availableSince).toISOString(),
            //duration: String(seoObj.duration).toISOString(),
            regionsAllowed: 'US',
            //contentUrl: typeof vidInfo.src === 'string' ? vidInfo.src : vidInfo.src[0].file,
            // embedUrl: 'http://www.example.com/videoplayer.swf?video=123',
            // interactionCount: '2347',
        };
    }

    const getVideoContentType = (pageType) => {
        switch (pageType) {
            case 'movie':
                return 'video.movie';
            case 'show':
                return 'video.tv_show';
            case 'channel':
            default:
                return 'video.other';
        }
    };

    return (
        <Head>
            {title && suffix ? (
                <title>{`${title} | ${suffix}`}</title>
            ) : null}
            <meta property="og:title" content={title} key="og:title"/>
            <meta name="twitter:title" content={title} key="twitter:title"/>

            {seoObj && seoObj.description ? (
                <>
                    <meta name="description" content={seoObj.description} key="description"/>
                    <meta property="og:description" content={seoObj.description} key="og:description"/>
                    <meta name="twitter:description" content={seoObj.description} key="twitter:description"/>
                </>
            ) : null}

            {seoObj && seoObj.keywords && seoObj.keywords.length > 0 ? (
                <meta name="keywords" content={seoObj.keywords.join(', ')} key="keywords"/>
            ) : null}

            {/* ... insert tags that change per route */}
            {pageType === 'movie' || pageType === 'show'  || pageType === 'channel' ? (
                <>
                    <meta property="og:type" content={getVideoContentType(pageType)} key="og:type"/>
                    <meta property="og:image" content={`${seoObj.image}/900`} key="og:image"/>
                    <meta property="og:image:width" content="900" key="og:image:width"/>
                    {/* <meta property="og:image:height" content="video"/>*/}
                    <meta name="twitter:image" content={`${seoObj.image}/900`}/>
                    <meta itemProp="name" content={seoObj.title} key="itemProp:name"/>
                    <meta itemProp="image" content={`${seoObj.image}`} key="itemProp:image"/>
                    <script type='application/ld+json' dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLD)}} />
                </>
            ) : null}
        </Head>
    )
}
