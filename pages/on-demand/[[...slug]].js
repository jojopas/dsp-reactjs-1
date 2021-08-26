import React from "react";
import { useRouter } from 'next/router';

import getSession from "../../helpers/session/get-session";
import pageError from "../../helpers/page/error";
import { getLayout } from "../../components/Layout";
import { StoreContext } from "../../store";
import { pageBuilder } from "../../helpers/page/builder";
import Error404 from "../../components/404";
import CardList from "../../components/cardList/CardList";
import Carousel from "../../components/carousel/Carousel";
import FeaturedView from "../../components/carousel/FeaturedView";
import ExtendedGenre from "../../components/Genre/ExtendedGenre";
import {slugify} from '../../helpers/utils/strings';

import "./index.less";

export default function OnDemand({page, error}) {
    const store = React.useContext(StoreContext);
    const router = useRouter();

    const [width, setWidth] = React.useState();
    const [viewAllData, setViewAllData] = React.useState(null);

    const viewAllClick = (railIndex) => {
        const railData = (railIndex !== null) ? page.rails[railIndex+1] : null;
        let path = '/on-demand/[[...slug]]';
        let as = '/on-demand';
        if(railIndex !== null) {
            as = `${as}/all/${slugify(railData.category.name)}`;
            window.scrollTo(0,0);
        }
        router.push(path, as, {shallow: true});
    };

    const routeFix = (url) => {
        const pathParts = url.substring(1).split('/');
        let newRailData;
        if(pathParts.length === 3){
            newRailData = page.rails.filter(obj => {
                return slugify(obj.category.name) === pathParts[2];
            })[0];
        }
        setViewAllData(newRailData);

    }

    React.useEffect(() => {
        if(window.location.pathname !== '/on-demand'){
            routeFix(window.location.pathname);
        }

        router.events.on('routeChangeComplete', routeFix);

        return () => {
            router.events.off('routeChangeComplete', routeFix);
        }
    }, []);

    React.useEffect(() => {
        if (!width && typeof window !== "undefined") {
            setWidth(window.innerWidth);
        }
    }, [width]);

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
    return (
        !error ? (
            viewAllData ? (
                <ExtendedGenre
                    data={viewAllData}
                    setClickedCardTitle={viewAllClick}
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
                    {page.rails.slice(1).map((rail, index) =>
                        (
                            <CardList
                                key={rail.category.id}
                                type="title"
                                data={rail}
                                isOnDemand={true}
                                index={index}
                                onHeaderClick={viewAllClick}
                            />
                        )
                    )}
                </>
            )
        ) : (
            <Error404 />
        )
    )
}
OnDemand.getLayout = getLayout;

export const getServerSideProps = async ({ req, res }) => {
    let { session, config } = await getSession(req, res);
    const routes = [
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
            seoObj: {
                title: "On Demand"
            },
        },
    };
};
