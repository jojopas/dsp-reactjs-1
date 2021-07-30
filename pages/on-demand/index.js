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
    const [width, setWidth] = React.useState();
    const [clickedCardTitle, setClickedCardTitle] = React.useState();
    const genreNav = page.genres?.map((genre) => ({
        id: genre,
        inner: genre.toUpperCase(),
        url: `/movies/genre/[...slug]`,
        as: `/movies/genre/${slugify(genre)}`,
    }));

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
            ? page?.movies[0].channels
                  .map((el, index) =>
                      index > 5 ? null : (
                          <div key={el.title}>
                              <div
                                  className="carousel"
                                  style={{
                                      background: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 39%, rgba(0, 0, 0, 1) 100%),url("${el.wallpaper}/${width}/600"), no-repeat`,
                                  }}
                              >
                                  <div className="carousel-about">
                                      <div className="carousel-title">
                                          {el.title}
                                      </div>
                                      <p className="carousel-description">
                                          {el.description}
                                      </p>
                                      <Button
                                          inner={constants.WATCH_NOW}
                                          url={`/movies/${el.slug}`}
                                          as={`/movies/${el.slug}`}
                                      />
                                  </div>
                              </div>
                          </div>
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
                    <Carousel views={views} className="carousel-container" />

                    <div className="overflowWrapper">
                        {page.movies?.length > 0 ? (
                            <CardList
                                className="homePromo"
                                type="title"
                                isOnDemand={true}
                                data={page.rails[0]}
                                onHeaderClick={setClickedCardTitle}
                            />
                        ) : null}
                        {genreNav && (
                            <GenreSelector type="movies" links={genreNav} />
                        )}

                        {page.rails.map((rail, index) =>
                            index > 0 ? (
                                <CardList
                                    key={rail.category.id}
                                    type="title"
                                    data={rail}
                                    isOnDemand={true}
                                    onHeaderClick={setClickedCardTitle}
                                />
                            ) : null
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
        "/api/dsp/company/available/genres/movies",
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
