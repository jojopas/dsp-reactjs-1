import React from 'react';
import {useObserver} from 'mobx-react-lite';

import getSession from '../../helpers/session/get-session';
import pageError from '../../helpers/page/error';
import {getLayout} from '../../components/Layout';
import {StoreContext} from '../../store';
import {pageBuilder} from '../../helpers/page/builder';
import Error404 from '../../components/404';

import './index.less';
import CardList from '../../components/cardList/CardList';
import Nav from '../../components/nav/Nav';
import {slugify} from '../../helpers/utils/strings';
import GenreSelector from '../../components/nav/GenreSelector';

export default function Movies({session, config, page, error, pageType, seoObj}) {

    const store = React.useContext(StoreContext);

    const genreNav = page.genres.map((genre) => {
        return  {id: genre, inner: genre, url: `/movies/genre/[...slug]`, as: `/movies/genre/${slugify(genre)}`}
    });

    return useObserver(() => (
        !error ? (
            <>
                <h1 className="noShow">Movies</h1>
                { page.promos?.length > 0 ?
                    (
                        <CardList className="moviesPromo" type="promo" useHeader={false} data={{cards: page.promos}}/>
                    ) : null
                }
                <GenreSelector type="movies" links={genreNav}></GenreSelector>
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
Movies.getLayout = getLayout;

export const getServerSideProps = async ({req, res}) => {
    const {session, config} = await getSession(req, res);
    const routes = ['/api/dsp/company/available/genres/movies', '/api/dsp/movies'];
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
            pageType: 'general',
            seoObj: {
                title: 'Movies'
            }
        },
    }
}
