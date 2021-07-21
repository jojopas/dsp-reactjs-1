import React from "react";
import { useRouter } from "next/router";
import { useObserver } from "mobx-react-lite";

import { StoreContext } from "../../store";
import { duration } from "../../helpers/utils/time";
import { constants } from "../../config";
import Button from "../button/Button";
import InlineSVG from "../InlineSVG";
import Share from "./Share";
import "./PDPTop.less";

export default function PDPTop({ type, pdp, currVideo = null }) {
    const store = React.useContext(StoreContext);
    const router = useRouter();

    const [descIsClamped, setDescIsClamped] = React.useState(false);
    const [descHasClamp, setDescHasClamp] = React.useState(false);
    const [shareTipOpen, setShareTipOpen] = React.useState(false);

    const resetState = () => {
        setDescHasClamp(false);
        setDescIsClamped(false);
    };

    React.useEffect(() => {
        const pdpHeight = document.querySelector(".pdp-top").clientHeight;
        const pdpBg = document.querySelector(".pdp-bg")
        console.log('pdp height', pdpHeight);
        pdpBg.style.cssText = `padding-Top: ${
            pdpHeight + 100
        }px`;
    }, []);

    const measureDescRef = React.useCallback(
        (node) => {
            resetState();
            if (node !== null) {
                const maxLines = 3;
                const lineHeight = parseInt(
                    getComputedStyle(node, null).getPropertyValue("line-height")
                );
                const cs = getComputedStyle(node);
                const clamp =
                    maxLines * lineHeight <
                    node.scrollHeight - parseInt(cs.paddingTop);
                setDescHasClamp(clamp);
                if (clamp) {
                    setDescIsClamped(true);
                }
            }
        },
        [pdp]
    );

    const toggleDesc = () => {
        setDescIsClamped(!descIsClamped);
    };

    const triggerShare = async (e) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: pdp.title,
                    url: router.asPath,
                });
            } catch (error) {
                // https://developer.apple.com/forums/thread/662629
                //console.log('share error: ', error);
            }
        } else {
            setShareTipOpen(true);
        }
    };

    const launchPlayer = (vId, currVideo) => {
        if (vId) {
            currVideo && vId !== currVideo
                ? store.loadVideo({ id: vId })
                : null;
            store.setShowPlayer(true);
            store.playerInstance?.startConvivaSession();
        }
    };

    return useObserver(() =>
        store.isBreakpoint ? (
            <div className="pdp-top">
                <div className="pdp-top-img">
                    <img
                        src={constants.NOT_FOUND_SRC}
                        data-sizes="auto"
                        data-srcset={`${pdp.poster}/200 200w,
                    ${pdp.poster}/300 300w,
                    ${pdp.poster}/400 400w,
                    ${pdp.poster}/500 500w,
                    ${pdp.poster}/600 600w`}
                        data-src={`${pdp.poster}/300`}
                        alt={pdp.title}
                        className="lazyload"
                    />
                </div>
                <div className="pdp-top-info">
                    <h1>{pdp.title}</h1>
                    <div className="pdp-top-ratingBar">
                        <span className="pdp-top-rating">{pdp.rating}</span>

                        <span className="pdp-top-year">{pdp.year}</span>
                        {type === "movie" ? (
                            <span className="pdp-top-duration">
                                {duration(pdp.duration, true)}
                            </span>
                        ) : pdp.seasons ? (
                            <span className="pdp-top-seasons">{`${
                                pdp.seasons.length
                            } ${constants.SEASON}${
                                pdp.seasons.length > 1 ? "s" : ""
                            }`}</span>
                        ) : null}
                    </div>
                    <div className="pdp-top-buttonBar">
                        <Button
                            className="pdp-top-watchNowButton button-current"
                            inner={constants.WATCH_NOW}
                            svg="play"
                            onClick={() =>
                                launchPlayer(
                                    pdp.videoId
                                        ? pdp.videoId
                                        : pdp.seasons[0].cards[0].id,
                                    currVideo
                                )
                            }
                        />
                        {/*<Button className="pdp-top-startOverButton" inner={constants.START_OVER} />*/}
                        {pdp.trailer ? (
                            <Button
                                className="pdp-top-trailerButton"
                                inner={constants.TRAILER}
                                onClick={() => launchPlayer(pdp.trailer)}
                            />
                        ) : null}
                    </div>

                    <div
                        className={`pdp-top-description${
                            descIsClamped ? " pdp-top-description-more" : ""
                        }`}
                        ref={measureDescRef}
                    >
                        {pdp.description}
                    </div>
                    {descHasClamp ? (
                        <Button
                            className="button-small pdp-top-description-moreButton"
                            inner={
                                descIsClamped ? constants.MORE : constants.LESS
                            }
                            onClick={toggleDesc}
                        />
                    ) : null}
                </div>
            </div>
        ) : (
            <div className="pdp-top">
                <div className="pdp-top-info">
                    <h1>{pdp.title}</h1>
                    <div className="pdp-top-ratingBar">
                        {type === "movie" ? (
                            <span className="pdp-top-duration">
                                {duration(pdp.duration, true)}
                            </span>
                        ) : pdp.seasons ? (
                            <span className="pdp-top-seasons">{`${
                                pdp.seasons.length
                            } ${constants.SEASON}${
                                pdp.seasons.length > 1 ? "s" : ""
                            }`}</span>
                        ) : null}
                        <span className="pdp-top-year">{pdp.year}</span>
                        <span className="pdp-top-rating">{pdp.rating}</span>
                    </div>

                    <div
                        className={`pdp-top-description${
                            descIsClamped ? " pdp-top-description-more" : ""
                        }`}
                        ref={measureDescRef}
                    >
                        {pdp.description}
                    </div>
                    {descHasClamp ? (
                        <Button
                            className="button-small pdp-top-description-moreButton"
                            inner={
                                descIsClamped ? constants.MORE : constants.LESS
                            }
                            onClick={toggleDesc}
                        />
                    ) : null}
                    <div className="pdp-top-toolBar">
                        {/*<span className="pdp-top-likeButton">{watchNow}</span>
                            <span className="pdp-top-dislikeButton">Start Over</span>
                            <span className="pdp-top-watchlistButton">Trailer</span>*/}
                        {/* <span
                            className="pdp-top-shareButton"
                            title={constants.SHARE}
                            onClick={triggerShare}
                            onMouseLeave={() => setShareTipOpen(false)}
                        >
                            <InlineSVG type="share" />
                            <Share
                                className={shareTipOpen ? "share-tip-open" : ""}
                                title={pdp.title}
                            />
                        </span> */}
                    </div>

                    <div className="pdp-top-buttonBar">
                        <Button
                            className="pdp-top-watchNowButton"
                            inner={constants.WATCH_NOW}
                            svg="play"
                            onClick={() =>
                                launchPlayer(
                                    pdp.videoId
                                        ? pdp.videoId
                                        : pdp.seasons[0].cards[0].id,
                                    currVideo
                                )
                            }
                        />
                        {/*<Button className="pdp-top-startOverButton" inner={constants.START_OVER} />*/}
                        {pdp.trailer ? (
                            <Button
                                className="pdp-top-trailerButton"
                                inner={constants.TRAILER}
                                onClick={() => launchPlayer(pdp.trailer)}
                            />
                        ) : null}
                    </div>
                </div>
                <div className="pdp-top-img">
                    <img
                        src={constants.NOT_FOUND_SRC}
                        data-sizes="auto"
                        data-srcset={`${pdp.poster}/200 200w,
                    ${pdp.poster}/300 300w,
                    ${pdp.poster}/400 400w,
                    ${pdp.poster}/500 500w,
                    ${pdp.poster}/600 600w`}
                        data-src={`${pdp.poster}/300`}
                        alt={pdp.title}
                        className="lazyload"
                    />
                </div>
            </div>
        )
    );
}
