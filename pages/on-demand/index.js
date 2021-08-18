import React from "react";
import { useObserver } from "mobx-react-lite";

import getSession from "../../helpers/session/get-session";
import pageError from "../../helpers/page/error";
import { getLayout } from "../../components/Layout";
import { StoreContext } from "../../store";
import { pageBuilder } from "../../helpers/page/builder";
import Error404 from "../../components/404";
import CardList from "../../components/cardList/CardList";
import Carousel from "../../components/carousel/Carousel";
import Button from "../../components/button/Button";
import { constants } from "../../config";
import GenreSelector from "../../components/nav/GenreSelector";
import { slugify } from "../../helpers/utils/strings";
import FeaturedView from "../../components/carousel/FeaturedView";
import "./index.less";
import ExtendedGenre from "../../components/Genre/ExtendedGenre";

export default function OnDemand({
    session,
    config,
    page,
    error,
    pageType,
    seoObj,
}) {
    const store = React.useContext(StoreContext);

    const [width, setWidth] = React.useState();
    const [clickedCardTitle, setClickedCardTitle] = React.useState();
    /*const genreNav = page.genres?.map((genre) => ({
        id: genre,
        inner: genre.toUpperCase(),
        url: `/movies/genre/[...slug]`,
        as: `/movies/genre/${slugify(genre)}`,
    }));*/

    React.useEffect(() => {
        if (!width && typeof window !== "undefined") {
            setWidth(window.innerWidth);
        }
    }, [width]);

    React.useEffect(() => {
        if (clickedCardTitle) {
            history?.replaceState(
                null,
                "",
                `/category/${clickedCardTitle?.category?.name}`
            );
        } else {
            history?.replaceState(null, "", `/on-demand`);
        }
    }, [clickedCardTitle]);

    const views = width
        ? page?.movies
            ? page?.movies[0]?.channels
                  .map((el, index) =>
                      index > 5 ? null : (
                          <FeaturedView data={el} width={width} key={index} index={index} isMobile={store.isBreakpoint} />
                      )
                  )
                  .filter((view) => view)
            : null
        : null;

    // console.log("page", page);
    return useObserver(() =>
        !error ? (
            clickedCardTitle ? (
                <ExtendedGenre
                    data={clickedCardTitle}
                    setClickedCardTitle={setClickedCardTitle}
                />
            ) : (
                <>
                    <h1 className="noShow">On Demand</h1>
                    {/* <FeaturedView
                        data={page.movies[0].channels[5]}
                        width={width}
                        index={0}
                    /> */}
                    <div className="carousels-wrapper">
                        <Carousel
                            views={views}
                            className="carousel-container"
                        />
                    </div>
                    {/*{genreNav && (
                        <GenreSelector type="movies" links={genreNav} />
                    )}*/}
                    <div className="overflowWrapper">
                        {page.rails.slice(1).map((rail, index) =>
                            (
                                <CardList
                                    key={rail.category.id}
                                    type="title"
                                    data={rail}
                                    isOnDemand={true}
                                    onHeaderClick={setClickedCardTitle}
                                />
                            )
                        )}
                    </div>
                </>
            )
        ) : (
            <Error404 />
        )
    );
}
OnDemand.getLayout = getLayout;

export const getServerSideProps = async ({ req, res }) => {
    let { session, config } = await getSession(req, res);
    const routes = [
        //"/api/dsp/company/available/genres/movies",
        "/api/dsp/homepage",
        "/api/dsp/movies/US/ios",
    ];
    const pageOptions = { req, res, routes, session, config };
    const page = await pageBuilder(pageOptions);

    let error = pageError([session, config, page]);
    if (error) {
        res.statusCode = 404;
    }

    return {
        props: {
            session: session || null,
            config: config || null,
            page: page || null,
            error: error || false,
            pageType: "on-demand",
            seoObj: {},
        },
    };
};
