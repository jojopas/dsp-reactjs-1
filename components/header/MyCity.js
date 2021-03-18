import React from 'react';

import InlineSVG from '../InlineSVG';
import {useObserver} from 'mobx-react-lite';
import {StoreContext} from '../../store';
import {parseCookies} from "nookies";
import {constants} from "../../config";

export default function MyCity() {

    const store = React.useContext(StoreContext);
    const [city, setCity] = React.useState('');

    const toggleMyCity = () => {
        store.setShowMyCityModal(!store.showMyCityModal);
    }

    React.useEffect(() => {
        const cookies = parseCookies();
        const myCity = cookies[`_${constants.COOKIE_PREFIX}_myCity`];
        if(myCity){
            setCity(JSON.parse(myCity).cityStateName);
        }
    }, []);

    return useObserver(() => (
        <div className="myCity" onClick={toggleMyCity}>
            <span className="myCity-header">My City</span>
            <span className="myCity-location">{city}</span>
            <InlineSVG type="location"/>
            <InlineSVG type="locationActive"/>
        </div>
    ));
}
