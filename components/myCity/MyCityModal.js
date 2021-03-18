import React from 'react';
import axios from "axios";
import {destroyCookie, parseCookies, setCookie} from 'nookies';
import Router from 'next/router';
import './MyCity.less';

import { fadeIn, fadeOut } from '../../helpers/utils/fade';
import Onboarding from './Onboarding';
import AddCity from './AddCity';
import {constants} from "../../config";
import {StoreContext} from "../../store";
import {sendToSegment} from '../../analytics';


export default function MyCityModal({config, session, showMyCityModal}) {
    const store = React.useContext(StoreContext);
    const localNow = config && config.localNow;
    const geography = localNow && localNow.geography;
    const [myCity, setMyCity] = React.useState(null);
    const [type, setType] = React.useState('onboarding');

    const outerRef = React.useRef(null);

    React.useEffect(() => {
        if (showMyCityModal) {
            const cookies = parseCookies();
            if (!cookies[`_${constants.COOKIE_PREFIX}_myCity`]) {
                setType('onboarding');

                if (store.playerInstance && store.playerInstance.vjs) {
                    store.playerInstance.vjs.pause();
                }
            }
        }
        showMyCityModal ? fadeIn(outerRef.current) : fadeOut(outerRef.current);

        if(window){
            const body = document.querySelector('body');
            showMyCityModal ? body.classList.add('bodyLocked') : body.classList.remove('bodyLocked');
        }

    }, [outerRef, showMyCityModal]);

    React.useEffect(() => {
        (async () => {
            if (geography) {
                const { data } = await axios({
                    method: 'GET',
                    url: geography.cityEndpointUrl,
                    headers: { 'x-api-key': config.xApiKey },
                });
                const city = data && data.city;
                if (city) {
                    setMyCity(city);
                }
            }
        })();
    }, []);

    React.useEffect(() => {
        const cookies = parseCookies();
        if (cookies[`_${constants.COOKIE_PREFIX}_myCity`]) {
            setType('add');
        }
    }, []);

    const resetCookies = () => {
        destroyCookie(null, `_${constants.COOKIE_PREFIX}_experienceId`);
    };

    const reloadPage = () => {
        window.scrollTo(0, 0);
        resetCookies();
        Router.reload();
    }

    const onboardingYes = () => {
        setCookie(null, `_${constants.COOKIE_PREFIX}_myCity`, JSON.stringify(myCity), {
            expires: constants.COOKIE_NO_EXPIRE,
            sameSite: 'Lax',
            secure: config && config.xForwardedProto === 'https',
            path: '/'
        });

        setCookie(null, `_${constants.COOKIE_PREFIX}_myMarket`, myCity.market, {
            expires: constants.COOKIE_NO_EXPIRE,
            sameSite: 'Lax',
            secure: config && config.xForwardedProto === 'https',
            path: '/'
        });

        sendToSegment('track', {event: 'Location Added', channel: myCity.market});

        reloadPage();
    }

    const onboardingNo = () => {
        setType('find');
    }

    const addCityClick = (city) => {
        setMyCity(city);
        setCookie(null, `_${constants.COOKIE_PREFIX}_myCity`, JSON.stringify(city), {
            expires: constants.COOKIE_NO_EXPIRE,
            sameSite: 'Lax',
            secure: config && config.xForwardedProto === 'https',
            path: '/'
        });

        setCookie(null, `_${constants.COOKIE_PREFIX}_myMarket`, city.market, {
            expires: constants.COOKIE_NO_EXPIRE,
            sameSite: 'Lax',
            secure: config && config.xForwardedProto === 'https',
            path: '/'
        });

        sendToSegment('track', {event: 'Location Added', channel: city.market});

        reloadPage();
    }

    const closeClick = () => {
        store.setShowMyCityModal(false);
    }


    return (
        <div className={`myCityModal myCityModalType-${type}`} ref={outerRef} style={{display: 'none'}}>
            <div className="myCityModal-center">
                <div className={`myCityModal-inner myCityModal-inner-${type}`}>
                    {type === 'onboarding' ? (
                        <Onboarding myCity={myCity} yesClick={onboardingYes} noClick={onboardingNo} />
                    ) : (
                        <AddCity addCityClick={addCityClick} closeClick={closeClick} session={session} config={config} type={type} />
                    )}
                </div>
            </div>
        </div>
    )
}
