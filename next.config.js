// next.config.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const withPlugins = require("next-compose-plugins");
const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');

const {csp} = require('./csp');
const {constants} = require('./config/index');

const nextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'content-security-policy',
                        value: csp
                    },
                    {
                        key: 'cache-control',
                        value: process.env.NODE_ENV === 'production' ? 'public' : ''
                    }
                ]
            },
            {
                source: '/',
                headers: [
                    {
                        key: 'content-security-policy',
                        value: csp
                    },
                    {
                        key: 'cache-control',
                        value: process.env.NODE_ENV === 'production' ? 'public' : ''
                    }
                ]
            },
            {
                source: '/(.*.ico|.*.png|.*.svg|.*.txt|.*.xml)',
                headers: [
                    {
                        key: 'content-security-policy',
                        value: csp
                    },
                    {
                        key: 'cache-control',
                        value: process.env.NODE_ENV === 'production' ? 'public' : ''
                    }
                ]
            }

        ]
    },
    async rewrites() {
        return [
            {
                source: '/sweeps',
                destination: '/about/sweeps',
            },
        ]
    },
    target: 'server',
    api: {
        bodyParser: true
    },
    webpack: function (config, {isServer, dev}) {
        config.module.rules.push({
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 100000,
                    name: '[name].[ext]'
                }
            }
        })
        return config;
    },
    // css/less specific configs
    cssModules: false,
    cssLoaderOptions: {
        importLoaders: 3,
        localIdentName: "[local]___[hash:base64:5]",
    },
    lessLoaderOptions: {
        javascriptEnabled: true
    },
    serverRuntimeConfig: {
        // will only be available on the serverside
        DSP_API_URL: process.env.DSP_API_URL || constants.ENV_DSP_API_URL,
        DSP_API_KEY: process.env.DSP_API_KEY || constants.ENV_DSP_API_KEY,
        LN_API_URL: process.env.LN_API_URL || constants.ENV_LN_API_URL,
        LN_API_KEY: process.env.LN_API_KEY || constants.ENV_LN_API_KEY,
        DSP_TOKEN: process.env.DSP_TOKEN
    },
    publicRuntimeConfig: {
        DSP_PLAYER_KEY: process.env.DSP_PLAYER_KEY || constants.ENV_DSP_PLAYER_KEY,
        DSP_PLAYER_URL: process.env.DSP_PLAYER_URL || constants.ENV_DSP_PLAYER_URL,
        APP_VERSION: process.env.APP_VERSION || '0.0.0',
        GA_ID: process.env.GA_ID || constants.ENV_GA_ID,
        SEGMENT_WRITE_KEY: process.env.SEGMENT_WRITE_KEY || constants.ENV_SEGMENT_WRITE_KEY,
        GOOGLE_RECAPTCHA_SITEKEY: process.env.GOOGLE_RECAPTCHA_SITEKEY || constants.GOOGLE_RECAPTCHA_SITEKEY
    },
    poweredByHeader: false,
}

module.exports = withPlugins([withCSS, withLess], nextConfig);
