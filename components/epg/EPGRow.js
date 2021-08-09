import React from "react";

import "./epg.less";
import { constants } from "../../config";
import InlineSVG from "../InlineSVG";
import EPGProgram from "./EPGProgram";
import ChannelLogo from "./EPGChannel";
export default function EPGRow({
    channel,
    favorite,
    isShowing,
    onClick,
    currrentTimeElapsed,
    startTime,
    endTime,
    elapseTime,
    iconClicked,
    currentDate,
    isLocked,
    fullScreen,
}) {
    //  console.log("endTime", startTime, endTime);
    const setProgram = () => {
        const res = [];
        let index = 0;
        for (let i = 0; i < channel.program.length; i++) {
            const program = channel.program[i];
            if (program.starts < endTime) {
                if (program.ends > startTime) {
                    res.push(
                        <EPGProgram
                            tabIndex={1}
                            currrentTimeElapsed={currrentTimeElapsed}
                            program={program}
                            startTime={startTime}
                            endTime={endTime}
                            elapseTime={elapseTime}
                            iconClicked={() =>
                                iconClicked({
                                    ...channel,
                                    nowprogram: program,
                                })
                            }
                            isShowing={isShowing}
                            index={index}
                            fullScreen={fullScreen}
                            id={`${channel._id} ${index}`}
                        />
                    );
                    index++;
                }
            } else {
                break;
            }
        }
        return res;
    };

    return (
        <div className="channel-row" key={channel.id}>
            <div className="channel-row--programs">{setProgram()}</div>
        </div>
    );
}

const FavoriteIcon = (favorite) => (
    <div
        className={`channel-info--favorite ${
            favorite ? "channel-info--favorited" : ""
        }`}
    >
        <InlineSVG type="favorite" />
    </div>
);
