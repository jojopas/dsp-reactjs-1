import React from "react";
import { constants } from "../../config";
import "./epg.less";
export default function EPGProgram({
    program,
    nowShowing,
    key,
    currrentTimeElapsed,
    index,
}) {
    const timeDuration = (seconds) => {
        const date = new Date(0);
        date.setSeconds(seconds);
        const timeDuration = date.toISOString().substr(11, 5);
        return timeDuration;
    };
    const separator = "\t . \t";
    return  (
        <div
            className={`channel-row--program ${
                nowShowing ? "channel-active" : ""
            }`}
            style={{
                width: `${(program.duration / 1800) * 200 - (index * 2) }px`,
            }}
            title={program.title}
            id={program.duration}
            key={key}
        >
            {program.duration> 250 && <div
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
                        ` ${separator} ${timeDuration(program.duration - currrentTimeElapsed)}
                    left`}
                </div>
                <div className="channel-row--program---title">
                    {/* <div className="channel-row--program---duration">
                                        {durationToString(program.duration)}
                                    </div> */}

                    {program.title}
                </div>
            </div>}
        </div>
    );
}
