import React from 'react';

import './Onboarding.less';
import Button from '../button/Button';
import {constants} from '../../config';
import InlineSVG from '../InlineSVG';

export default function Onboarding({myCity, yesClick, noClick}) {
    return (
        <>
            {myCity ? (
                <>
                    <InlineSVG type="locationActive"/>
                    <span className="myCityModal-isThis">{constants.CITY_IS_THIS_YOURS}</span>
                    <span className="myCityModal-city">{myCity && myCity.cityStateName}</span>
                    <span className="myCityModal-instruction">{constants.CITY_INSTRUCTIONS}</span>
                    <span className="myCityModal-buttons">
                        <Button className="button-current" inner={constants.CITY_YES} onClick={yesClick}/>
                        <Button inner={constants.CITY_NO} onClick={noClick}/>
                    </span>
                </>
            ) : (
                <span className="myCityModal-loader"><InlineSVG type="logo"/></span>
            )}
        </>
    )
}
