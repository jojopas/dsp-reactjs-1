import React from "react";
import axios from "axios";
import { useObserver } from "mobx-react-lite";

import { StoreContext } from "../../store";
import { setupPlayer, disposePlayer } from "./setup";
import "./Player.less";
import InlineSVG from "../InlineSVG";
import { fadeIn, fadeOut } from "../../helpers/utils/fade";

export default function Player({
    pageType,
    video = null,
    autostart = true,
    showPlayer,
}) {
    const store = React.useContext(StoreContext);
    const plyrRef = React.useRef(null);
    const outerPlyrRef = React.useRef(null);
    const playerCloseButton = React.useRef(null);

    const lightBoxPageTypes = ["movie", "show"];
    const showPlayerAtStartPageTypes = ["home", "channel"];
    const [playerStyle, setPlayerStyle] = React.useState({});

    const vodPage = lightBoxPageTypes.includes(pageType);
    // console.log("store", store.playerInstance);
    React.useEffect(() => {
        (async () => {
            if (!plyrRef && !window) {
                return;
            }
            // Get SpringServer ID
            if (!store.springServeId) {
                try {
                    const { data } = await axios({
                        method: "GET",
                        url: "https://sync.springserve.com/usersync/json",
                    });

                    if (data && data.user_id) {
                        store.setSpringServeId(data.user_id);
                    }
                } catch (error) {
                    console.log("springserve error", error);
                }
            }
            if (!store.isPlayerSetup && video) {
                //console.log('player video', video);
                const videoData =
                    video && video.id
                        ? { id: video.id }
                        : video && video.url
                        ? { url: video.url, vmap: video.vmap, meta: video.meta }
                        : null;
                const player = await setupPlayer(plyrRef, videoData, {
                    autostart,
                    ssid: store.springServeId,
                    vodPage,
                });
                store.setIsPlayerSetup(true);
                store.setPlayerInstance(player);
            }
        })();
    }, [plyrRef, video]);

    React.useEffect(() => {
        const plyrStyle = lightBoxPageTypes.includes(pageType)
            ? "lightbox"
            : "inline";
        setPlayerStyle(plyrStyle);
        const showPlayerState = showPlayerAtStartPageTypes.includes(pageType);
        if (!lightBoxPageTypes.includes(pageType)) {
            store.setShowPlayer(showPlayerState);
        }

        if (plyrStyle === "lightbox") {
            if (showPlayer) {
                fadeIn(outerPlyrRef.current);
                if (
                    store.playerInstance &&
                    store.playerInstance.vjs &&
                    (!store.playerInstance.vjs.autoplay() ||
                        (store.playerInstance.vjs.paused() &&
                            store.playerInstance.vjs.currentTime() > 1))
                ) {
                    setTimeout(() => store.playerInstance.vjs.play(), 500);
                }
            } else {
                fadeOut(outerPlyrRef.current);
            }

            if (window) {
                const body = document.querySelector("body");
                showPlayer
                    ? body.classList.add("bodyisLocked")
                    : body.classList.remove("bodyisLocked");
            }
        } else {
            outerPlyrRef.current.style.display = showPlayer ? "" : "none";
        }

        return () => {
            const body = document.querySelector("body");
            body.classList.remove("bodyisLocked");
        };
    }, [pageType, showPlayer]);

    React.useEffect(() => {
        if (!store.playerContainerRef) {
            store.setPlayerContainerRef(outerPlyrRef.current);
        }
    }, [outerPlyrRef]);

    const userActive = () => {
        //console.log('user active event');
        if (playerCloseButton && playerCloseButton.current) {
            //console.log(playerCloseButton.current);
            fadeIn(playerCloseButton.current);
        }
    };

    const userInActive = () => {
        //console.log('user inactive event');
        if (playerCloseButton && playerCloseButton.current) {
            //console.log(playerCloseButton.current);
            fadeOut(playerCloseButton.current);
        }
    };

    const ended = () => {
        //console.log('ended event');
        const plyrStyle = lightBoxPageTypes.includes(pageType)
            ? "lightbox"
            : "inline";
        if (plyrStyle === "lightbox") {
            //console.log('lightbox ended event');
            fadeIn(playerCloseButton.current);
            fadeOut(outerPlyrRef.current);
            store.setShowPlayer(false);
        }
    };

    const playEvent = () => {
        //console.log('play event');
        if (
            playerCloseButton &&
            playerCloseButton.current &&
            !store.playerInstance.vjs.userActive()
        ) {
            fadeOut(playerCloseButton.current);
        }
        store.setIsAdRunning(false);
    };

    const fullscreenChange = () => {
        //console.log('fullscreenChange: is full', store.playerInstance.vjs.isFullscreen());
        if (
            !store.playerInstance.vjs.isFullscreen() &&
            store.playerInstance.vjs.paused() &&
            !store.isAdRunning
        ) {
            store.playerInstance.vjs.play();
        }
    };

    const adsStarted = () => {
        //console.log('ad started');
        store.setIsAdRunning(true);
    };

    const adsCompleted = () => {
        //console.log('ad ended');
        store.setIsAdRunning(false);
    };

    const adsReady = () => {
        store.playerInstance.vjs.ima.addEventListener(
            google.ima.AdEvent.Type.STARTED,
            adsStarted
        );
        store.playerInstance.vjs.ima.addEventListener(
            google.ima.AdEvent.Type.COMPLETE,
            adsCompleted
        );
    };

    let interval;
    React.useEffect(() => {
        interval = setInterval(() => {
            if (store.playerInstance && store.playerInstance.vjs) {
                clearInterval(interval);
                //console.log('lightbox player event listeners added');
                store.playerInstance.vjs.on("play", playEvent);
                store.playerInstance.vjs.on("useractive", userActive);
                store.playerInstance.vjs.on("userinactive", userInActive);
                store.playerInstance.vjs.on("ended", ended);
                store.playerInstance.vjs.on(
                    "fullscreenchange",
                    fullscreenChange
                );
                store.playerInstance.vjs.on("ads-manager", adsReady);
            }
        }, 16);
        return () => {
            clearInterval(interval);
            if (store.playerInstance && store.playerInstance.vjs) {
                //console.log('lightbox player event listeners removed');
                store.playerInstance.vjs.off("play", playEvent);
                store.playerInstance.vjs.off("useractive", userActive);
                store.playerInstance.vjs.off("userinactive", userInActive);
                store.playerInstance.vjs.off("ended", ended);
                store.playerInstance.vjs.off(
                    "fullscreenchange",
                    fullscreenChange
                );
                store.playerInstance.vjs.off("ads-manager", adsReady);
                if (
                    store.playerInstance.vjs.ima &&
                    store.playerInstance.vjs.ima.removeEventListener
                ) {
                    store.playerInstance.vjs.ima.removeEventListener(
                        google.ima.AdEvent.Type.STARTED,
                        adsStarted
                    );
                    store.playerInstance.vjs.ima.removeEventListener(
                        google.ima.AdEvent.Type.COMPLETE,
                        adsCompleted
                    );
                }
            }

            store.setIsPlayerSetup(false);
            store.setPlayerInstance(null);
            store.setShowPlayer(false);
            store.setIsAdRunning(false);
            disposePlayer();
        };
    }, []);

    const closeLightBox = () => {
        store.setShowPlayer(false);
        if (store.playerInstance && store.playerInstance.vjs) {
            if (!store.playerInstance.vjs.isInPictureInPicture()) {
                store.playerInstance.vjs.pause();
            }
            store.playerInstance.endConvivaSession();
        }
    };

    return useObserver(() => {
        return (
            <div
                className={`player-container player-${playerStyle}`}
                style={{ display: "none" }}
                ref={outerPlyrRef}
            >
                {lightBoxPageTypes.includes(pageType) ? (
                    <button
                        ref={playerCloseButton}
                        className="player-close"
                        onClick={() => closeLightBox()}
                        title="Close"
                    >
                        <InlineSVG type="close" />
                    </button>
                ) : null}
                <div id="dsp-player" ref={plyrRef} />
                <div className="player-halfHeight" />
            </div>
        );
    });
}
