import React from 'react';
import {useObserver} from 'mobx-react-lite';

import getSession from '../../helpers/session/get-session';
import pageError from '../../helpers/page/error';
import {getLayout} from '../../components/Layout';
import {StoreContext} from '../../store';
import {pageBuilder} from '../../helpers/page/builder';
import Error404 from '../../components/404';
import {slugify} from "../../helpers/utils/strings";

import './index.less';
import CardList from '../../components/cardList/CardList';
import Nav from '../../components/nav/Nav';
import GenreSelector from '../../components/nav/GenreSelector';

export default function Shows({session, config, page, error, pageType, seoObj}) {

    const store = React.useContext(StoreContext);

    const genreNav = page.genres.map((genre) => {
        return  {id: genre, inner: genre, url: `/shows/genre/[...slug]`, as: `/shows/genre/${slugify(genre)}`}
    });

    return useObserver(() => (
        !error ? (
            <>
                <h1 className="noShow">Shows</h1>
                { page.promos?.length > 0 ?
                    (
                        <CardList className="showsPromo" type="promo" useHeader={false} data={{cards: page.promos}}/>
                     ) : null
                }
                <GenreSelector type="shows" links={genreNav}></GenreSelector>
                {page.rails.map((rail) => (
                    <CardList key={rail.category.id} type="title" data={rail}/>
                ))}
                {/*<pre>{JSON.stringify(page, null, 2)}</pre>*/}
            </>
        ) : (
            <Error404/>
        )
    ));
}
Shows.getLayout = getLayout;

export const getServerSideProps = async ({req, res, query}) => {
    const {session, config} = await getSession(req, res);
    const routes = ['/api/dsp/company/available/genres/series', '/api/dsp/series'];
    const pageOptions = {req, routes, session, config};
    const page = await pageBuilder(pageOptions);

    let error = pageError([session, config, page]);
    if(error){
        res.statusCode = 404;
    }

    return {
        props: {
            session: session || null,
            config: config || null,
            page: page || null,
            error: error || false,
            pageType: 'shows',
            seoObj: {
                title: 'Shows'
            }
        },
    }
}
