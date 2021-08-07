import "./epg.less";
import React from "react";
import { DateString, timeAfterDay } from "../../helpers/utils/dates/dates";
const EPGDateDropdown = ({ channelCellWidth, value, setDate, nowTime }) => {
    const dates = React.useMemo(() => DateString(nowTime), [nowTime]);
    console.log("DateDropdown", { channelCellWidth, value, setDate, nowTime });
    // const dates = dateList(nowTime);

    const onDateChange = (event) => {
        const time = Number(event.target.value);
        if (time === 0) {
            setDate(nowTime, time);
        } else {
            setDate(timeAfterDay(time), time);
        }
    };
    return (
        <div className="timeslot-row">
            <div
                className="timeslot-row--date"
                style={{ width: channelCellWidth }}
                key={"Date"}
            >
                <div className="timeslot-row--date-select">
                    <select
                        name="epgDate"
                        id="epgDate"
                        value={value < 1000 ? value : nowTime}
                        onChange={onDateChange}
                    >
                        {Object.keys(dates).map((key, index) =>
                            key ? (
                                <option value={index} key={key}>
                                    {key}
                                </option>
                            ) : null
                        )}
                    </select>
                </div>
            </div>
        </div>
    );
};
const equalProps = (prepProp, nextProp) => {
    console.log("check epgDropdown", prepProp.value, nextProp.value);
    return prepProp.value === nextProp.value;
};
export default React.memo(EPGDateDropdown, equalProps);
