import React from "react";
import smoothscroll from "smoothscroll-polyfill";

import { StoreContext } from "../../store";
import "./epg.less";
import { constants } from "../../config";
import EPGRow from "./EPGRow";
import ChannelLogo from "./EPGChannel";
import ScrollLeftRight from "./ScrollLeftRight";
import { TimeStringList } from "../../helpers/utils/time";
import {
    fullDate,
    startDate,
    timeAfterDay,
} from "../../helpers/utils/dates/dates";
import EPGDateDropDown from "./EPGDateDropDown";
let nextDayTime = -1;
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
    const epgRef = React.useRef(null);
    const store = React.useContext(StoreContext);
    const [rowList, setRowList] = React.useState([]);
    const [currentIndex, setCurrentIndex] = React.useState(null);
    const [currentGenre, setCurrentGenre] = React.useState(null);
    const [isMobileEPG, setIsMobileEPG] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState(0);

    const now = new Date();
    const elapseTime = now.getTime() / 1000;
    const nowTime = startDate().getTime() / 1000;
    // console.log("computeDates", dateSlots, endDates);

    const [epgTime, setEPGTime] = React.useState({
        start: nowTime,
        end: nowTime + constants.EPG_SLOT_TO_RENDER * constants.EPG_SLOT_SECOND,
    });
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
        epgTime.start +
        (dx / constants.EPG_30_MINUTE_WIDTH) * constants.EPG_SLOT_SECOND;

    const checkDateBYScrolled = (scrolledTime) => {
        if (nextDayTime === -1) {
            nextDayTime = (timeAfterDay(1));
        }
        let res = -1;
        if (selectedDate === 0) {
            if (scrolledTime > nextDayTime) {
                res = 1;
            }
        } else {
            if (scrolledTime < nextDayTime) {
                res = 0;
            } else {
                const day = Math.floor(
                    Math.abs((scrolledTime - nextDayTime) / 86400)
                );
                if (day > 1) {
                    if (day !== selectedDate - 1) {
                        res = 1 + day;
                    }
                }
            }
        }
        console.log("scrolled", {
            nextDayTime,
            diff: scrolledTime - nextDayTime,
            selectedDate,
            res,
        });
        if (res !== -1) {
            setSelectedDate(res);
        }
    };
    const scrolledTimed = (dx) => {
        const scrolledTime = getScrolledTime(dx);
        checkDateBYScrolled(scrolledTime);
    };

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
            setEPGTime({
                start: epgTime.start,
                end:
                    epgTime.end +
                    constants.EPG_SLOT_TO_RENDER * constants.EPG_SLOT_SECOND,
            });
            setScrolledTimeFromScrollLeft(finalScroll);
            console.log("extendProgram true", {
                offsetWidth: offsetWidth,
                scrollLeft: fullDate(getScrolledTime(finalScroll)),
                scrollWidth: fullDate(getScrolledTime(scrollWidth)),
                scrolled: scrollWidth - finalScroll,
                endTime: epgTime,
                // scrolled: fullDate(scrolledTime),
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
        selectedDate === 0 ? null : (
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
                ? `transform:translateY(${scrollTop}px)`
                : `transform:translateY(${scrollTop}px)`;
        });
        document.querySelector(
            ".scroll"
        ).style.cssText = `transform:translateY(${scrollTop}px)`;
    };

    const setDate = (dateTime, dateSelected) => {
        setEPGTime({
            start: dateTime,
            end:
                dateTime +
                constants.EPG_SLOT_TO_RENDER * constants.EPG_SLOT_SECOND,
        });
        setSelectedDate(dateSelected);
        console.log("DateSelected", {
            event: event.target.value,
            elapseTime: fullDate(elapseTime),
            selected: fullDate(dateTime),
            // scrolledTime: fullDate(scrolledTime),
            endTime: fullDate(epgTime.end),
        });
    };

    const currrentTimeWidth = () => {
        if (epgTime.start < elapseTime) {
            const resultantWidth = Math.floor(
                (currrentTimeElapsed / 30 / 60) * constants.EPG_30_MINUTE_WIDTH
            );
            return Math.abs(resultantWidth);
        }
        return 0;
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
        const timeSlots = TimeStringList(
            selectedDate == 0 ? nowTime : epgTime.start,
            epgTime.end
        );
        return (
            <div className="timeslot-row">
                {timeSlots.map((time, index) => (
                    <div
                        className={`${"timeslot-row--time"}`}
                        style={{
                            width: Math.floor(constants.EPG_30_MINUTE_WIDTH),
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
                startTime={epgTime.start < nowTime ? nowTime : epgTime.start}
                endTime={epgTime.end}
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
                <EPGDateDropDown
                    channelCellWidth={channelCellWidth}
                    value={selectedDate}
                    setDate={setDate}
                    nowTime={nowTime}
                />

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
