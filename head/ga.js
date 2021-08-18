import React from 'react';
import getConfig from 'next/config';

const {publicRuntimeConfig} = getConfig();


export default function GoogleAnalytics() {
    return (
        <>
            {/* Global site tag (gtag.js) - Google Analytics --> */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${publicRuntimeConfig.GA_ID}`} />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${publicRuntimeConfig.GA_ID}', {
                                page_path: window.location.pathname,
                            });
                        `,
                }}
            />
        </>
    )
}
