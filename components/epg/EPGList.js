import React from "react";

import { StoreContext } from "../../store";
import "./epg.less";
import { constants } from "../../config";
import EPGRow from "./EPGRow";
import ChannelLogo from "./EPGChannel";
import ScrollLeftRight from "./ScrollLeftRight";

export default function EPGList({
    data,
    changeCurrentSlug,
    currentSlug,
    className,
    genres,
    genreHoveredListener,
    promos,
    iconClicked,
    pageType,
    onClick,
}) {
    const channelCellWidth = 120;
    const epgRef = React.useRef(null);
    const store = React.useContext(StoreContext);
    const [rowList, setRowList] = React.useState([]);
    const [currentIndex, setCurrentIndex] = React.useState(null);
    const [currentGenre, setCurrentGenre] = React.useState(null);
    const [marginTop, setMarginTop] = React.useState(0);
    const [isMobileEPG, setIsMobileEPG] = React.useState(false);
    let channelRef, timeRowRef;
    let nowTime = 0;
    const now = new Date();
    const elapseTime = now.getTime() / 1000;
    now.setMinutes(now.getMinutes() > 29 ? 30 : 0);
    nowTime = now.getTime() / 1000;
    const dateSlots = {};
    const [currentTime, setCurrentTime] = React.useState(elapseTime);
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

        return () => window.removeEventListener("scroll", epgScroll);
    }, [currentGenre, store.isVideoLoading]);

    const TimeElapsed = () =>
        currentTime > elapseTime ? null:(
            <div
                key="timeElapsed"
                className="timeElapsed"
                style={{
                    width: `${currrentTimeWidth()}px`,
                }}
            ></div>
        ) ;

    const epgScroll = (eve) => {
        if (!isMobileEPG) {
            setIsMobileEPG(true);
        }
        const scrollTop = eve.target.scrollingElement.scrollTop;
        const isTop = scrollTop > 0;
        const rows = document.querySelectorAll(".timeslot-row");
        rows.forEach((row) => {
            row.style.cssText = isTop
                ? `background-color: #0e212f; transform:translateY(${scrollTop}px)`
                : `transform:translateY(${scrollTop}px)`;
        });
        const arrows = document.querySelectorAll(".scroll");
        arrows.forEach((arrow) => {
            arrow.style.cssText = `transform:translateY(${scrollTop}px)`;
        });
    };

    const setDate = (event) => {
        const setDate = event.target.value;
        // console.log("DateSelected", elapseTime, setDate, setDate - elapseTime);
        setCurrentTime(Number(setDate));
    };

    const nextEPGDates = () => {
        const date = new Date();
        const month = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        date.setHours(0, 0);
        const getDateString = (date) =>
            `${month[date.getMonth()]} ${date.getDate()}`;
        for (let index = 0; index < 7; index++) {
            dateSlots[getDateString(date)] =
                index == 0 ? elapseTime : date.getTime() / 1000;
            date.setDate(date.getDate() + 1);
        }

        return (
            <div className="timeslot-row" style={{ top: marginTop }}>
                <div
                    className="timeslot-row--date"
                    style={{ width: channelCellWidth + 20 }}
                    key={"Date"}
                >
                    <div className="timeslot-row--date-select">
                        <select name="epgDate" id="epgDate" onChange={setDate}>
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
        const resultantWidth = Math.floor(
            (currrentTimeElapsed / 30 / 60) * constants.EPG_30_MINUTE_WIDTH
        );
        return currentTime > elapseTime ? 0 : Math.abs(resultantWidth);
    };

    const onScrollLeft = (left) => {
        const flag = left ? -1 : 1;
        epgRef.current.scrollLeft += flag * 0.9 * constants.EPG_30_MINUTE_WIDTH;
    };

    const todaysTimeSlots = () => {
        const Total_Minutes_A_Day = 24 * 60;
        const now = new Date();
        const hours = now.getHours();
        let minutes = now.getMinutes() > 29 ? 30 : 0;
        now.setMinutes(minutes, 0, 0);
        let timeSlots = [];
        let initialTime = hours * 60 + minutes;
        if (currentTime > elapseTime) {
            initialTime = 0;
        }

        for (let time = initialTime; time < Total_Minutes_A_Day; time += 30) {
            const hour = Math.floor(time / 60);
            const minute = time % 60;
            const hourPast = hour > 12;
            timeSlots.push(
                `${hourPast ? hour - 12 : hour}:${minute > 29 ? "30" : "00"}${
                    hourPast || hour === 12 ? "p" : "a"
                }`
            );
        }

        return (
            <div
                className="timeslot-row"
                stay="top"
                style={{ top: marginTop }}
                stay-revert-to-fixed="0"
            >
                {timeSlots.map((time, index) => (
                    <div
                        className={`${"timeslot-row--time"}`}
                        style={{ width: constants.EPG_30_MINUTE_WIDTH - 22 }}
                        key={time}
                    >
                        <h2>{time}</h2>
                        {index === 0 ? (
                            <>
                                {" "}
                                <div
                                    className="timeslot-row--underline"
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

    const rightContainer = [<TimeElapsed />];

    rowList.forEach((channel, channelIndex) => {
        leftContainer.push(
            <ChannelLogo
                channel={channel}
                onClick={() => onClick(channel)}
                width={channelCellWidth}
                isShowing={channelIndex === currentIndex}
                isLocked={channelIndex % 2 === 1}
                index={channelIndex}
            />
        );
        rightContainer.push(
            <EPGRow
                channel={channel}
                onClick={onClick}
                currrentTimeElapsed={currrentTimeElapsed}
                favorite={channelIndex < 5}
                nowTime={currentTime}
                iconClicked={iconClicked}
                width={channelCellWidth}
                isShowing={channelIndex === currentIndex}
                isLocked={channelIndex % 2 === 1}
            />
        );
    });

    return (
        <div className="epg">
            {!store.isBreakpoint && (
                <ScrollLeftRight onScrollLeft={onScrollLeft} />
            )}
            <div className="left-row" style={{ width: channelCellWidth }}>
                {nextEPGDates()}
                <div className="channel-logos">{leftContainer}</div>
            </div>
            <div className="right-row" ref={epgRef}>
                {todaysTimeSlots()}
                <div className="channel" id="channel">
                    {rightContainer}
                </div>
            </div>
        </div>
    );
}
