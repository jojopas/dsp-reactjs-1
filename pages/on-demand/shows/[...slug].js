import React from "react";
import { useObserver } from "mobx-react-lite";

import { constants } from "../../../config";
import getSession from "../../../helpers/session/get-session";
import pageError from "../../../helpers/page/error";
import { getLayout } from "../../../components/Layout";
import { StoreContext } from "../../../store";
import { pageBuilder } from "../../../helpers/page/builder";
import Error404 from "../../../components/404";

import { slugify, titleCase } from "../../../helpers/utils/strings";
import { isEmpty } from "../../../helpers/utils/objects";
import PDPTop from "../../../components/pdp/PDPTop";
import PDPBg from "../../../components/pdp/PDPBg";
import ButtonList from "../../../components/buttonList/ButtonList";
import CardList from "../../../components/cardList/CardList";

import "./show.less";
import Player from "../../../components/player/Player";

export default function Show({
    session,
    config,
    page,
    slug,
    error,
    pageType,
    seoObj,
}) {
    const store = React.useContext(StoreContext);
    const { pdp } = page;

    const [firstVideo, _setFirstVideo] = React.useState(null);
    const firstVideoRef = React.useRef(firstVideo);
    const setFirstVideo = (data) => {
        //console.log('setFirstVideo', data);
        firstVideoRef.current = data;
        _setFirstVideo(data);
    };

    const [currVideo, _setCurrVideo] = React.useState(
        pdp.videoId
            ? pdp.videoId
            : pdp.seasons
            ? pdp.seasons[0].cards[0].id
            : null
    );
    const currVideoRef = React.useRef(currVideo);
    const setCurrVideo = (data) => {
        //console.log('setCurrVideo', data);
        currVideoRef.current = data;
        _setCurrVideo(data);
    };

    const [currSeason, setCurrSeason] = React.useState(1);
    const [currEpisode, setCurrEpisode] = React.useState(1);

    let genres = {};
    if (pdp.genres) {
        genres = pdp.genres.map((genre) => ({
            id: `genre-${genre}`,
            url: "/shows/genre/[...slug]",
            as: `/shows/genre/${slugify(genre)}`,
            inner: titleCase(genre),
            className: "button-medium",
        }));
    }

    let tags = {};
    if (pdp.tags) {
        tags = pdp.tags.map((tag) => ({
            id: `tag-${tag}`,
            url: "/search/[[...searchQuery]]",
            as: `/search/${slugify(tag)}`,
            inner: titleCase(tag),
            className: "button-medium",
        }));
    }

    const handleSeasonClick = (index) => {
        setCurrSeason(index + 1);
        setCurrEpisode(1);
    };

    let seasons;
    if (pdp.seasons) {
        seasons = pdp.seasons.map((season, index) => ({
            id: `season-${season.season.number}`,
            inner: `${season.season.number}`,
            episodes: `${season.season.episodes} Ep`,
            className: "button-season",
            type: "season",
            onClick: () => handleSeasonClick(index),
        }));
    }

    let moreLikeThis;
    if (page.results && page.results.cards && page.results.cards.length > 0) {
        moreLikeThis = {
            category: {
                name: constants.MORE_LIKE_THIS,
                displayType: "default",
            },
            cards: page.results.cards,
        };
    }

    const playEpisode = (vId) => {
        if (vId) {
            store.loadVideo({ id: vId });
            store.setShowPlayer(true);
            setCurrVideo(vId);
            store.playerInstance.startConvivaSession();
        }
    };

    React.useEffect(() => {
        if (window) {
            setFirstVideo({
                id: pdp.videoId
                    ? pdp.videoId
                    : pdp.seasons
                    ? pdp.seasons[0].cards[0].id
                    : null,
            });
        }
    }, [page]);
    return useObserver(() =>
        !error ? (
            <>
                <div className="pdp-shows pdp-outer">
                    <PDPBg pdp={pdp} />
                    <PDPTop pdp={pdp} type="show" currVideo={currVideo} />
                    <div className="pdp-episodic">
                        {seasons && seasons.length > 1 ? (
                            <ButtonList
                                className="pdp-seasons"
                                current={currSeason}
                                data={seasons}
                            />
                        ) : (
                            <span className="pdp-seasons-empty" />
                        )}
                    </div>
                    {pdp.seasons ? (
                        <CardList
                            key={`episodes-${currSeason}`}
                            type="video"
                            useHeader={false}
                            onClick={playEpisode}
                            current={currEpisode}
                            data={pdp.seasons[currSeason - 1]}
                        />
                    ) : null}
                    {moreLikeThis ? (
                        <div className="pdp-more-like-this">
                            <CardList
                                key={`more-${pdp.id}`}
                                type="title"
                                showArrow={false}
                                data={moreLikeThis}
                            />{" "}
                        </div>
                    ) : null}
                    {/* { genres.length > 0 ? (
                        <ButtonList className="pdp-genres" type="grid" header={constants.GENRES} data={genres} />
                    ) : null}
                    { tags.length > 0 ? (
                        <ButtonList className="pdp-tags" type="grid" header={constants.TAGS} data={tags} />
                    ) : null} */}
                </div>
                <Player
                    pageType={pageType}
                    video={firstVideo}
                    autostart={false}
                    showPlayer={store.showPlayer}
                />
                {/*<pre>{JSON.stringify(page, null, 2)}</pre>*/}
            </>
        ) : (
            <Error404 />
        )
    );
}
Show.getLayout = getLayout;

export const getServerSideProps = async ({ req, res, query }) => {
    const slug = query.slug[0];
    const { session, config } = await getSession(req, res);
    const routes = [
        `/api/dsp/channel/${constants.DSP_COUNTRY}/${slug}`,
        `/api/dsp/search/recommendation/channel/${slug}`,
    ];
    const pageOptions = { req, routes, session, config };
    const page = await pageBuilder(pageOptions);

    let error = pageError([session, config, page]);

    if (isEmpty(page.pdp)) {
        error = true;
    }

    let seoObj = {};
    if (error) {
        res.statusCode = 404;
    } else {
        seoObj = {
            title: page.pdp.title,
            description: page.pdp.shortDescription,
            image: page.pdp.poster,
            duration: page.pdp.duration,
        };
    }

    return {
        props: {
            session: session || null,
            config: config || null,
            page: page || null,
            slug: slug || null,
            error: error || false,
            pageType: "show",
            seoObj: seoObj,
        },
    };
};
