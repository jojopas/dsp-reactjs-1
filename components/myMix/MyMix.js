import React from 'react';
import axios from 'axios';
import {parseCookies, setCookie} from 'nookies';
import {isMobile, isTablet} from 'mobile-device-detect';

import './MyMix.less';
import {StoreContext} from '../../store';
import MyMixControls from './MyMixControls';
import {constants} from "../../config";
import {getBrowserHeight, getBrowserWidth, visibilityCheck} from '../../helpers/utils/browser';
import {useObserver} from 'mobx-react-lite';
import Player from '../player/Player';

export default function MyMix({config, session, pageType}) {

    const store = React.useContext(StoreContext);
    const playerContainer = React.useRef(null);
    const playerObserver = React.useRef(null);
    const myMixContainer = React.useRef(null);
    const myMixOuterContainer = React.useRef(null);
    const { localNow: { playback, advertising } } = config;
    const { guid } = session;

    const [myMixVideos, _setMyMixVideos] = React.useState([]);
    const myMixVideosRef = React.useRef(myMixVideos);
    const [gettingData, _setGettingData] = React.useState(false);
    const gettingDataRef = React.useRef(gettingData);

    const [firstVideo, _setFirstVideo] = React.useState(null);
    const firstVideoRef = React.useRef(firstVideo);

    const setMyMixVideos = data => {
        myMixVideosRef.current = data;
        _setMyMixVideos(data);
    };

    const setGettingData = data => {
        gettingDataRef.current = data;
        _setGettingData(data);
    };

    const setFirstVideo = data => {
        //console.log('setFirstVideo', data);
        firstVideoRef.current = data;
        _setFirstVideo(data);
    }

    // Advertising
    // Questions:
    // FetchAds - don't see this
    // SkipAdRequest - don't see this
    const setDefaultAdConfig = () => {
        const defaultAdConfig = {
            mode: 'Segment-Based',
            interval: 2,
            segmentsBeforeFirst: 1
        }

        if(advertising){
            if(advertising.adMode){
                defaultAdConfig.mode = advertising.adMode;
            }
            if(advertising.segmentsBeforeFirstAd){
                defaultAdConfig.segmentsBeforeFirst = advertising.segmentsBeforeFirstAd;
            }
            if(defaultAdConfig.mode === 'Segment-Based'){
                if(advertising.adIntervalSegments){
                    defaultAdConfig.interval = advertising.adIntervalSegments;
                }
            }
            if(defaultAdConfig.mode === 'Time-Based'){
                if(advertising.adIntervalSeconds){
                    defaultAdConfig.interval = advertising.adIntervalSeconds;
                }
                if(advertising.maxAdIntervalSeconds){
                    defaultAdConfig.maxAdIntervalSeconds = advertising.maxAdIntervalSeconds;
                }
            }
        }
        return defaultAdConfig;
    };

    const adConfig = setDefaultAdConfig();
    const [adTracker, _setAdTracker] = React.useState({
        timeCnt: 0,
        lastTime: 0,
        segmentCnt: 0,
    });
    const adTrackerRef = React.useRef(adTracker);
    const setAdTracker = data => {
        adTrackerRef.current = data;
        _setAdTracker(data);
    };

    const shouldPlayAd = () => {
        let shouldPlay = false;
        const newAdTracker = Object.assign({}, adTrackerRef.current);
        newAdTracker.lastTime = 0;

        if(newAdTracker.segmentCnt >= adConfig.segmentsBeforeFirst) {
            if (adConfig.mode === 'Time-Based') {
                if(newAdTracker.timeCnt >= adConfig.interval){
                    newAdTracker.timeCnt = 0;
                    shouldPlay = true;
                }
            } else {
                if ((newAdTracker.segmentCnt - adConfig.segmentsBeforeFirst) % adConfig.interval === 0) {
                    shouldPlay = true;
                }
            }
        }
        // console.log('shouldPlayAd', shouldPlay, newAdTracker, adConfig);
        setAdTracker(newAdTracker);
        return shouldPlay;
    }

    // Get the M3U8 and VMAP for current video
    const getVideo = async (isFirstVideo = false) => {
        if(myMixVideosRef.current.length > 0) {
            const {width, height} = await playerContainer.current.getBoundingClientRect();
            const options = {
                playback: {
                    url: playback.videoPlaybackEndpointUrl,
                    AssetId: myMixVideosRef.current[0].assetId,
                    Version: myMixVideosRef.current[0].version
                },
                /*advertising: {
                    url: advertising.getPreRollEndpointUrl,
                    Video_Id: myMixVideosRef.current[0].assetId,
                    Video_Version: myMixVideosRef.current[0].version,
                    Page_Url: 'localnow.com',
                    Device_DeviceType: isMobile ? 'mobile_web' : 'desktop_web',
                    Player_Width: Math.floor(width),
                    Player_Height: Math.floor(height),
                }*/
            }
            const {data} = await axios({
                method: 'POST',
                url: '/api/ln/get-video',
                data: options
            });

            const vmapObj = {
                Device_DeviceType: isMobile ? 'mobile_web' : 'desktop_web',
                Video_Id: myMixVideosRef.current[0].assetId,
                Video_Version: myMixVideosRef.current[0].version,
                Player_Width: Math.floor(width),
                Player_Height: Math.floor(height),
                App_Bundle: 'com.localnow',
                App_Name: 'Local Now',
                Device_Ifa: '',
                Device_Make: '',
                Device_Model: '',
                Vpi: 'MP4',
                Page_Url: 'localnow.com',
                User_Gender: '',
                User_Yob: '',
                rtb_device: isTablet ? 5 : isMobile ? 4 : 2,
            };

            const vmapQS = Object.keys(vmapObj).map(key => key + '=' + encodeURIComponent(vmapObj[key])).join('&');

            const vmap = `${advertising.getPreRollEndpointUrl}?${vmapQS}`;

            if (data && data.data) {
                //const {myMixVideo: {url, vmap}} = data.data;
                const {myMixVideo: {url}} = data.data;
                const vidObj = {url, vmap: null, meta: myMixVideosRef.current[0]};
                if (shouldPlayAd()) {
                    vidObj.vmap = vmap;
                }

                // console.log('vidObj', vidObj);
                if(isFirstVideo){
                    setFirstVideo(vidObj);
                } else {
                    store.loadVideo(vidObj);
                }
            }
        }
    }

    // Get another My Mix Video and add to end of array
    const getMyMixData = async () => {
        //console.log('GET more my mix');
        const cookies = parseCookies();
        const marketIdCookie = cookies[`_${constants.COOKIE_PREFIX}_myCity`];
        const marketId = marketIdCookie && JSON.parse(marketIdCookie).market;

        const noOfMyMixItems = 3 - myMixVideosRef.current.length;
        //console.log('my mix items to fetch', noOfMyMixItems);

        const options = {
            url: playback.myMixPlaybackEndpointUrl,
            guid: guid,
            noOfMyMixItems: noOfMyMixItems,
            experienceIdFromCookie: cookies[`_${constants.COOKIE_PREFIX}_experienceId`],
            marketId: marketId
        };
        //console.log('expId', cookies[`_${constants.COOKIE_PREFIX}_experienceId`]);
        const { data } = await axios({
            method: 'POST',
            url: '/api/ln/get-my-mix',
            data: options
        });
        if (data && data.data && data.data) {
            const { myMix: { videos, experienceId } } = data.data;
            if (videos && videos.length > 0) {
                const addMyMixVid = [...myMixVideosRef.current, ...videos];
                setMyMixVideos(addMyMixVid);
                setGettingData(false);
                //console.log('GOT more my mix');
            }

            return experienceId;
        }
        return false;
        //console.log('ended getting my mix data');
    }

    // Play the next video (called on skip or ended event)
    const playNext = async () => {
        //console.log('getting my mix data');
        setGettingData(true);
        // 1. shift 0 off the initial array
        const newMyMixVideos = [...myMixVideosRef.current];
        newMyMixVideos.shift();
        setMyMixVideos(newMyMixVideos);
        // getVideo for new 0 in array + play video
        await getVideo();
        // add / fetch additional video to the end
        await getMyMixData();
    }

    // Player Time event listener
    const timeUpdate = () => {
        let shouldUpdate = false;
        const newTime = Math.floor(store.playerInstance.vjs.currentTime());
        const prevState = Object.assign({}, adTrackerRef.current);
        let { timeCnt, segmentCnt } = prevState;

        if (adConfig.mode === 'Time-Based' && newTime > prevState.lastTime) {
            timeCnt = prevState.timeCnt + 1;
            shouldUpdate = true;
        }

        if (newTime > prevState.lastTime && newTime === constants.MY_MIX_AD_SEGMENT_SECS) {
            segmentCnt = prevState.segmentCnt + 1;
            shouldUpdate = true;
        }

        if (shouldUpdate) {
            setAdTracker({
                timeCnt: timeCnt,
                lastTime: newTime,
                segmentCnt: segmentCnt,
            });
        }
    }

    // To log adTracker changes
    /*React.useEffect(() => {
        console.log('time update', adTrackerRef.current);
    }, [adTrackerRef.current]);*/

    // Setup Player listeners
    let playerSetupInterval;
    React.useEffect(() => {
        playerSetupInterval = setInterval(() => {
            if (store.playerInstance && store.playerInstance.vjs) {
                clearInterval(playerSetupInterval);
                //console.log('my mix player event listeners added');
                store.playerInstance.vjs.on('ended', playNext);
                store.playerInstance.vjs.on('timeupdate', timeUpdate);
            }
        }, 16);

        return () => {
            clearInterval(playerSetupInterval);
            if(store.playerInstance && store.playerInstance.vjs) {
                //console.log('my mix player event listeners removed');
                store.playerInstance.vjs.off('ended', playNext);
                store.playerInstance.vjs.off('timeupdate', timeUpdate);
            }
        }
    }, []);

    // Listen to visibility changes in case player gets paused
    let hidden, visibilityChange;
    const visibilityUpdate = () => {
        if (!document[hidden] && store.playerInstance && store.playerInstance.vjs && store.playerInstance.vjs.paused() && !store.isAdRunning) {
            if (!store.showMyCityModal) {
                store.playerInstance.vjs.play();
            }
        }
    };

    // Sticky Observer to add/remove classes when it sticks
    let stickyObserver;
    const stickyUpdate = () => {
        stickyObserver = new IntersectionObserver((entries) => {
            // no intersection
            const wideScreen = ((getBrowserHeight() / getBrowserWidth()) * 100) < 75;
            if (entries[0].intersectionRatio === 0) {

                if(myMixOuterContainer && myMixOuterContainer.current){
                    const {height} = myMixOuterContainer.current.getBoundingClientRect();
                    myMixOuterContainer.current.style.height = `${height}px`;
                }
                playerContainer.current.classList.add('myMixPlayer-stuck');
                if (myMixContainer && myMixContainer.current && wideScreen) {
                    myMixContainer.current.classList.add('myMix-inner-stuck');
                }
                // fully intersects
            } else if (entries[0].intersectionRatio === 1) {
                if(myMixOuterContainer && myMixOuterContainer.current){
                    myMixOuterContainer.current.style.height = '';
                }
                playerContainer.current.classList.remove('myMixPlayer-stuck');
                if (myMixContainer && myMixContainer.current) {
                    myMixContainer.current.classList.remove('myMix-inner-stuck');
                }
            }
        }, {
            threshold: [0, 1]
        });

        stickyObserver.observe(playerObserver.current);
    }

    React.useEffect(() => {
        const visibility = visibilityCheck();
        hidden = visibility.hidden;
        visibilityChange = visibility.visibilityChange;
    }, []);

    React.useEffect(() => {
        if(document) {
            //console.log('my mix visibility listeners added');
            document.addEventListener(visibilityChange, visibilityUpdate);
            stickyUpdate();
        }

        return () => {
            //console.log('my mix visibility listeners removed');
            document.removeEventListener(visibilityChange, visibilityUpdate);
            stickyObserver.disconnect();
        }
    }, []);

    // Get the first video's M3U8 and VMAP
    React.useEffect(() => {
        (async () => {
            const cookies = parseCookies();
            if (cookies[`_${constants.COOKIE_PREFIX}_myCity`]) {
                const expId = await getMyMixData();
                // Set Exp ID
                const cookies = parseCookies();
                if(!cookies[`_${constants.COOKIE_PREFIX}_experienceId`]) {
                    setCookie(null, `_${constants.COOKIE_PREFIX}_experienceId`, expId, {
                        sameSite: 'Lax',
                        secure: config && config.xForwardedProto === 'https',
                        path: '/'
                    });
                }
                await getVideo(true);
            }
        })();
    }, []);

    return useObserver(() => (
        <>
            { store.isBreakpoint ? (
                <>
                    <div ref={playerObserver}/>
                    <div ref={playerContainer} className="myMixPlayer">
                        <Player pageType={pageType} video={firstVideo} showPlayer={store.showPlayer} />
                    </div>
                    <div className="myMix">
                        <div className="myMix-inner">
                            <MyMixControls mixData={myMixVideosRef.current} playNext={playNext} gettingData={gettingData || store.isAdRunning} />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div ref={playerObserver}/>
                    <div className="myMix-outer" ref={myMixOuterContainer}>
                        <div className="myMix">
                            <div className="myMix-inner" ref={myMixContainer}>
                                <div ref={playerContainer} className="myMixPlayer">
                                    <Player pageType={pageType} video={firstVideo} showPlayer={store.showPlayer} />
                                </div>
                                <MyMixControls mixData={myMixVideos} playNext={playNext} gettingData={gettingData || store.isAdRunning} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    ));
}
