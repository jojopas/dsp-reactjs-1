import React from "react";
import { useObserver } from "mobx-react-lite";
import useSWR from "swr";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

import getSession from "../../helpers/session/get-session";
import pageError from "../../helpers/page/error";
import { getLayout } from "../../components/Layout";
import { StoreContext } from "../../store";
import Error404 from "../../components/404";
import { slugify } from "../../helpers/utils/strings";

import "./index.less";
import "../../components/cards/Cards.less";
import CardList from "../../components/cardList/CardList";
import InlineSVG from "../../components/InlineSVG";
import { constants } from "../../config";
import { isEmpty } from "../../helpers/utils/objects";
import { fetchData } from "../../helpers/utils/fetch-data";

export default function Search({
    session,
    config,
    query,
    pageError,
    pageType,
    seoObj,
}) {
    const store = React.useContext(StoreContext);

    const allRefs = React.useRef([0, 1, 2].map(() => React.createRef()));
    const activeBarRef = React.useRef(null);
    const [searchQuery, setSearchQuery] = React.useState(
        query.searchQuery
            ? query.searchQuery[0]
                  .replace(/-/g, " ")
                  .replace(/[^0-9a-zA-Z ]+/, "")
            : ""
    );
    const [currentSearchType, setCurrentSearchType] = React.useState(0);
    //const { data, error, isValidating } = useSWR(searchQuery ? `${publicRuntimeConfig.BASE_URL}/api/dsp/search/${searchQuery.replace(/[^0-9a-zA-Z ]+/, '')}` : null, async (url) => await fetchData(url));
    const { data, error, isValidating } = useSWR(
        searchQuery
            ? `/api/dsp/find/${searchQuery.replace(/[^0-9a-zA-Z ]+/, "")}`
            : null,
        async (url) => await fetchData(url)
    );

    const {
        data: channelData,
        error: errorChannel,
        isValidating: isValidatingChannel,
    } = useSWR(
        searchQuery
            ? `/api/dsp/findChannels/${searchQuery.replace(
                  /[^0-9a-zA-Z ]+/,
                  ""
              )}`
            : null,
        async (url) => await fetchData(url)
    );
    const [result, setResult] = React.useState(null);

    const setBarLine = () => {
        const activeNavItem =
            allRefs.current[currentSearchType] &&
            allRefs.current[currentSearchType].current;

        const { offsetLeft, offsetWidth } = activeNavItem;
        activeBarRef.current.style.transform = `translateX(${offsetLeft}px) translateY(-5px)`;
        activeBarRef.current.style.width = `${offsetWidth}px`;
    };
    React.useEffect(() => {
        const res = {};
        let flag = false;
        if (data && data.data && data.data.data && data.data.data.results) {
            flag = true;
            res.demand = data.data.data.results;
            res.demand.category = { name: "Movies" };
            res.demand.cards = res.demand.cards.map((card) => {
                card.slug = `${card.type}/${card.slug}`;
                return card;
            });
        }

        if (channelData?.data?.data?.programs) {
            flag = true;

            res.channel = {
                cards: channelData?.data?.data?.programs,
                category: { name: " LIVE CHANNELS" },
            };
            res.channel.cards = res.channel.cards.map((card) => {
                card.slug = `channel/${card.channel.slug}`;
                return card;
            });
        }

        if (flag) {
            setBarLine();
        }

        setResult(flag ? res : null);
    }, [data, channelData]);

    React.useEffect(() => {
        if (searchQuery && slugify(searchQuery) !== "") {
            history.replaceState({}, "", `/search/${slugify(searchQuery)}`);
        } else {
            history.replaceState({}, "", "/search");
        }
    }, [searchQuery]);

    React.useEffect(() => {
        if (result) {
            setBarLine();
        }
    }, [currentSearchType]);

    const showChannel = currentSearchType == 0 || currentSearchType == 1;
    const showOnDemand = currentSearchType == 0 || currentSearchType == 2;
    let channelCards = [];
    if (showChannel) {
        channelCards = result?.channel?.cards.map((card) => <div></div>);
    }
    console.log("Search", result);
    return useObserver(() =>
        !pageError && !error ? (
            <>
                <h1 className="noShow">Search</h1>
                <div className="searchTop">
                    <span className="searchField">
                        <input
                            className="searchField-input"
                            placeholder={constants.SEARCH_DEFAULT}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <InlineSVG type="search" />
                    </span>
                    <div
                        className={`searchResult-heading ${
                            result ? "" : "showNone"
                        }`}
                    >
                        <h2
                            className={currentSearchType == 0 ? "active" : ""}
                            ref={allRefs.current[0]}
                            onClick={() => setCurrentSearchType(0)}
                        >
                            All
                            <span className="count">
                                {result?.demand?.cards?.length +
                                    result?.channel?.cards?.length}
                            </span>
                        </h2>
                        <h2
                            ref={allRefs.current[1]}
                            className={currentSearchType == 1 ? "active" : ""}
                            onClick={() => setCurrentSearchType(1)}
                        >
                            LIVE CHANNELS
                            <span className="count">
                                {result?.channel?.cards?.length}
                            </span>
                        </h2>
                        <h2
                            ref={allRefs.current[2]}
                            className={currentSearchType == 2 ? "active" : ""}
                            onClick={() => setCurrentSearchType(2)}
                        >
                            ON DEMAND
                            <span className="count">
                                {result?.demand?.cards?.length}
                            </span>
                        </h2>
                    </div>
                    <span ref={activeBarRef} className="activeBar" />
                </div>
                {showChannel &&
                    result?.channel &&
                    !isEmpty(result.channel.cards) && (
                        <CardList
                            key="searchChannelResults"
                            type="channel"
                            showArrow={false}
                            data={result.channel}
                        />
                    )}
                {showOnDemand &&
                result &&
                result.demand &&
                !isEmpty(result.demand.cards) ? (
                    <CardList
                        key="searchOnDemandResults"
                        type="title"
                        showArrow={false}
                        data={result.demand}
                    />
                ) : searchQuery == "" ? null : isValidating ? (
                    <span className="searchResults-loading">
                        {constants.SEARCH_LOADING}
                    </span>
                ) : result &&
                  result.results &&
                  isEmpty(result.results.cards) ? (
                    <span className="searchResults-none">
                        {constants.NO_RESULTS}
                    </span>
                ) : null}
                {/*<pre>{JSON.stringify(result, null, 2)}</pre>*/}
            </>
        ) : (
            <Error404 />
        )
    );
}
Search.getLayout = getLayout;

export const getServerSideProps = async ({ req, res, query }) => {
    const { session, config } = await getSession(req, res);
    let error = pageError([session, config]);
    if (error) {
        res.statusCode = 404;
    }

    return {
        props: {
            session: session || null,
            config: config || null,
            query: query || null,
            pageError: error || false,
            pageType: "search",
            seoObj: {
                title: "Search",
            },
        },
    };
};
