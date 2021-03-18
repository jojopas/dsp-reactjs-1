export default function duration(time, asText=false) {
	let secNum = parseInt(time, 10); // don't forget the second param
	if (isNaN(secNum)) {
		secNum = 0;
	}
	let hours = Math.floor(secNum / 3600);
	let minutes = Math.floor((secNum - (hours * 3600)) / 60);

	let newTime = '';

	if(asText){
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
