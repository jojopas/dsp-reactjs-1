import React from "react";
import useSWR from "swr";
import {useRouter} from 'next/router';
import getConfig from "next/config";

import getSession from "../../helpers/session/get-session";
import pageError from "../../helpers/page/error";
import { getLayout } from "../../components/Layout";
import Error404 from "../../components/404";
import { slugify } from "../../helpers/utils/strings";
import CardList from "../../components/cardList/CardList";
import InlineSVG from "../../components/InlineSVG";
import { constants } from "../../config";
import { isEmpty } from "../../helpers/utils/objects";
import { fetchData } from "../../helpers/utils/fetch-data";
import SearchModel from '../../models/Search';

import "./index.less";

const { publicRuntimeConfig } = getConfig();

export default function Search({session, config, query, pageError, pageType, seoObj}) {
    console.log(config);
    let typingTimer;
    const doneTypingInterval = 1000;
    const { dspToken } = config;
    const router = useRouter();
    const searchInput = React.useRef(null);
    const [searchQuery, setSearchQuery] = React.useState((query.searchQuery) ? query.searchQuery[0].replace(/-/g,' ').replace(/[^0-9a-zA-Z ]+/, '') : '');
    const [inputValue, setInputValue] = React.useState((query.searchQuery) ? query.searchQuery[0].replace(/-/g,' ').replace(/[^0-9a-zA-Z ]+/, '') : '');
    const [isLoading, setIsLoading] = React.useState(false);
    const [result, setResult] = React.useState(null);
    //const [currentSearchType, setCurrentSearchType] = React.useState(0);

    let apiUrl = `https://${publicRuntimeConfig.DSP_API_URL}/find/channels/${constants.DSP_PLATFORM}?q=`;

    const { data, error, isValidating } = useSWR(searchQuery ? `${apiUrl}${searchQuery.replace(/[^0-9a-zA-Z ]+/, '')}&size=${constants.SEARCH_SIZE}` : null, async (url) => await fetchData(url, {authorization: dspToken}));

    // Listen for route change to update search query (back/forward buttons)
    React.useEffect(() => {
        const handleRouteChange = (url) => {
            const query = url.substring(url.lastIndexOf('/') + 1)
                .toLowerCase()
                .replace(/-/g,' ')
                .replace(/[^0-9a-zA-Z ]+/, '');

            setIsLoading(true);
            setResult(null);
            setInputValue(( query === 'search') ? '' : query);
            setSearchQuery(( query === 'search') ? '' : query);

            if (searchInput?.current) {
                //searchInput.current.blur();
            }
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        }
    }, []);

    React.useEffect(() => {
        setIsLoading(isValidating);
    }, [isValidating]);

    React.useEffect(() => {
        if (data && data.data && data.data.channels) {
            setResult(new SearchModel(data.data).toJSON());
        }
    }, [data]);


    React.useEffect(() => {
        if(searchQuery && slugify(searchQuery) !== '') {
            router.push('/search/[[...searchQuery]]', `/search/${slugify(searchQuery)}`, { shallow: true });
        } else {
            router.push('/search/[[...searchQuery]]', '/search', { shallow: true });
        }
    }, [searchQuery]);

    const doneTyping = () => {
        setIsLoading(true);
        setResult(null);
        setSearchQuery(inputValue);
    };

    const onKeyUp = () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    };

    const onKeyDown = (e) => {
        clearTimeout(typingTimer);
        if (e.keyCode === 13) {
            doneTyping();
        }
    };

    const onInputChange = (val) => {
        setInputValue(val);
    };

    /*const {
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
    );*/

    const setBarLine = () => {
        /*const activeNavItem =
            allRefs.current[currentSearchType] &&
            allRefs.current[currentSearchType].current;

        const { offsetLeft, offsetWidth } = activeNavItem;
        activeBarRef.current.style.transform = `translateX(${offsetLeft}px) translateY(-5px)`;
        activeBarRef.current.style.width = `${offsetWidth}px`;*/
    };

    /*React.useEffect(() => {
        const res = {};
        let flag = false;
        let count = 0;
        if (Array.isArray(data?.data?.data?.results?.cards)) {
            flag = true;
            res.demand = data.data.data.results;
            // console.log("Demand", data?.data?.data?.results?.cards);
            res.demand.category = { name: constants.ONDEMAND };
            // console.log("card", res.demand?.cards);
            res.demand.cards = res.demand?.cards?.map((card) => {
                // card.slug = `${card.slug}`;
                if (card.type === 'channels') {
                    return null;
                }
                return card;
            }).filter((card) => card);

            count += res.demand.cards.length;
        }

        /!*if (Array.isArray(channelData?.data?.data?.programs)) {
            flag = true;

            res.channel = {
                cards: channelData?.data?.data?.programs,
                category: { name: constants.CHANNELS },
            };
            res.channel.cards = res.channel?.cards?.map((card) => {
                card.slug = `channel/${card.channel.slug}`;
                return card;
            });
            count += res.channel.cards.length;
        }*!/

        if (flag) {
            setBarLine();
            res.total = count;
        }

        setResult(flag ? res : null);
    }, [data, channelData]);*/

    //const showChannel = currentSearchType == 0 || currentSearchType == 1;
    //const showOnDemand = currentSearchType == 0 || currentSearchType == 2;
    //let channelCards = [];
    /*if (showChannel) {
        channelCards = result?.channel?.cards?.map((card) => <div></div>);
    }*/

    return (
        !pageError && !error ? (
            <>
                <h1 className="noShow">Search</h1>
                <div className="searchTop">
                    <span className="searchField">
                        <input
                            ref={searchInput}
                            className="searchField-input"
                            placeholder={constants.SEARCH_DEFAULT}
                            value={inputValue}
                            onKeyUp={onKeyUp}
                            onKeyDown={onKeyDown}
                            onChange={(e) => onInputChange(e.target.value)}
                        />
                        <InlineSVG type="search" />
                    </span>
                    {/*<div className="searchResult-heading">
                        <h2
                            className={currentSearchType == 0 ? "active" : ""}
                            ref={allRefs.current[0]}
                            onClick={() => setCurrentSearchType(0)}
                        >
                            ALL
                            <span
                                className={`count ${
                                    Number(result?.total) == 0 ? "showNone" : ""
                                }`}
                            >
                                {Number(result?.total) == 0
                                    ? "00"
                                    : result?.total}
                            </span>
                        </h2>

                        <h2
                            ref={allRefs.current[1]}
                            className={currentSearchType == 1 ? "active" : ""}
                            onClick={() => setCurrentSearchType(1)}
                        >
                            {constants.CHANNELS.toUpperCase()}
                            <span
                                className={`count ${
                                    result?.channel &&
                                    !isEmpty(result?.channel?.cards)
                                        ? ""
                                        : "showNone"
                                }`}
                            >
                                {result?.channel &&
                                !isEmpty(result?.channel?.cards)
                                    ? result?.channel?.cards?.length
                                    : "00"}
                            </span>
                        </h2>

                        <h2
                            ref={allRefs.current[2]}
                            className={currentSearchType == 2 ? "active" : ""}
                            onClick={() => setCurrentSearchType(2)}
                        >
                            {constants.ONDEMAND.toUpperCase()}
                            <span
                                className={`count ${
                                    result?.demand &&
                                    !isEmpty(result?.demand?.cards)
                                        ? ""
                                        : "showNone"
                                }`}
                            >
                                {result?.demand &&
                                !isEmpty(result?.demand?.cards)
                                    ? result?.demand?.cards?.length
                                    : "00"}
                            </span>
                        </h2>
                    </div>
                    <span ref={activeBarRef} className="activeBar" />*/}
                </div>
                {/*{showChannel &&
                    result?.channel &&
                    !isEmpty(result.channel.cards) && (
                        <CardList
                            key="searchChannelResults"
                            type="channel"
                            horizontal={!store.isBreakpoint}
                            showArrow={false}
                            data={result.channel}
                        />
                    )}*/}
                { result && result.results && !isEmpty(result.results.cards) ? (
                    <CardList key="searchResults" type="grid" data={result.results}/>
                ) : searchQuery == '' ?
                    null
                    : isLoading ? (
                        <span className="searchResults-loading">{constants.SEARCH_LOADING}</span>
                    ) : result && result.results && isEmpty(result.results.cards) ? (
                        <span className="searchResults-none">{constants.NO_RESULTS}</span>
                    ) : null
                }
                {/*<pre>{JSON.stringify(result, null, 2)}</pre>*/}
            </>
        ) : (
            <Error404 />
        )
    )
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
