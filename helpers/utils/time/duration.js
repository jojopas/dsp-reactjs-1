export function duration(time, asText = false) {
    let secNum = parseInt(time, 10); // don't forget the second param
    if (isNaN(secNum)) {
        secNum = 0;
    }
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor((secNum - hours * 3600) / 60);

    let newTime = "";

    if (asText) {
        if (parseInt(hours, 10) > 0) {
            newTime += `${hours}h `;
        }
        if (parseInt(minutes, 10) > 0) {
            newTime += `${minutes}m`;
        }
    } else {
        if (hours < 10) {
            hours = `0${hours}`;
        }
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        if (parseInt(hours, 10) > 0) {
            newTime += `${hours}:`;
        }
        newTime += `${minutes}`;
    }

    return newTime;
}

const getSanitiseHour = (hours) =>
    hours === 12 || hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

export const TimeStringList = (
    startTime,
    endTime,
    config = { slotInSeconds: 30 * 60, isContinuation: false }
) => {
    const timeList = [];
    const date = new Date(0);
    date.setUTCSeconds(startTime);
    let is30Minute = date.getMinutes() > 29;
    date.setMinutes(is30Minute ? 30 : 0, 0, 0);
    let time = date.getTime() / 1000;
    let hour = date.getHours();
    //Doesn;t need to add nowTime because it will already be there
    if (config.isContinuation) {
        time += config.slotInSeconds;
        if (is30Minute) {
            hour++;
        }
        is30Minute = !is30Minute;
    }
    while (time < endTime) {
        timeList.push(
            `${getSanitiseHour(hour)}:${is30Minute ? "30" : "00"}${
                hour > 11 ? "p" : "a"
            }`
        );
        time += config.slotInSeconds;
        if (is30Minute) {
            hour++;
            if (hour === 24) {
                hour = 0;
            }
        }
        is30Minute = !is30Minute;
    }
    return timeList;
};
