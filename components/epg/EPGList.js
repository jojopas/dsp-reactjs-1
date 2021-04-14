import React from "react";

import { StoreContext } from "../../store";
import "./epg.css";
import { constants } from "../../config";
import EPGRow from "./EPGRow";
export default function EPGList({
    data,
    changeCurrentSlug,
    currentSlug,
    className,
    genres,
    genreHoveredListener,
    promos,
    pageType,
}) {
    const store = React.useContext(StoreContext);
    const [rowList, setRowList] = React.useState([]);
    const [currentIndex, setCurrentIndex] = React.useState(null);
    const [currentGenre, setCurrentGenre] = React.useState(null);

    function filterList() {
        const filteredResult = data.filter((row, index) => {
            if (row.slug === currentSlug) {
                setCurrentIndex(index);
                return false;
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
        if (data) {
            setRowList(filterList());
        }
    }, [currentGenre]);

    const nextEPGDates = () => {
        const now = new Date();
        let dateSlots = {};
        dateSlots[now.toDateString().substring(0, 10)] = now.getTime();
        for (let index = 0; index < 6; index++) {
            now.setDate(now.getDate() + 1);
            dateSlots[now.toDateString().substring(0, 10)] = now.getTime();
        }

        return (
            <form>
                <select name="epgDate" id="epgDate" >
                    {Object.keys(dateSlots).map((key) => (
                        <option value={dateSlots[key]} key={key}>{key}</option>
                    ))}
                </select>
            </form>
        );
    };

    const currrentTimeElapsed = () => {
        const now = new Date();
        const minutes = now.getMinutes() > 29 ? 30 : 0;
        const resultantWidth = ((now.getMinutes() - minutes) / 30) * 200;
        return Math.abs(resultantWidth);
    };

    const todaysTimeSlots = () => {
        const Total_Minutes_A_Day = 24 * 60;
        const now = new Date();
        const hours = now.getHours();
        let minutes = now.getMinutes() > 29 ? 30 : 0;
        let timeSlots = [now.toDateString().substring(0, 10)];
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

        return timeSlots.map((time, index) => (
            <div
                className={`${
                    index == 0 ? "timeslot-row--date" : "timeslot-row--time"
                }`}
                key={time}
            >
                {index == 0 ? nextEPGDates() : time}
                {index === 1 ? (
                    <div
                        className="timeslot-row--timeElapse"
                        style={{
                            width: `${currrentTimeElapsed()}px`,
                        }}
                    ></div>
                ) : null}
            </div>
        ));
    };

    return (
        <div className="epg">
            <div
                className="timeElapsed"
                style={{
                    left: `${150 + currrentTimeElapsed()}px`,
                }}
            ></div>
            <div className="timeslot-row">{todaysTimeSlots()}</div>

            <div className="channel">
                {rowList.map((channel, channelIndex) => (
                    <EPGRow
                        channel={channel}
                        favorite={channelIndex < 5}
                        nowShowing={channelIndex === 2}
                    />
                ))}
            </div>
        </div>
    );
}
