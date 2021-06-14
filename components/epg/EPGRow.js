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
    width,
    nowTime,
    isLocked,
}) {
    const setProgram = () =>
        channel.program.map((program, index) => (
            <EPGProgram
                tabIndex={1}
                currrentTimeElapsed={currrentTimeElapsed}
                program={program}
                nowTime={nowTime}
                isShowing={isShowing}
                index={index}
                key={`${channel.id} ${index}`}
            />
        ));

    return (
        <div
            className="channel-row"
            key={channel.id}
            onClick={() => onClick(channel)}
        >
            
            <div className="channel-row--programs">
                {setProgram()}
                {setProgram()}
                {setProgram()}
            </div>
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
