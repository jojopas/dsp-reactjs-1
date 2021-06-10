import React from "react";
import { constants } from "../../config";
import "./epg.less";
export default function EPGProgram({
    program,
    nowShowing,
    key,
    currrentTimeElapsed,
    index,
    nowTime,
}) {
    const timeDuration = (seconds) => {
        const date = new Date(0);
        date.setSeconds(seconds);
        const timeDuration = date.toISOString().substr(11, 5);
        return timeDuration;
    };
    const timeLeftDuration = (seconds) => {
        const date = new Date(0);
        date.setUTCSeconds(seconds);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const timeDuration = date.toISOString().substr(11, 5);
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };
    const duration = nowTime>0? (program.ends - nowTime): program.duration;
    if (nowTime>0) {
        console.log('Duration', program.duration, duration, currrentTimeElapsed);
    }
    const separator = "\t . \t";
    return (
        <div
            className={`channel-row--program ${
                nowShowing ? "channel-active" : ""
            }`}
            style={{
                width: `${(duration / 1800) * 200 - index * 2}px`,
            }}
            title={program.title}
            id={program.duration}
            key={key}
        >
            {program.duration > 250 && (
                <div
                // style={{
                //     width: `${(program.duration / 1800) * 200 - 62}px`,
                // }}
                >
                    <div className="channel-row--program---description">
                        {nowShowing && (
                            <>
                                {" "}
                                <div className="channel-row--program---watching">
                                    {constants.WATCHING}
                                </div>{" "}
                                {separator}{" "}
                            </>
                        )}
                        {`${timeDuration(program.starts)} - ${timeDuration(
                            program.ends
                        )}`}

                        {currrentTimeElapsed &&
                            ` ${separator} ${timeLeftDuration(
                                program.ends - nowTime - currrentTimeElapsed
                            )}
                    left`}
                    </div>
                    <div className="channel-row--program---title">
                        {/* <div className="channel-row--program---duration">
                                        {durationToString(program.duration)}
                                    </div> */}

                        {program.title}
                    </div>
                </div>
            )}
        </div>
    );
}
