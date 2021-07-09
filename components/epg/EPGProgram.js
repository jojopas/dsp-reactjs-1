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
    iconClicked,
    index,
}) {
    const timeDuration = (seconds) => {
        const date = new Date(0);
        date.setSeconds(seconds);
        // console.log(date.toTimeString());
        const timeDuration = date.toTimeString().substr(0, 5);
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

    const duration =
        program.ends > endTime
            ? endTime - program.starts
            : program.ends > startTime && startTime > program.starts
            ? program.ends - startTime
            : program.duration;

    const separator = "\t . \t";
    const totalTime = Number(startTime) + Number(currrentTimeElapsed);
    const isBroadcasting =
        totalTime >= program.starts && totalTime <= program.ends;
    const style = {
        width: Math.floor(
            (duration * constants.EPG_30_MINUTE_WIDTH / 1800)  - 2
        ),
    };

    return (
        <div
            className={`${
                isBroadcasting ? "channel-now" : ""
            } channel-row--program `}
            style={style}
            title={program.title}
            id={program.duration}
            key={key}
            tabIndex={1}
        >
            {program.duration > 50 && (
                <>
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
                            {`${timeDuration(program.starts)} - ${timeDuration(
                                program.ends
                            )}`}

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

                    {isBroadcasting && (
                        <div
                            className="channel-row--program-icon"
                            onClick={iconClicked}
                        >
                            <InlineSVG type="more" />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
