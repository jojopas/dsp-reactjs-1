import React from "react";
import smoothscroll from "smoothscroll-polyfill";

import { StoreContext } from "../../store";
import "./epg.less";
import { constants } from "../../config";
import EPGRow from "./EPGRow";
import ChannelLogo from "./EPGChannel";
import ScrollLeftRight from "./ScrollLeftRight";
import { TimeStringList } from "../../helpers/utils/time";
import { fullDate, startDate } from "../../helpers/utils/dates/dates";

export default function EPGList({
    data,
    changeCurrentSlug,
    currentSlug,
    className,
    genres,
    genreHoveredListener,
    promos,
    iconClicked,
    fullScreen,
    pageType,
    onClick,
}) {
    if (typeof window !== "undefined") {
        smoothscroll.polyfill();
    }

    const channelCellWidth = 120;
    if (!data) {
        /// create loader
        const channelRow = (id) => (
            <div className="channel-row" key={id}>
                {Array(5).map((_, index) => (
                    <div
                        className="channel-row--programs"
                        style={{ width: constants.EPG_30_MINUTE_WIDTH }}
                        key={`${id} ${index}`}
                    ></div>
                ))}
            </div>
        );
        const channelRowsNumber = 10;
        return (
            <div className="epg" style={{ width: "100%" }}>
                <div
                    className="left-row"
                    style={{ width: channelCellWidth + 20 }}
                >
                    <div className="timeslot-row" style={{ width: "100%" }}>
                        <div
                            className="timeslot-row--date"
                            style={{ width: "100%" }}
                        ></div>
                    </div>
                    <div className="channel-logos" id="channel">
                        {Array(channelRowsNumber).map((_, index) => (
                            <div
                                className="channel-info"
                                style={{ width: channelCellWidth + 20 }}
                            ></div>
                        ))}
                    </div>
                </div>
                <div className="right-row" style={{ width: "100%" }}>
                    <div className="timeslot-row" style={{ width: "100%" }}>
                        <div
                            className="timeslot-row--date"
                            style={{ width: "100%" }}
                        ></div>
                    </div>

                    <div className="channel" id="channel">
                        {Array(channelRowsNumber).map((_, index) =>
                            channelRow(index)
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const epgRef = React.useRef(null);
    const store = React.useContext(StoreContext);
    const [rowList, setRowList] = React.useState([]);
    const [currentIndex, setCurrentIndex] = React.useState(null);
    const [currentGenre, setCurrentGenre] = React.useState(null);
    const [isMobileEPG, setIsMobileEPG] = React.useState(false);
    let nowTime = 0;
    const now = new Date();
    const elapseTime = now.getTime() / 1000;
    const dateSlots = {};
    const dates = startDate();
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
    nowTime = dates.getTime() / 1000;
    const getDateString = (date) =>
        `${month[date.getMonth()]} ${date.getDate()}`;

    for (let index = 0; index < 8; index++) {
        dateSlots[index < 7 ? getDateString(dates) : ""] =
            dates.getTime() / 1000;
        dates.setDate(dates.getDate() + 1);
        dates.setHours(0, 0, 0, 0);
    }
    // console.log("computeDates", dateSlots, endDates);
    const [startTime, setStartTime] = React.useState(nowTime);
    const [endTime, setEndTime] = React.useState(
        nowTime + constants.EPG_SLOT_TO_RENDER * constants.EPG_SLOT_SECOND
    );
    const [scrolledTime, setScrolledTime] = React.useState(nowTime);
    const currrentTimeElapsed = elapseTime - nowTime;

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

    const debounce = (func, timeout = 1000) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, timeout);
        };
    };

    const getScrolledTime = (dx) =>
        startTime +
        (dx / constants.EPG_30_MINUTE_WIDTH) * constants.EPG_SLOT_SECOND;

    const scrolledTimed = (dx) => setScrolledTime(getScrolledTime(dx));

    const setScrolledTimeFromScrollLeft = debounce((dx) => scrolledTimed(dx));
    const extendProgram = debounce((dx) => extendingEndTime(dx));

    const extendingEndTime = (manualscrollLeft) => {
        // if (!store.isBreakpoint) {
        let { offsetWidth, scrollLeft, scrollWidth } = epgRef.current;
        const finalScroll = manualscrollLeft || scrollLeft;
        // console.log("extendProgram", { offsetWidth, finalScroll, scrollWidth });

        if (
            scrollWidth - finalScroll <=
            constants.EPG_SCROLL_RENDER_TILL * offsetWidth
        ) {
            setEndTime(
                endTime +
                    constants.EPG_SLOT_TO_RENDER * constants.EPG_SLOT_SECOND
            );
            setScrolledTimeFromScrollLeft(finalScroll);
            console.log("extendProgram true", {
                offsetWidth: offsetWidth,
                scrollLeft: fullDate(getScrolledTime(finalScroll)),
                scrollWidth: fullDate(getScrolledTime(scrollWidth)),
                scrolled: scrollWidth - finalScroll,
                endTime,
                scrolled: fullDate(scrolledTime),
            });
        } else {
            setScrolledTimeFromScrollLeft(finalScroll);
        }
        // }
    };

    React.useEffect(() => {
        window.addEventListener("scroll", epgScroll);
        window.addEventListener("touchmove", touchMoveEvent);
        window.addEventListener("wheel", wheelMoveEvent);

        return () => {
            window.removeEventListener("scroll", epgScroll);
            window.removeEventListener("touchmove", touchMoveEvent);
            window.removeEventListener("wheel", wheelMoveEvent);
        };
    }, []);

    const touchMoveEvent = (event) => {
        // console.log("touchmove", event);
        extendProgram();
    };

    const wheelMoveEvent = (event) => {
        if (event.deltaY <= 0) {
            extendProgram();
        }
    };

    const TimeElapsed = () =>
        startTime > elapseTime ? null : (
            <div
                key="timeElapsed"
                className="timeElapsed"
                style={{
                    width: `${currrentTimeWidth()}px`,
                }}
            ></div>
        );

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
        document.querySelector(
            ".scroll"
        ).style.cssText = `transform:translateY(${scrollTop}px)`;
    };

    const setDate = (event) => {
        const setDate = Number(event.target.value);
        console.log("DateSelected", {
            event: event.target.value,
            elapseTime: fullDate(elapseTime),
            selected: fullDate(setDate),
        });
        setStartTime(setDate);
        setScrolledTime(setDate);

        setEndTime(
            setDate + constants.EPG_SLOT_TO_RENDER * constants.EPG_SLOT_SECOND
        );
    };

    const nextEPGDates = () => {
        const selectValue = Object.keys(dateSlots).reduce(
            (obj, key) => {
                if (key) {
                    if (scrolledTime >= dateSlots[key]) {
                        obj.value = dateSlots[key];
                    }
                    obj.options.push(
                        <option value={dateSlots[key]} key={key}>
                            {key}
                        </option>
                    );
                }
                return obj;
            },
            { options: [] }
        );
        return (
            <div className="timeslot-row">
                <div
                    className="timeslot-row--date"
                    style={{ width: channelCellWidth + 20 }}
                    key={"Date"}
                >
                    <div className="timeslot-row--date-select">
                        <select
                            name="epgDate"
                            id="epgDate"
                            value={selectValue.value}
                            onChange={setDate}
                        >
                            {selectValue.options}
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
        return startTime > nowTime ? 0 : Math.abs(resultantWidth);
    };

    const onHorizontalScroll = (left) => {
        const flag = left ? -1 : 1;
        // Get Width of the viewable scroll area, and it's scrollLeft
        let { offsetWidth, scrollLeft, scrollWidth } = epgRef.current;
        // Check if we are on an increment of 30_MINUTE_WIDTH, if not, fix our positioning
        if (scrollLeft % constants.EPG_30_MINUTE_WIDTH !== 0) {
            if (left) {
                scrollLeft =
                    Math.ceil(scrollLeft / constants.EPG_30_MINUTE_WIDTH) *
                    constants.EPG_30_MINUTE_WIDTH;
            } else {
                scrollLeft =
                    Math.floor(scrollLeft / constants.EPG_30_MINUTE_WIDTH) *
                    constants.EPG_30_MINUTE_WIDTH;
            }
        }
        // Max number of complete 30 min blocks that can scroll w/o going past what was viewable before
        const maxScrollSegments = Math.floor(
            offsetWidth / constants.EPG_30_MINUTE_WIDTH
        );
        // Multiply the 30 minute width times the max segments
        const scrollAmt = constants.EPG_30_MINUTE_WIDTH * maxScrollSegments;
        // Get new left scroll position to scroll to
        let newLeft = scrollLeft + flag * scrollAmt;
        // Outer bounds
        if (newLeft < 0) {
            // If the newLeft is less than 0, set to 0
            newLeft = 0;
        } else if (newLeft > scrollWidth - offsetWidth) {
            // If the newLeft is greater than scrollWidth - offsetWidth, set to scrollWidth - offsetWidth
            newLeft = scrollWidth - offsetWidth;
        }
        // Only scroll if newLeft is different than current left
        if (newLeft !== scrollLeft) {
            // Use native scrollTo (the polyfill is added above)
            epgRef.current.scrollTo({
                top: 0,
                left: newLeft,
                behavior: "smooth",
            });
            extendProgram(newLeft);
        }
    };

    const todaysTimeSlots = () => {
        const timeSlots = TimeStringList(startTime, endTime);
        return (
            <div className="timeslot-row">
                {timeSlots.map((time, index) => (
                    <div
                        className={`${"timeslot-row--time"}`}
                        style={{
                            width: Math.floor(
                                constants.EPG_30_MINUTE_WIDTH - 10
                            ),
                        }}
                        key={`${time}${index}`}
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

    const rightContainer = [<TimeElapsed key="timeElapse" />];

    rowList.forEach((channel, channelIndex) => {
        leftContainer.push(
            <ChannelLogo
                channel={channel}
                onClick={() => onClick(channel)}
                width={channelCellWidth}
                isShowing={channelIndex === currentIndex}
                isLocked={channelIndex % 2 === 1}
                index={channelIndex}
                id={channel._id}
            />
        );
        rightContainer.push(
            <EPGRow
                channel={channel}
                onClick={onClick}
                currrentTimeElapsed={currrentTimeElapsed}
                favorite={channelIndex < 5}
                fullScreen={fullScreen}
                startTime={startTime < nowTime ? nowTime : startTime}
                endTime={endTime}
                elapseTime={elapseTime}
                iconClicked={iconClicked}
                width={channelCellWidth}
                isShowing={channelIndex === currentIndex}
                isLocked={channelIndex % 2 === 1}
            />
        );
    });

    // console.log({
    //     current: fullDate(startTime),
    //     scrolledTime: fullDate(scrolledTime),
    //     endTime: fullDate(endTime),
    //     Diff: endTime - startTime,
    // });
    return (
        <div className="epg">
            <ScrollLeftRight onScrollLeft={onHorizontalScroll} />
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
