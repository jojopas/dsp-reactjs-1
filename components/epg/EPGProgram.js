import React from "react";
import { constants } from "../../config";
import InlineSVG from "../InlineSVG";
import "./epg.less";
import {
    timeDurationStartStop,
    timeLeftDuration,
} from "../../helpers/utils/dates/dates";
import { store } from "../../store";
export default function EPGProgram({
    program,
    isShowing,
    id,
    currrentTimeElapsed,
    startTime,
    endTime,
    elapseTime,
    iconClicked,
    fullScreen,
    index,
}) {
    const start = startTime > program.starts ? startTime : program.starts;
    const end = endTime < program.ends ? endTime : program.ends;
    const duration = end - start;

    const isBroadcasting =
        elapseTime >= program.starts && elapseTime <= program.ends;
    const style = {
        width: Math.floor(
            (duration * constants.EPG_30_MINUTE_WIDTH) / 1800 - 2
        ),
    };

    return (
        <div
            className={
                isBroadcasting
                    ? "channel-row--program channel-now"
                    : "channel-row--program"
            }
            style={style}
            title={program.title}
            id={program.duration}
            key={id}
            tabIndex={1}
            onClick={store.isBreakpoint ? () => iconClicked() : null}
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
                                </>
                            )}
                            {timeDurationStartStop(
                                program.starts,
                                program.ends
                            )}

                            {isBroadcasting
                                ? ` ${constants.BULLETS} ${timeLeftDuration(
                                      program.ends -
                                          startTime -
                                          currrentTimeElapsed
                                  )}
                    left`
                                : null}
                        </div>
                        <div
                            className="channel-row--program---title"
                            onClick={store.isBreakpoint ? null : fullScreen}
                        >
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
                </>
            )}
        </div>
    );
}
