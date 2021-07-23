export const get7DayDates = () => dateSlots;
export const getEndTime = (time) => dateEndTime[time];

export const getFormattedDate = (date, config = { separator: "." }) => {
    let enterDate = date;
    // console.log("getFormattedDate", typeof date);
    if (typeof date === "number") {
        enterDate = new Date();
        enterDate.setUTCSeconds(date);
    }
    var year = enterDate.getFullYear();

    var month = (1 + enterDate.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    var day = enterDate.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return month + config.separator + day + config.separator + year;
};

const getTimeString = (date, format) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const amPm = hours > 11 ? "p" : "a";
    hours = hours === 12 || hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    hours = hours > 9 ? hours.toString() : "0" + hours;
    minutes = minutes > 9 ? minutes.toString() : "0" + minutes;
    return { time: hours + ":" + minutes, amPm };
};

export const timeDuration = (seconds) => {
    const date = new Date(0);
    date.setUTCSeconds(seconds);
    return getTimeString(date).time;
};

export const timeDurationStartStop = (
    startSeconds,
    endSeconds,
    config = { separator: "-" }
) => {
    const date = new Date();
    date.setUTCSeconds(startSeconds);
    const startTime = getTimeString(date);
    const endDate = new Date()
    endDate.setUTCSeconds(endSeconds);
    const endTime = getTimeString(endDate);
    let timeString;
    if (startTime.amPm === endTime.amPm) {
        timeString = `${startTime.time}${config.separator}${endTime.time}${startTime.amPm}`;
    } else {
        timeString = `${Object.values(startTime).join("")}${
            config.separator
        }${Object.values(endTime).join("")}`;
    }

    return timeString;
};

export const timeLeftDuration = (seconds) => {
    const date = new Date(0);
    date.setUTCSeconds(seconds);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const timeDuration = date.toISOString().substr(11, 5);
    return hours > 0 ? `${hours}h ${minutes}m ` : `${minutes}m `;
};
    