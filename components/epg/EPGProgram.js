import React from "react";
import { constants } from "../../config";
import "./epg.less";
export default function EPGProgram({
    program,
    nowShowing,
    key,
    currrentTimeElapsed,
    nowTime,
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
        const minutes = date.getUTCMinutes();
        const timeDuration = date.toISOString().substr(11, 5);
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };
    const duration = nowTime > 0 ? program.ends - nowTime : program.duration;
    const separator = "\t . \t";
    const totalTime = Number(nowTime) + Number(currrentTimeElapsed);
    const playingNow = totalTime >= program.starts && totalTime <= program.ends;
    const style = {
        width: (duration / 1800) * constants.EPG_30_MINUTE_WIDTH - index * 2,
    };
    if (playingNow) {
        style.backgroundColor = "#273d4e";
        style.fontWeight = "bold";
    }
    // if (nowTime > 0) {
    //     console.log(
    //         "Duration",
    //         program.duration,
    //         duration,
    //         currrentTimeElapsed,
    //         playingNow
    //     );
    // }
    return (
        <div
            className={`${
                playingNow ? "channel-now" : ""
            } channel-row--program ${nowShowing ? "channel-active" : ""} `}
            style={style}
            title={program.title}
            id={program.duration}
            key={program.toString()}
        >
            {program.duration > 250 && (
                <div        >
                    <div className="channel-row--program---description">
                        {nowShowing && playingNow && (
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

                        {playingNow
                            ? ` ${separator} ${timeLeftDuration(
                                  program.ends - nowTime - currrentTimeElapsed
                              )}
                    left`
                            : null}
                    </div>
                    <div className="channel-row--program---title">
                        {program.title}
                    </div>
                </div>
            )}
        </div>
    );
}
