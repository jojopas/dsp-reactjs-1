import React from 'react';
import {duration} from '../../helpers/utils/time';
import {constants} from '../../config';

import './EPGList.less';

export default function EPGCurrent({ slug, logo, name, program, changeCurrentSlug }) {
    const [currentLogo, setCurrentLogo] = React.useState(logo || constants.NOT_FOUND_SRC);
    React.useEffect(() => {
        if (logo) {
            setCurrentLogo(logo);
        } else {
            setCurrentLogo(constants.NOT_FOUND_SRC);
        }
    }, [logo]);

    const calculateRemainingSeconds = (programs) => {
        if (programs && programs[0]) {
            const end = new Date(programs[0].ends * 1000).getTime();
            const now = new Date().getTime();
            return duration(Math.round((end - now)/1000), true);
        }
        return duration(0, true);
    }
    let interval;
    const [timeLeft, setTimeLeft] = React.useState(calculateRemainingSeconds(program));
    React.useEffect(() => {
        clearInterval(interval);
        setTimeLeft(calculateRemainingSeconds(program));
        interval = setInterval(() => {
            setTimeLeft(calculateRemainingSeconds(program));
        }, constants.EPG_TIME_LEFT*1000);

        return () => {
            clearInterval(interval);
        }
    }, [program]);

    return (
        <div className="epgCurrent">
            <span className="epgCurrent-inner">
                <span className="epgCurrent-channel">
                    {currentLogo ? (
                        <img
                            src={constants.NOT_FOUND_SRC}
                            data-sizes="auto"
                            data-srcset={`${currentLogo}/200 100w,
                                ${currentLogo}/300 200w`}
                            data-src={`${currentLogo}/200`}
                            alt={name}
                            className="lazyload"
                        />
                    ) : (
                        <img
                            src={constants.NOT_FOUND_SRC}
                            alt={name}
                            className="lazyloaded"
                        />
                    )}
                </span>
                <span className="epgCurrent-onNow">
                    {program[0] ? (
                        <>
                            <span className="epgCurrent-header"><span>On Now</span>{timeLeft ? `${timeLeft} left` : ''}</span>
                            <span className="epgCurrent-title"><span>{program[0].title}</span></span>
                            <span className="epgCurrent-desc">{program[0].description}</span>
                        </>
                    ) : null}
                </span>
                <span className="epgCurrent-next">
                    {program[1] ? (
                        <>
                            <span className="epgCurrent-header"><span>Up Next</span></span>
                            <span className="epgCurrent-title"><span>{program[1].title}</span></span>
                            <span className="epgCurrent-desc">{program[1].description}</span>
                        </>
                    ) : null}
                </span>
            </span>
        </div>
    )
};
