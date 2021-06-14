import React from "react";
import { constants } from "../../config";
import "./epg.less";
export default function EPGProgram({
    program,
    isShowing,
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

    const duration = nowTime > 0 ? program.ends>nowTime? program.ends - nowTime:program.duration : program.duration;
    const separator = "\t . \t";
    const totalTime = Number(nowTime) + Number(currrentTimeElapsed);
    const isPlaying = totalTime >= program.starts && totalTime <= program.ends;
    const style = {
        width: (duration / 1800) * constants.EPG_30_MINUTE_WIDTH - index * 2,
    };
    if (isPlaying) {
        style.backgroundColor = "#273d4e";
        style.fontWeight = "bold";
    }
    // if (nowTime > 0) {
    //     console.log(
    //         "Duration",
    //         program.duration,
    //         duration,
    //         currrentTimeElapsed,
    //         isPlaying
    //     );
    // }
    // console.log('Width', style.width, nowTime);
    return (
        <div
            className={`${
                isPlaying ? "channel-now" : ""
            } channel-row--program ${isShowing ? "channel-active" : ""} `}
            style={style}
            title={program.title}
            id={program.duration}
            key={key}
        >
            {program.duration > 50 && (
                <div>
                    <div className="channel-row--program---description">
                        {isShowing && isPlaying && (
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

                        {isPlaying
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
