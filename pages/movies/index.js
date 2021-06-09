import React from "react";
import { useObserver } from "mobx-react-lite";

import getSession from "../../helpers/session/get-session";
import pageError from "../../helpers/page/error";
import { getLayout } from "../../components/Layout";
import { StoreContext } from "../../store";
import { pageBuilder } from "../../helpers/page/builder";
import Error404 from "../../components/404";

import "./index.less";
import CardList from "../../components/cardList/CardList";
import Carousel from "../../components/carousel/Carousel";
import Nav from "../../components/nav/Nav";
import { slugify } from "../../helpers/utils/strings";
import GenreSelector from "../../components/nav/GenreSelector";
import Button from "../../components/button/Button";
import { constants } from "../../config";
export default function Movies({
    session,
    config,
    page,
    error,
    pageType,
    seoObj,
}) {
    const store = React.useContext(StoreContext);
    const [width, setWidth] = React.useState();
    const genreNav = page.genres?.map((genre) => {
        return {
            id: genre,
            inner: genre,
            url: `/movies/genre/[...slug]`,
            as: `/on-demand/genre/${slugify(genre)}`,
        };
    });
    React.useEffect(() => {
        if (!width && typeof window !== "undefined") {
            setWidth(window.innerWidth);
        }
    }, [width]);
    const views = width
        ? page?.rails
            ? page?.rails[0].cards.map((el) => (
                  // <PromoCard {...el} />
                  <div key={el.title}>
                      <div
                          className="carousel"
                          style={{
                              background: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 39%, rgba(0, 0, 0, 1) 100%),url("${el.image}/${width}/500"), no-repeat`,
                              //   background: `url("${el.image}/${width}/500"), no-repeat`,
                          }}
                      >
                          <div className="carousel-title">{el.title}</div>
                          <div className="carousel-description">{el.title}</div>
                          <Button
                              inner={constants.WATCH_NOW}
                              onClick={() =>
                                  launchPlayer(
                                      pdp.videoId
                                          ? pdp.videoId
                                          : pdp.seasons[0].cards[0].id,
                                      currVideo
                                  )
                              }
                          />
                      </div>
                  </div>
              ))
            : null
        : null;
    return useObserver(() =>
        !error ? (
            <>
                <h1 className="noShow">Movies</h1>
                {page.promos?.length > 0 ? (
                    <CardList
                        className="moviesPromo"
                        type="promo"
                        useHeader={false}
                        data={{ cards: page.promos }}
                    />
                ) : null}
                <Carousel views={views} className="carousel-container" />
                <GenreSelector type="movies" links={genreNav}></GenreSelector>
                {page.rails.map((rail) => (
                    <CardList key={rail.category.id} type="title" data={rail} />
                ))}
                {/*<pre>{JSON.stringify(page, null, 2)}</pre>*/}
            </>
        ) : (
            <Error404 />
        )
    );
}
Movies.getLayout = getLayout;

export const getServerSideProps = async ({ req, res }) => {
    const { session, config } = await getSession(req, res);
    const routes = [
        "/api/dsp/company/available/genres/movies",
        "/api/dsp/movies",
    ];
    const pageOptions = { req, routes, session, config };
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
            pageType: "general",
            seoObj: {
                title: "Movies",
            },
        },
    };
};
