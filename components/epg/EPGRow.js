import React from "react";

import "./epg.css";
import { constants } from "../../config";
import EPGProgram from "./EPGProgram";
export default function EPGRow({channel, favorite, nowShowing}) {
    return (
        <div className="channel-row" key={channel.id}>
            <div className="channel-info" title={channel.name}>
                <div
                    class={`channel-info--favorite ${
                        favorite ? "channel-info--favorited" : ""
                    }`}
                >
                    <svg viewBox="0 0 40 40">
                        <path
                            d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
	c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"
                        />
                    </svg>
                </div>
                <div className="channel-info--image" title={channel.name}>
                    {channel.logo ? (
                        <img
                            className="channel-info--image"
                            src={constants.NOT_FOUND_SRC}
                            data-sizes="auto"
                            data-srcset={`${channel.logo}/50`}
                            data-src={`${channel.logo}/50`}
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
                </div>
            </div>
            <div className="channel-row--programs">
                {channel.program.map((program, index) => (
                    <EPGProgram
                        program={program}
                        nowShowing={nowShowing && index === 0}
                        key={`${channel.id} ${index}`}
                    />
                ))}
                {channel.program.map((program, index) => (
                    <EPGProgram
                        program={program}
                        nowShowing={false}
                        key={`${channel.id} 1${index}`}
                    />
                ))}
                {channel.program.map((program, index) => (
                    <EPGProgram
                        program={program}
                        nowShowing={false}
                        key={`${channel.id} 2${index}`}
                    />
                ))}
            </div>
        </div>
    );
}
