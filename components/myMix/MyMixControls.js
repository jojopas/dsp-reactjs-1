import React from 'react';

import './MyMix.less';
import {constants} from '../../config';
import InlineSVG from '../InlineSVG';

export default function MyMixControls({mixData, playNext, gettingData}) {

    return (
        <div className="myMixControls">
            <div className="myMixControls-nav">
                <span>My Stream</span>
            </div>
            <div className="myMixControls-onNow">
                {mixData[0] ? (
                    <>
                        <span className="myMixControls-lineCover"/>
                        <span className="myMixControls-poster">
                            <span className="myMixControls-poster-inner">
                                <img
                                    src={constants.NOT_FOUND_SRC}
                                    data-src={mixData[0].imageThumbUrl}
                                    alt={''}
                                    className="lazyload"
                                />
                            </span>
                            <span className="myMixControls-rating">{mixData[0].rating}</span>
                        </span>
                        <span className="myMixControls-header"><InlineSVG type="streamMy"/>On Now</span>
                        <span className="myMixControls-title">{mixData[0].title}</span>
                        <span className="myMixControls-desc">{mixData[0].description}</span>
                        <span className="myMixControls-toolbar">
                            <span className={`myMixControls-button myMixControls-skip${gettingData ? ' myMixControls-skip-disable' : ''}`}
                            onClick={playNext}><span>Skip</span><InlineSVG type="skip"/></span>
                        </span>
                    </>
                ) : null}

            </div>
            <div className="myMixControls-upNext">
                <span className="myMixControls-lineCover"/>
                {mixData[1] ? (
                    <>
                        <span className="myMixControls-poster">
                            <span className="myMixControls-poster-inner">
                                <img
                                    src={constants.NOT_FOUND_SRC}
                                    data-src={mixData[1].imageThumbUrl}
                                    alt={''}
                                    className="lazyload"
                                />
                            </span>
                            <span className="myMixControls-rating">{mixData[1].rating}</span>
                        </span>
                        <span className="myMixControls-header"><InlineSVG type="upNext"/>Up Next</span>
                        <span className="myMixControls-title">{mixData[1].title}</span>
                        <span className="myMixControls-desc">{mixData[1].description}</span>
                        <span className="myMixControls-toolbar"></span>
                    </>
                ) : null}
            </div>
        </div>
    )
}
