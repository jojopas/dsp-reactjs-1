import React from 'react';
import {useObserver} from 'mobx-react-lite';
import {parseCookies, setCookie} from 'nookies';

import getSession from '../helpers/session/get-session';
import pageError from '../helpers/page/error';
import {getLayout} from '../components/Layout';
import {StoreContext} from '../store';
import {pageBuilder} from '../helpers/page/builder';
import Error404 from '../components/404';
import CardList from '../components/cardList/CardList';
import MyMix from '../components/myMix/MyMix';

import './index.less';

import {constants} from '../config';


export default function Home({session, config, page, error, pageType, seoObj}) {
    const store = React.useContext(StoreContext);

    return useObserver(() => (
        !error ? (
            <>
                <h1 className="noShow">Home</h1>
                {/* <MyMix config={config} session={session} pageType={pageType} /> */}
                <div className="overflowWrapper">
                    { page.promos.length > 0 ?
                        (
                            <CardList className="homePromo" type="promoSmall" useHeader={false} data={{cards: page.promos}}/>
                        ) : null
                    }

                    {page.rails.map((rail) => (
                        <CardList key={rail.category.id} type="title" data={rail}/>
                    ))}
                </div>
                {/*
                <hr/>
                <div>Proto: {config.xForwardedProto}</div>
                <h2>LN Config</h2>
                <pre>{JSON.stringify(store.lnConfig, null, 2)}</pre>
                <br/>
                <br/>
                <h2>Page Data</h2>
                <pre>{JSON.stringify(page, null, 2)}</pre>
                */}
            </>
        ) : (
            <Error404/>
        )
    ));
}
Home.getLayout = getLayout;

export const getServerSideProps = async ({req, res}) => {
    let {session, config} = await getSession(req, res);
    const routes = ['/api/ln/promotion/dashboard', '/api/dsp/homepage'];
    const pageOptions = {req, res, routes, session, config};
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
            pageType: 'home',
            seoObj: {
            }
        },
    }
}
