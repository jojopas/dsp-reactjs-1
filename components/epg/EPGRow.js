import React from "react";

import "./epg.less";
import { constants } from "../../config";
import EPGProgram from "./EPGProgram";
import InlineSVG from "../InlineSVG";
export default function EPGRow({
    channel,
    favorite,
    nowShowing,
    onClick,
    currrentTimeElapsed,
    width,
    nowTime,
    locked,
}) {
    const setProgram = () =>
        channel.program.map((program, index) => (
            <EPGProgram
                tabIndex={1}
                currrentTimeElapsed={currrentTimeElapsed}
                program={program}
                nowTime={ nowTime }
                nowShowing={nowShowing}
                index={index}
                key={`${channel.id} ${index}`}
            />
        ));

    const channelStyle = {
        width: width,
        // background: `url(${channel.logo}/${width - 10})`,
    };
    if (nowShowing) {
        channelStyle.backgroundColor = "#fbcc35";
    }
    return (
        <div
            className="channel-row"
            key={channel.id}
            onClick={() => onClick(channel)}
        >
            <div
                className={"channel-info"}
                style={channelStyle}
                title={channel.name}
            >
                {/* <div className="channel-info--image" title={channel.name}> */}
                {channel.logo ? (
                    <img
                        className="channel-info--image"
                        src={constants.NOT_FOUND_SRC}
                        data-sizes="auto"
                        data-srcset={`${channel.logo}/${width - 30}`}
                        data-src={`${channel.logo}/${width - 30}`}
                        alt={channel.name}
                        className="lazyload"
                    />
                ) : (
                    <img
                        className="channel-info--image"
                        src={constants.NOT_FOUND_SRC}
                        alt={channel.name}
                        className="lazyloaded"
                    />
                )}
                {locked && (
                    <div className="channel-info--locked">
                        <InlineSVG type="lock" />
                    </div>
                )}
                {/* </div> */}
            </div>
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
