import React from "react";

import "./epg.less";
export default function EPGProgram({ program, nowShowing, key }) {
      const timeDuration = (seconds) => {
          const date = new Date(0);
          date.setSeconds(seconds);
          const timeDuration = date.toISOString().substr(11, 5);
          return timeDuration;
      };
      
    return program.duration > 250 ? (
        <div
            className={`channel-row--program ${
                nowShowing ? "channel-active" : ""
            }`}
            style={{
                width: `${(program.duration / 1800) * 200 - 22}px`,
            }}
            title={program.title}
            id={program.duration}
            key={key}
        >
            <div className="channel-row--program---title">
                {/* <div className="channel-row--program---duration">
                                        {durationToString(program.duration)}
                                    </div> */}
                {nowShowing ? (
                    <div className="channel-row--program---duration">
                        {timeDuration(program.duration)}
                    </div>
                ) : null}
                {program.title}
                {nowShowing ? (
                    <div
                        className="channel-row--program---description"
                        title={program.description}
                    >
                        {program.description}
                    </div>
                ) : null}
            </div>
        </div>
    ) : (
        <></>
    );
}
