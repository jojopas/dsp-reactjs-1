import React from 'react';

import './AddCity.less';
import Button from '../button/Button';
import {constants} from '../../config';
import InlineSVG from '../InlineSVG';
import useSWR from "swr";
import axios from "axios";
import {sendToSegment} from '../../analytics';

export default function AddCity({addCityClick, closeClick, session, config, type}) {
    let typingTimer;
    const doneTypingInterval = 1000;

    const [searchValue, setSearchValue] = React.useState('');
    const [inputValue, setInputValue] = React.useState('');
    const [cities, setCities] = React.useState([]);
    const [selectedCityId, setSelectedCityId] = React.useState(null);
    const localNow = config && config.localNow;
    const geography = localNow && localNow.geography;

    const citiesFoundRef = React.useRef(null);

    const fetchData = async (url) => await axios({
        method: 'GET',
        url: url,
        headers: {'x-api-key': config.xApiKey}
    });

    const {data, error, isValidating} = useSWR(searchValue ? `${geography && geography.citySearchEndpointUrl}?Text=${encodeURIComponent(searchValue)}` : null, fetchData);


    const handleAddCityClick = () => {
        const cityObj = cities.find((c) => c.id === selectedCityId);
        addCityClick(cityObj);
    }

    React.useEffect(() => {
        if (data && data.data) {
            setCities(data.data);
            if(citiesFoundRef && citiesFoundRef.current){
                citiesFoundRef.current.scrollTop = 0;
            }
        }
    }, [data]);

    /*React.useEffect(() => {
        console.log('isValidating: ', isValidating);
    }, [isValidating]);

    React.useEffect(() => {
        console.log('error: ', error);
    }, [error]);*/

    const doneTyping = () => {
        setSearchValue(inputValue);
        sendToSegment('track', {event: 'Location Searched', search_term: inputValue});
    };

    const onKeyUp = () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    };

    const onKeyDown = () => {
        clearTimeout(typingTimer);
    };

    const onInputChange = (val) => {
        setInputValue(val);
    };

    const handleClose = () => {
        closeClick();
        setTimeout(() => {
            setCities([]);
            setInputValue('');
            setSearchValue('');
        }, 1000);
    };

    return (
        <>
            <span className="myCityModal-header">{type === 'find' ? constants.CITY_FIND : constants.CITY_ADD_NEW}</span>
            {type === 'add' ? (<span className="myCityModal-close" onClick={handleClose}><InlineSVG type="close"/></span> ) : null}
            <span className="myCityModal-searchField">
                <input className="myCityModal-searchField-input" onKeyUp={onKeyUp} onKeyDown={onKeyDown}
                       value={inputValue} onChange={(e) => onInputChange(e.target.value)}
                       placeholder={constants.CITY_ADD_SEARCH}/>
                <InlineSVG type="search"/>
            </span>
            {searchValue !== '' && cities.length > 0 ? (
                <>
                    <span className="myCityModal-addInstruction">{constants.CITY_ADD_FOUND.replace('{city}', searchValue)}</span>
                    <span className="myCityModal-citiesFound" ref={citiesFoundRef}>
                        <ul>
                            {cities && cities.map((c) => {
                                return (
                                    <li key={`addcity-${c.id}}`}>
                                        <span className={c.id === selectedCityId ? 'city-current' : ''} onClick={() => setSelectedCityId(c.id)}>
                                            {c.cityStateName}
                                            <span className="city-svg">
                                                <InlineSVG type="locationAdd"/>
                                                <InlineSVG type="locationAddActive"/>
                                            </span>
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>
                    </span>
                    <span className="myCityModal-addButton">
                        <Button className={!selectedCityId ? 'disabled' : ''} inner={constants.CITY_ADD_CONTINUE} onClick={handleAddCityClick} />
                    </span>
                </>
            ) : isValidating ? (
                <span className="myCityModal-loading">{constants.CITY_ADD_LOADING}</span>
            ) : searchValue !== '' && cities.length === 0 ? (
                <span className="myCityModal-noResults">{constants.CITY_NO_RESULTS}</span>
            ) : (
                <span className="myCityModal-citiesFound"/>
            )}
        </>
    )
}
