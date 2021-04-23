import React from 'react';
import {useObserver} from 'mobx-react-lite';
import useSWR from 'swr';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

import getSession from '../../helpers/session/get-session';
import pageError from '../../helpers/page/error';
import {getLayout} from '../../components/Layout';
import {StoreContext} from '../../store';
import Error404 from '../../components/404';
import {slugify} from "../../helpers/utils/strings";

import './index.less';
import '../../components/cards/Cards.less';
import CardList from '../../components/cardList/CardList';
import InlineSVG from '../../components/InlineSVG';
import {constants} from '../../config';
import {isEmpty} from '../../helpers/utils/objects'
import {fetchData} from '../../helpers/utils/fetch-data';

export default function Search({session, config, query, pageError, pageType, seoObj}) {

    const store = React.useContext(StoreContext);

    const [searchQuery, setSearchQuery] = React.useState((query.searchQuery) ? query.searchQuery[0].replace(/-/g,' ').replace(/[^0-9a-zA-Z ]+/, '') : '');
    //const { data, error, isValidating } = useSWR(searchQuery ? `${publicRuntimeConfig.BASE_URL}/api/dsp/search/${searchQuery.replace(/[^0-9a-zA-Z ]+/, '')}` : null, async (url) => await fetchData(url));
    const { data, error, isValidating } = useSWR(searchQuery ? `/api/dsp/find/${searchQuery.replace(/[^0-9a-zA-Z ]+/, '')}` : null, async (url) => await fetchData(url));

    const [result, setResult] = React.useState(null);

    React.useEffect(() => {
        /*if (data && data.data && data.data.data && data.data.data.results) {
            console.log(data.data.data.results);
        }*/
        setResult((data && data.data && data.data.data && data.data.data.results) ? data.data.data : null);
    }, [data]);


    React.useEffect(() => {
        if(searchQuery && slugify(searchQuery) !== '') {
            history.replaceState({},'', `/search/${slugify(searchQuery)}`);
        } else {
            history.replaceState({},'', '/search');
        }
    }, [searchQuery]);

    return useObserver(() => (
        !pageError && !error ? (
            <>
                <h1 className="noShow">Search</h1>
                <span className="searchField">
                    <input className="searchField-input" placeholder={constants.SEARCH_DEFAULT} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                    <InlineSVG type="search"/>
                </span>
                { result && result.results && !isEmpty(result.results.cards) ? (
                    <CardList key="searchResults" type="grid" data={result.results}/>
                ) : searchQuery == '' ?
                        null
                     : isValidating ? (
                        <span className="searchResults-loading">{constants.SEARCH_LOADING}</span>
                        ) : result && result.results && isEmpty(result.results.cards) ? (
                        <span className="searchResults-none">{constants.NO_RESULTS}</span>
                    ) : null
                }
                {/*<pre>{JSON.stringify(result, null, 2)}</pre>*/}
            </>
        ) : (
            <Error404/>
        )
    ));
}
Search.getLayout = getLayout;

export const getServerSideProps = async ({req, res, query}) => {
    const {session, config} = await getSession(req, res);
    let error = pageError([session, config]);
    if(error){
        res.statusCode = 404;
    }

    return {
        props: {
            session: session || null,
            config: config || null,
            query: query || null,
            pageError: error || false,
            pageType: 'search',
            seoObj: {
                title: 'Search'
            }
        },
    }
}
