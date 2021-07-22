import React from "react";
import { constants } from "../../config";
import InlineSVG from "../InlineSVG";
import "./epg.less";
export default function EPGProgram({
    program,
    isShowing,
    key,
    currrentTimeElapsed,
    startTime,
    endTime,
    elapseTime,
    iconClicked,
    index,
}) {
    const amPm = {};
    const timeDuration = (seconds) => {
        const date = new Date(0);
        date.setUTCSeconds(seconds);
        // console.log(date.toTimeString());

        const hours = date.getHours();
        const minutes = date.getMinutes();
        const timeDuration = `${
            hours === 12 || hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
        }:${minutes < 10 ? "0" + minutes : minutes}`;
        amPm[hours > 11 ? "p" : "a"] = 1;
        return timeDuration;
    };

    const timeLeftDuration = (seconds) => {
        const date = new Date(0);
        date.setUTCSeconds(seconds);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes() + 1;
        const timeDuration = date.toISOString().substr(11, 5);
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    const start = startTime > program.starts ? startTime : program.starts;
    const end = endTime < program.ends ? endTime : program.ends;
    const duration = end - start;

    let startString = timeDuration(program.starts);
    let endString = timeDuration(program.ends);
    const amPmCheck = Object.keys(amPm);
    if (amPmCheck.length > 1) {
        startString += amPmCheck[0];
        endString += amPmCheck[1];
        // console.log("AMPM", amPmCheck, startString, endString);
    } else {
        endString += amPmCheck[0];
    }

    const separator = "\t • \t";
    const isBroadcasting =
        elapseTime >= program.starts && elapseTime <= program.ends;
    const style = {
        width: Math.floor(
            (duration * constants.EPG_30_MINUTE_WIDTH) / 1800 - 2
        ),
    };

    return (
        <div
            className='channel-row--program'
            style={style}
            title={program.title}
            id={program.duration}
            key={key}
            tabIndex={1}
        >
            {program.duration > 50 && (
                <div className={ isBroadcasting ? "channel-now" : ""}>
                    <div className="channel-row--program-about">
                        <div className="channel-row--program---timing">
                            {isShowing && isBroadcasting && (
                                <>
                                    <div className="channel-row--program---watching">
                                        {constants.WATCHING}
                                    </div>
                                    {separator}
                                </>
                            )}
                            {`${startString} - ${endString}`}

                            {isBroadcasting
                                ? ` ${separator} ${timeLeftDuration(
                                      program.ends -
                                          startTime -
                                          currrentTimeElapsed
                                  )}
                    left`
                                : null}
                        </div>
                        <div className="channel-row--program---title">
                            {program.title}
                        </div>
                        <div
                            className="channel-row--program---description"
                            title={program.description}
                        >
                            {program.description}
                        </div>
                        {/* {`Duration:${duration}(${program.duration-duration}) ${style.width} ${startTime - program.starts} `} */}
                    </div>

                    <div
                        className="channel-row--program-icon"
                        onClick={iconClicked}
                    >
                        <InlineSVG type="more" />
                    </div>
                </div>
            )}
        </div>
    );
}
