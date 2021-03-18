import React from 'react';
import {useObserver} from 'mobx-react-lite';

import {isEmpty} from '../../helpers/utils/objects';
import getSession from '../../helpers/session/get-session';
import pageError from '../../helpers/page/error';
import {getLayout} from '../../components/Layout';
import {StoreContext} from '../../store';
import {pageBuilder} from '../../helpers/page/builder';
import Error404 from '../../components/404';

import '../about/page.less';
import './index.less';

export default function Account({session, config, page, error}) {
    const store = React.useContext(StoreContext);
    const lnConfig = store.getLnConfig;

    return useObserver(() => (
        !error ? (
            <>
                <h1>{page.name}</h1>
                <div className="pageBody" dangerouslySetInnerHTML={{__html: page.html}}/>
                {/*<pre>{JSON.stringify(page, null, 2)}</pre>*/}
            </>
        ) : (
            <Error404/>
        )
    ));
}
Account.getLayout = getLayout;

export const getServerSideProps = async ({req, res, query}) => {
    const slug = (!isEmpty(query)) ? query.slug[0] : 'watchlist';
    const {session, config} = await getSession(req, res);
    const routes = [`/api/dsp/pages/${slug}`];
    const pageOptions = {req, routes, session, config};
    const page = await pageBuilder(pageOptions);

    let error = pageError([session, config, page]);
    if(error){
        res.statusCode = 404;
    }

    const seoObj = {};
    if(!isEmpty(page)){
        seoObj.title = page.name || null;
        if(page.seo) {
            seoObj.description = page.seo.description || null;
            seoObj.keywords = page.seo.keywords || null;
        }
    }

    return {
        props: {
            session: session || null,
            config: config || null,
            page: page || null,
            error: error || false,
            pageType: 'general',
            seoObj: seoObj
        },
    }
}
