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
    channel,
    index,
}) {
    const start = startTime > program.starts ? startTime : program.starts;
    const end = endTime < program.ends ? endTime : program.ends;
    const duration = end - start;

    const isBroadcasting =
        elapseTime >= program.starts && elapseTime <= program.ends;
    const style = {
        width: Math.floor((duration * constants.EPG_30_MINUTE_WIDTH) / 1800),
    };

    const dateToSend = { ...channel, nowprogram: program };
    const durationString = timeDurationStartStop(program.starts, program.ends);
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
            onClick={store.isBreakpoint ? () => iconClicked(dateToSend) : null}
        >
            <>
                <div
                    className="channel-row--program-about"
                    style={{ width: style.width - 30 }}
                >
                    <div
                        className="channel-row--program---timing"
                        title={durationString}
                    >
                        {isShowing && isBroadcasting && (
                            <>
                                <div className="channel-row--program---watching">
                                    {constants.WATCHING}
                                </div>
                            </>
                        )}
                        {durationString}

                        {isBroadcasting
                            ? ` ${constants.BULLETS} ${timeLeftDuration(
                                  program.ends - startTime - currrentTimeElapsed
                              )}
                    left`
                            : null}
                    </div>
                    <div
                        className="channel-row--program---title"
                        onClick={
                            store.isBreakpoint
                                ? null
                                : () => fullScreen(dateToSend)
                        }
                    >
                        {program.title}
                    </div>
                    {/* <div
                            className="channel-row--program---description"
                            title={program.description}
                        >
                            {program.description}
                        </div> */}
                    {/* {`Duration:${duration}(${program.duration-duration}) ${style.width} ${startTime - program.starts} `} */}
                </div>

                <div
                    className="channel-row--program-icon"
                    onClick={() => iconClicked(dateToSend)}
                >
                    <InlineSVG type="more" />
                </div>
            </>
        </div>
    );
}
