import React from 'react';
import {useObserver} from 'mobx-react-lite';

import getSession from '../../../helpers/session/get-session';
import pageError from '../../../helpers/page/error';
import {getLayout} from '../../../components/Layout';
import {StoreContext} from '../../../store';
import {pageBuilder} from '../../../helpers/page/builder';
import Error404 from '../../../components/404';

import {slugify} from '../../../helpers/utils/strings';
import CardList from '../../../components/cardList/CardList';
import GenreSelector from '../../../components/nav/GenreSelector';

export default function ShowGenre({session, config, page, error, slug, pageType, seoObj}) {

    const store = React.useContext(StoreContext);
    const lnConfig = store.getLnConfig;

    const genreNav = page.genres.map((genre) => {
        return  {id: genre, inner: genre, url: `/shows/genre/[...slug]`, as: `/shows/genre/${slugify(genre)}`}
    });

    return useObserver(() => (
        !error ? (
            <>
                <h1 className="noShow">{seoObj.title}</h1>
                <GenreSelector className="genrePage" type="shows" links={genreNav}></GenreSelector>
                <CardList key={page.rails[0].category.id} type="grid" data={page.rails[0]}/>
                {/*<pre>{JSON.stringify(page, null, 2)}</pre>*/}
            </>
        ) : (
            <Error404/>
        )
    ));
}
ShowGenre.getLayout = getLayout;

export const getServerSideProps = async ({req, res, query}) => {
    const slug = query.slug[0];
    const {session, config} = await getSession(req, res);
    const routes = ['/api/dsp/company/available/genres/series', `/api/dsp/series/genre/${slug}`];
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
                title: `${genreName} Shows`
            }
        },
    }
}
