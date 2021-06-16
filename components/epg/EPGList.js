import React from "react";

import { StoreContext } from "../../store";
import "./epg.less";
import { constants } from "../../config";
import EPGRow from "./EPGRow";
import ChannelLogo from "./EPGChannel";
export default function EPGList({
    data,
    changeCurrentSlug,
    currentSlug,
    className,
    genres,
    genreHoveredListener,
    promos,
    pageType,
    onClick,
}) {
    const channelCellWidth = 100;
    const store = React.useContext(StoreContext);
    const [rowList, setRowList] = React.useState([]);
    const [currentIndex, setCurrentIndex] = React.useState(null);
    const [currentGenre, setCurrentGenre] = React.useState(null);
    const [marginTop, setMarginTop] = React.useState(0);
    let channelRef, timeRowRef;
    let nowTime = 0;
    const now = new Date();
    const currentTime = now.getTime() / 1000;
    now.setMinutes(now.getMinutes() > 29 ? 30 : 0);
    nowTime = now.getTime() / 1000;
    const currrentTimeElapsed = currentTime - nowTime;
    function filterList() {
        const filteredResult = data.filter((row, index) => {
            if (row.slug === currentSlug) {
                setCurrentIndex(index);
                // return false;
            }
            return (
                !currentGenre ||
                currentGenre === "" ||
                (row.genres && row.genres.includes(currentGenre))
            );
        });

        // working in promos into the channels
        let promosStep = 0;
        const promosLength = promos && promos.length;
        const allChannels =
            filteredResult &&
            filteredResult.map((c, index) => {
                if (
                    (index > 0 &&
                        index % (constants.EPG_PROMO_CNT - 1) === 0) ||
                    (index === filteredResult.length - 1 && promosStep === 0)
                ) {
                    if (promosStep < promosLength) {
                        const returnPromo = {
                            type: "promo",
                            ...promos[promosStep],
                        };
                        promosStep = promosStep + 1;
                        return [c, returnPromo];
                    }
                }
                return c;
            });
        return allChannels && [].concat.apply([], allChannels);
    }

    React.useEffect(() => {
        if (data) {
            setRowList(filterList());
        }
    }, [data, currentSlug]);

    React.useEffect(() => {
        window.addEventListener("scroll", epgScroll);
        if (data) {
            setRowList(filterList());
        }
    }, [currentGenre]);

    const epgScroll = (eve) => {
        if (eve.target?.scrollingElement?.scrollTop) {
            debounce(
                Number(
                    eve.target?.scrollingElement?.scrollTop ??
                        eve.target?.scrollTop
                )
            );
            console.log("marginTop", eve.target?.scrollingElement?.scrollTop);
        }
    };

    const stMargin = () => {
        let fn;
        return (number) => {
            if (fn) {
                clearTimeout(fn);
            }
            fn = setTimeout(() => setMarginTop(number), 50);
        };
    };

    const debounce = stMargin();

    const nextEPGDates = () => {
        const date = new Date();
        date.setHours(0, 0);
        let dateSlots = {};
        const getDateString = (date) =>
            `${date.getDate()} ${date.toDateString().substring(0, 4)}`;
        dateSlots["Today"] = date.getTime();
        for (let index = 0; index < 6; index++) {
            date.setDate(date.getDate() + 1);
            if (index == 0) {
                dateSlots["Tomorrow"] = date.getTime();
            } else {
                dateSlots[getDateString(date)] = date.getTime();
            }
        }

        return (
            <div className="timeslot-row" style={{ top: marginTop }}>
                <div
                    className={`${"timeslot-row--date"}`}
                    style={{ width: channelCellWidth + 20 }}
                    key={"Date"}
                >
                    <div className="custom-select">
                        <select name="epgDate" id="epgDate">
                            {Object.keys(dateSlots).map((key) => (
                                <option value={dateSlots[key]} key={key}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        );
    };

    const currrentTimeWidth = () => {
        const resultantWidth =
            (currrentTimeElapsed / 30 / 60) * constants.EPG_30_MINUTE_WIDTH;
        return Math.abs(resultantWidth);
    };

    // console.log("nowtime", nowTime, currrentTimeElapsed);

    const todaysTimeSlots = () => {
        const Total_Minutes_A_Day = 24 * 60;
        const now = new Date();
        const hours = now.getHours();
        let minutes = now.getMinutes() > 29 ? 30 : 0;
        now.setMinutes(minutes, 0, 0);
        // console.log("nowTime1", nowTime, new Date().setUTCSeconds(nowTime));

        let timeSlots = [];
        let initialTime = hours * 60 + minutes;
        for (let time = initialTime; time < Total_Minutes_A_Day; time += 30) {
            const hour = Math.floor(time / 60);
            const minute = time % 60;
            const hourPast = hour > 12;
            timeSlots.push(
                `${hourPast ? hour - 12 : hour}:${minute > 29 ? "30" : "00"}${
                    hourPast ? "p" : "a"
                }`
            );
        }

        return (
            <div
                className="timeslot-row"
                stay="top"
                style={{ top: marginTop }}
                stay-revert-to-fixed="0"
                ref={(ref) => {
                    console.log("timeslot ref", ref);
                    timeRowRef = ref;
                }}
            >
                {timeSlots.map((time, index) => (
                    <div
                        className={`${"timeslot-row--time"}`}
                        style={{ width: constants.EPG_30_MINUTE_WIDTH - 22 }}
                        key={time}
                    >
                        {time}
                        {index === 0 ? (
                            <>
                                {" "}
                                <div
                                    className="timeslot-row--underline"
                                    style={{
                                        width: `${currrentTimeWidth()}px`,
                                    }}
                                ></div>
                                <div
                                    className="timeElapsed"
                                    style={{
                                        width: `${currrentTimeWidth()}px`,
                                    }}
                                ></div>
                            </>
                        ) : null}
                    </div>
                ))}
            </div>
        );
    };
    const leftContainer = [];
    const rightContainer = [];
    rowList.forEach((channel, channelIndex) => {
        leftContainer.push(
            <ChannelLogo
                channel={channel}
                onClick={() => onClick(channel)}
                width={channelCellWidth}
                isShowing={channelIndex === currentIndex}
                isLocked={channelIndex % 2 === 1}
            />
        );
        rightContainer.push(
            <EPGRow
                channel={channel}
                onClick={onClick}
                currrentTimeElapsed={currrentTimeElapsed}
                favorite={channelIndex < 5}
                nowTime={nowTime}
                width={channelCellWidth}
                isShowing={channelIndex === currentIndex}
                isLocked={channelIndex % 2 === 1}
            />
        );
    });
    return (
        <div className="epg">
            <div className="left-row" style={{ width: channelCellWidth }}>
                {nextEPGDates()}
                <div className="channel-logos">{leftContainer}</div>
            </div>
            <div className="right-row">
                {todaysTimeSlots()}

                <div className="channel" id="channel">
                    {rightContainer}
                </div>
            </div>
        </div>
    );
    return (
        <div className="epg">
            <div
                className="timeElapsed"
                style={{
                    left: channelCellWidth + 32,
                    width: `${currrentTimeElapsed()}px`,
                }}
            ></div>
        </div>
    );
}
