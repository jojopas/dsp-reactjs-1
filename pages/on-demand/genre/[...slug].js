import React from 'react';
import {useObserver} from 'mobx-react-lite';

import getSession from '../../../helpers/session/get-session';
import pageError from '../../../helpers/page/error';
import {getLayout} from '../../../components/Layout';
import {StoreContext} from '../../../store';
import {pageBuilder} from '../../../helpers/page/builder';
import Error404 from '../../../components/404';

import CardList from '../../../components/cardList/CardList';
import {slugify} from '../../../helpers/utils/strings';
import GenreSelector from '../../../components/nav/GenreSelector';

export default function MovieGenre({session, config, page, error, slug, pageType, seoObj}) {

    const store = React.useContext(StoreContext);

    const genreNav = page.genres.map((genre) => {
        return  {id: genre, inner: genre, url: `/movies/genre/[...slug]`, as: `/movies/genre/${slugify(genre)}`}
    });

    return useObserver(() => (
        !error ? (
            <>
                <h1 className="noShow">{seoObj.title}</h1>
                <GenreSelector className="genrePage" type="movies" links={genreNav}></GenreSelector>
                <CardList key={page.rails[0].category.id} type="grid" data={page.rails[0]}/>
                {/*<pre>{JSON.stringify(page, null, 2)}</pre>*/}
            </>
        ) : (
            <Error404/>
        )
    ));
}
MovieGenre.getLayout = getLayout;

export const getServerSideProps = async ({req, res, query}) => {
    const slug = query.slug[0];
    const {session, config} = await getSession(req, res);
    const routes = ['/api/dsp/company/available/genres/movies', `/api/dsp/movie/genre/${slug}`];
    const pageOptions = {req, routes, session, config};
    const page = await pageBuilder(pageOptions);

    let error = pageError([session, config, page]);

    if(page.rails.length === 0){
        error = true;
    }

    if(error){
        res.statusCode = 404;
    }

    const genreName = page.genres.find((genre) => slug === slugify(genre));

    return {
        props: {
            session: session || null,
            config: config || null,
            page: page || null,
            error: error || false,
            slug: slug || null,
            pageType: 'genre',
            seoObj: {
                title: `${genreName} Movies`
            }
        },
    }
}
