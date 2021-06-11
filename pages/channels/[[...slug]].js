import React from "react";
import { useRouter } from "next/router";
import { useObserver } from "mobx-react-lite";
import useSWR from "swr";
import { isMobile } from "mobile-device-detect";

import { constants } from "../../config";
import { isEmpty } from "../../helpers/utils/objects";
import getSession from "../../helpers/session/get-session";
import pageError from "../../helpers/page/error";
import { hasPointerEvents, getPointerType } from "../../helpers/utils/browser";
import { getLayout } from "../../components/Layout";
import { StoreContext } from "../../store";
import { pageBuilder } from "../../helpers/page/builder";
import Error404 from "../../components/404";
import EPGList from "../../components/epg/EPGList";
import { fetchData } from "../../helpers/utils/fetch-data";
const { publicRuntimeConfig } = getConfig();

import "./index.less";

import LocalSEOTags from "../../head/local";
import { visibilityCheck } from "../../helpers/utils/browser";
import Player from "../../components/player/Player";
import getConfig from "next/config";
import { sendToSegment } from "../../analytics";

export default function Channel({
    session,
    config,
    slug,
    page,
    pageError,
    seoObj,
    pageType,
}) {
    const store = React.useContext(StoreContext);
    const playerContainer = React.useRef(null);
    const epgPageRef = React.useRef(null);
    const router = useRouter();
    const { genres, promos, channels } = page;

    const [currentSlug, setCurrentSlug] = React.useState(slug);
    const [epgListCurrentSlug, setEpgListCurrentSlug] = React.useState(slug);

    const { data, error, isValidating } = useSWR(
        "/api/dsp/live/epg",
        async (url) => await fetchData(url),
        { refreshInterval: constants.EPG_POLLING * 1000 }
    );
    const [result, setResult] = React.useState(channels);

    const [currentSEO, setCurrentSEO] = React.useState(seoObj);

    const [firstVideo, _setFirstVideo] = React.useState(null);
    const firstVideoRef = React.useRef(firstVideo);
    const setFirstVideo = (data) => {
        console.log("setFirstVideo", data);
        if (data.slug) {
            changeCurrentSlug(data.slug);
        }
        firstVideoRef.current = data;
        _setFirstVideo(data);
    };

    const [isFirstVideo, _setIsFirstVideo] = React.useState(true);
    const isFirstVideoRef = React.useRef(isFirstVideo);
    const setIsFirstVideo = (data) => {
        isFirstVideoRef.current = data;
        _setIsFirstVideo(data);
    };

    React.useEffect(() => {
        if (data && data.data && data.data.data && data.data.data.channels) {
            const { channels } = data.data.data;
            setResult((prevState) => {
                return prevState.map((prevCh) => {
                    const ch = channels.find((c) => prevCh.id === c.id);
                    if (
                        ch &&
                        prevCh &&
                        prevCh.program &&
                        prevCh.program.length > 1 &&
                        (prevCh.program[0].title !== ch.program[0].title ||
                            prevCh.program[1].title !== ch.program[1].title)
                    ) {
                        return ch;
                    }
                    return prevCh;
                });
            });
        }
    }, [data]);

    const doesChannelExist = (id) => {
        return !!result.find((c) => c.videoId === id);
    };

    const getSlugFromVideoId = (id) => {
        const channel = result.find((c) => c.videoId === id);
        return channel ? channel.slug : null;
    };

    const getVideoIdFromSlug = (s) => {
        const channel = result.find((c) => c.slug === s);
        return channel ? channel.videoId : null;
    };

    const getSEOFromSlug = (s) => {
        const channel = result.find((c) => c.slug === s);
        return channel ? { title: channel.name, image: channel.logo } : {};
    };

    const changeCurrentSlug = (s) => {
        clearTimeout(startupTimer);
        clearTimeout(inactiveTimer);
        setCurrentSlug(s);
        setEpgListCurrentSlug(s);
        history.replaceState({}, "", `/channels/${s}`);
        window.gtag("config", publicRuntimeConfig.GA_ID, {
            page_path: `/channels/${s}`,
        });
        sendToSegment("page");
    };

    // Update Slug
    React.useEffect(() => {
        let currentChannelId;
        if (!currentSlug) {
            let currentChannelSlug;
            if (
                !store.currentChannel ||
                !doesChannelExist(store.currentChannel)
            ) {
                const firstChannelId = result && result[0] && result[0].videoId;
                if (firstChannelId) {
                    currentChannelSlug = result[0].slug;
                    //console.log(currentChannelSlug);
                    currentChannelId = firstChannelId;
                    isFirstVideoRef.current
                        ? setFirstVideo({ id: currentChannelId })
                        : store.loadVideo({ id: currentChannelId });
                    store.setCurrentChannel(currentChannelId);
                }
            } else {
                currentChannelId = store.currentChannel;
                currentChannelSlug = getSlugFromVideoId(currentChannelId);
                isFirstVideoRef.current
                    ? setFirstVideo({ id: currentChannelId })
                    : store.loadVideo({ id: currentChannelId });
                store.setCurrentChannel(currentChannelId);
            }
            setCurrentSEO(getSEOFromSlug(currentChannelSlug));
            setEpgListCurrentSlug(currentChannelSlug);
            if (currentChannelSlug) {
                history.replaceState({}, "", `/channels/${currentChannelSlug}`);
                //router.replace(`/channels/[[...slug]]`, `/channels/${currentChannelSlug}`, { shallow: true });
            }
        } else {
            setCurrentSEO(getSEOFromSlug(currentSlug));
            setEpgListCurrentSlug(currentSlug);
            isFirstVideoRef.current
                ? setFirstVideo({ id: getVideoIdFromSlug(currentSlug) })
                : store.loadVideo({ id: getVideoIdFromSlug(currentSlug) });
            store.setCurrentChannel(getVideoIdFromSlug(currentSlug));
        }
        setIsFirstVideo(false);
    }, [currentSlug]);

    // Listen to visibility changes in case player gets paused
    let hidden, visibilityChange;
    const visibilityUpdate = () => {
        if (
            !document[hidden] &&
            store.playerInstance &&
            store.playerInstance.vjs &&
            store.playerInstance.vjs.paused() &&
            !store.isAdRunning
        ) {
            store.playerInstance.vjs.play();
        }
    };

    React.useEffect(() => {
        const visibility = visibilityCheck();
        hidden = visibility.hidden;
        visibilityChange = visibility.visibilityChange;
    }, []);

    React.useEffect(() => {
        if (document) {
            document.addEventListener(
                visibilityChange,
                visibilityUpdate,
                false
            );
        }

        return () => {
            if (document) {
                //console.log('visibility listener removed');
                document.removeEventListener(
                    visibilityChange,
                    visibilityUpdate,
                    false
                );
            }
        };
    }, []);

    const [userIsActive, _setUserIsActive] = React.useState(true);
    const userIsActiveRef = React.useRef(userIsActive);
    const setUserIsActive = (data) => {
        userIsActiveRef.current = data;
        _setUserIsActive(data);
    };

    const userActive = () => {
        if (!store.playerInstance.vjs.paused()) {
            clearTimeout(startupTimer);
            setUserIsActive(true);
        }
    };

    const [isScrolling, _setIsScrolling] = React.useState(false);
    const isScrollingRef = React.useRef(isScrolling);
    const setIsScrolling = (data) => {
        isScrollingRef.current = data;
        _setIsScrolling(data);
    };
    let isScrollingTimer;
    let isScrollUpdating = false;
    let scrollingAnimationFrame;
    const epgScrollUpdate = () => {
        clearTimeout(isScrollingTimer);
        if (!isScrollingRef.current) {
            activatePlayerUI(true);
            setIsScrolling(true);
        }
        isScrollingTimer = setTimeout(() => {
            setIsScrolling(false);
            activatePlayerUI(false);
        }, constants.EPG_UI_TIMEOUT * 1000);
        isScrollUpdating = false;
    };

    const requestScrollUpdate = () => {
        if (!isScrollUpdating) {
            scrollingAnimationFrame = requestAnimationFrame(epgScrollUpdate);
            isScrollUpdating = true;
        }
    };

    const epgScroll = () => {
        requestScrollUpdate();
    };

    const [genreIsHovered, _setGenreIsHovered] = React.useState(false);
    const genreIsHoveredRef = React.useRef(genreIsHovered);
    const [genreDelay, _setGenreDelay] = React.useState(false);
    const genreDelayRef = React.useRef(genreDelay);
    let genreDelayTimeout;
    const setGenreIsHovered = (data) => {
        clearTimeout(genreDelayTimeout);
        genreIsHoveredRef.current = data;
        _setGenreIsHovered(data);
        genreDelayRef.current = !data;
        _setGenreDelay(!data);
        if (!data) {
            genreDelayTimeout = setTimeout(() => {
                genreDelayRef.current = false;
                _setGenreDelay(false);
            }, constants.EPG_UI_TIMEOUT * 1000);
        }
    };

    const genreHoveredListener = (isHovered) => {
        setGenreIsHovered(isHovered);
    };

    const activatePlayerUI = (show = true) => {
        //console.log('activate', show);
        clearTimeout(startupTimer);
        if (genreIsHoveredRef.current) {
            //clearTimeout(inactiveTimer);
            clearTimeout(isScrollingTimer);
            cancelAnimationFrame(scrollingAnimationFrame);
            setIsScrolling(false);
        }
        let shouldShow = show;
        // If trying to hide, but user is scrolling or hovered over genre then keep showing
        if (
            !shouldShow &&
            (isScrollingRef.current ||
                genreIsHoveredRef.current ||
                genreDelayRef.current)
        ) {
            shouldShow = true;
        }

        setUserIsActive(shouldShow);

        /* if(!shouldShow){
            console.trace();
        }*/
    };

    let pDownHandler,
        pMoveHandler,
        pLeaveHandler,
        mMoveHandler,
        mLeaveHandler,
        containerTouch,
        containerTouchEnd,
        inactiveTimer,
        inactiveFix;
    const hoverHandler = () => {
        const containerEl = epgPageRef.current;

        containerTouch = (e) => {
            mCount = 20;
            clearTimeout(inactiveTimer);
            if (!(e.target instanceof HTMLSelectElement)) {
                setGenreIsHovered(false);
            }
            activatePlayerUI(true);
        };

        containerTouchEnd = (e) => {
            clearTimeout(inactiveTimer);
            if (!(e.target instanceof HTMLSelectElement)) {
                inactiveTimer = setTimeout(
                    () => activatePlayerUI(false),
                    constants.EPG_UI_TIMEOUT * 1000
                );
            }
        };

        let mx, my;
        let mCount = 1;
        const containerMouse = (e) => {
            if (!inactiveFix) {
                clearTimeout(inactiveTimer);
                activatePlayerUI(true);
                inactiveTimer = setTimeout(
                    () => activatePlayerUI(false),
                    constants.EPG_UI_TIMEOUT * 1000
                );
                inactiveFix = true;
            } else {
                if (mx !== e.clientX || my !== e.clientY) {
                    mCount++;
                    if (mCount > 10) {
                        inactiveFix = false;
                        mCount = 1;
                    }
                }
            }
            mx = e.clientX;
            my = e.clientY;
        };

        if (!isMobile) {
            // Edge Browser
            if (hasPointerEvents()) {
                pDownHandler = (e) => {
                    // Windows Touch (Use touchstart logic)
                    inactiveFix = false;
                    if (getPointerType(e) === "touch") {
                        containerTouch(e);
                    } else {
                        containerMouse(e);
                    }
                };
                containerEl.addEventListener(
                    "pointerdown",
                    pDownHandler,
                    false
                );
                pMoveHandler = (e) => {
                    if (getPointerType(e) === "mouse") {
                        containerMouse(e);
                    }
                };
                containerEl.addEventListener(
                    "pointermove",
                    pMoveHandler,
                    false
                );
                pLeaveHandler = (e) => {
                    // Windows Touch (Use touchstart logic)
                    if (getPointerType(e) !== "touch") {
                        activatePlayerUI(false);
                    }
                };
                containerEl.addEventListener(
                    "pointerleave",
                    pLeaveHandler,
                    false
                );
            } else {
                mMoveHandler = (e) => {
                    containerMouse(e);
                };
                containerEl.addEventListener("mousemove", mMoveHandler, false);
                mLeaveHandler = (e) => {
                    activatePlayerUI(false);
                };
                containerEl.addEventListener(
                    "mouseleave",
                    mLeaveHandler,
                    false
                );
            }
        } else {
            containerEl.addEventListener("touchstart", containerTouch, false);
            containerEl.addEventListener("touchend", containerTouchEnd, false);
        }
    };

    const removeHoverHandler = () => {
        const containerEl = epgPageRef.current;
        containerEl.removeEventListener("pointerdown", pDownHandler, false);
        containerEl.removeEventListener("pointermove", pMoveHandler, false);
        containerEl.removeEventListener("pointerleave", pLeaveHandler, false);
        containerEl.removeEventListener("mousemove", mMoveHandler, false);
        containerEl.removeEventListener("mouseleave", mLeaveHandler, false);
        containerEl.removeEventListener("touchstart", containerTouch, false);
        containerEl.removeEventListener("touchend", containerTouchEnd, false);
    };

    let interval;
    let startupTimer;
    React.useEffect(() => {
        interval = setInterval(() => {
            if (store.playerInstance && store.playerInstance.vjs) {
                clearInterval(interval);
                store.playerInstance.vjs.on("useractive", userActive);
                window.addEventListener("scroll", epgScroll, false);
                hoverHandler();
                startupTimer = setTimeout(() => {
                    activatePlayerUI(false);
                }, constants.EPG_UI_TIMEOUT * 2000);
            }
        }, 16);
        return () => {
            //console.log('channel video listeners removed');
            clearInterval(interval);
            clearTimeout(startupTimer);
            if (store.playerInstance && store.playerInstance.vjs) {
                store.playerInstance.vjs.off("useractive", userActive);
            }
            window.removeEventListener("scroll", epgScroll, false);
            removeHoverHandler();
        };
    }, []);
    console.log("Channel data", result[0]);
    return useObserver(() =>
        !pageError ? (
            <div
                ref={epgPageRef}
                className={!userIsActive ? " epgInactive" : ""}
            >
                <LocalSEOTags pageType={pageType} seoObj={currentSEO} />
                <h1 className="noShow">Channels</h1>
                <div className="container">
                    <div className="epgPlayer" ref={playerContainer}>
                        <div className="live-watching">
                            {constants.WATCHING}
                        </div>
                        <Player
                            pageType={pageType}
                            video={firstVideo}
                            showPlayer={store.showPlayer}
                        />
                        <div className="ads">
                            <img
                                src="https://images.dotstudiopro.com/60b5b1e72c75020f1a1b8883/250/400"
                                alt="Adds"
                            />
                        </div>
                    </div>
                    <div className="epg-container">
                        <div>
                            <EPGList
                                className={!userIsActive ? "epgInactive" : ""}
                                data={result}
                                onClick={setFirstVideo}
                                changeCurrentSlug={changeCurrentSlug}
                                currentSlug={epgListCurrentSlug}
                                activatePlayerUI={activatePlayerUI}
                                genres={genres}
                                promos={promos}
                                genreHoveredListener={(isHovered) =>
                                    genreHoveredListener(isHovered)
                                }
                                pageType={pageType}
                            />
                        </div>
                    </div>
                </div>
                {/*<pre>{JSON.stringify(page, null, 2)}</pre>*/}
            </div>
        ) : (
            <Error404 />
        )
    );
}
Channel.getLayout = getLayout;

export const getServerSideProps = async ({ req, res, query }) => {
    const slug = !isEmpty(query) ? query.slug[0] : "";
    const { session, config } = await getSession(req, res);
    const routes = [
        "/api/dsp/live/epg",
        "/api/dsp/company/available/genres/live",
    ];
    const pageOptions = { req, routes, session, config };
    const page = await pageBuilder(pageOptions);
    let error = pageError([session, config, page]);

    let seoObj = {
        title: "Channels",
    };
    if (slug) {
        const channel = page.channels.find((c) => c.slug === slug);
        if (channel && channel.name) {
            seoObj.title = channel.name;
            seoObj.image = channel.logo;
        } else {
            error = true;
        }
    }
    if (page.channels && page.channels.length === 0) {
        error = true;
    }

    if (error) {
        res.statusCode = 404;
    }

    return {
        props: {
            session: session || null,
            config: config || null,
            page: page || null,
            slug: slug || null,
            pageError: error || false,
            pageType: "channel",
            seoObj: seoObj || null,
        },
    };
};
