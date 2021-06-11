const constants = {
    ENV_DSP_API_URL: 'api.myspotlight.tv',
    ENV_DSP_API_KEY: '2c4262e3dc004e2f22c6d03de10ff0c06596edd3', // prod:'2c4262e3dc004e2f22c6d03de10ff0c06596edd3' staging:'f36c883f5037af539572f2d1a362573bb683c727'
    ENV_GA_ID: 'UA-84268486-6', // For debugging 'UA-3115785-11',
    ENV_DSP_PLAYER_KEY: '5ef4a47fc27512184b7d2b62', // staging: 5ef5185b8949063e3a66d133 prod: 5ef4a47fc27512184b7d2b62
    ENV_DSP_PLAYER_URL: 'https://www.dplayer.pro/dotplayer.js',
    ENV_SEGMENT_WRITE_KEY: 'pJOFZYQaXKgw4QwFLgCcX3lwcPHRSnBB', // qa: pJOFZYQaXKgw4QwFLgCcX3lwcPHRSnBB prod: JiuzpzcYrsdlvAVEWW9vedGw3dXqyZ5V
    COOKIE_PREFIX: 'ln',
    DSP_COUNTRY: 'US',
    DSP_PLATFORM: 'website',
    DSP_IMG_PREFIX: 'https://images.dotstudiopro.com/',
    MOBILE_BREAKPOINT: 767,
    TWITTER_HANDLE: 'LocalNow',
    NOT_FOUND_SRC: '/images/noImage.svg',
    NOT_FOUND_SRC_DATA: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    SEASON: 'Season',
    WATCH_NOW: 'Watch Now',
    WATCHING: 'Watching',
    START_OVER: 'Start Over',
    TRAILER: 'Trailer',
    MORE: 'More',
    LESS: 'Less',
    SHARE: 'Share',
    MORE_LIKE_THIS: 'More Like This',
    GENRES: 'Genres',
    TAGS: 'Tags',
    SEARCH_SIZE: 200,
    RECO_SIZE: 20,
    SEARCH_DEFAULT: 'Search for Shows, Movies & More',
    SEARCH_LOADING: 'Loading Results...',
    NO_RESULTS: 'Your search returned no results.',
    MSG_404: 'We\'re currently working on improving your experience. Please wait a few minutes and try again.',
    HOME_404: 'Take Me Home',
    AXIOS_RETRY_CNT: 3,
    GDPR_TEXT: 'This website stores cookies on your computer. These cookies are used to collect information about how you interact with our website and allow us to remember you. We use this information in order to improve and customize your browsing experience and for analytics and metrics about our visitors both on the website and other media. To find out more about the cookies we use, see our Privacy Policy.',
    GDPR_BUTTON: 'Got it!',
    GDPR_EXPIRATION: 90,
    EPG_POLLING: 30,
    EPG_TIME_LEFT: 10,
    EPG_PROMO_CNT: 10,
    EPG_UI_TIMEOUT: 4,
    EPG_30_MINUTE_WIDTH: 500,
    COOKIE_NO_EXPIRE: new Date("2100/10/10"),
    CORS_WHITELIST: ['http://localhost:3000', '/localnow\.com$/', /\.localnow\.com$/, /\.herokuapp\.com$/],
    CONTACTUS_FORM_SUBMIT: 'Submit',
    GOOGLE_RECAPTCHA_SITEKEY: '6Lc5WT0aAAAAAK1o9PAW59s700x_adV7pgiyUC2F'
};

module.exports = {
    constants
};
