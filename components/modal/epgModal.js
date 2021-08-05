import "./modal.less";
import { constants } from "../../config";
import InliveSVG from "../InlineSVG";
import InlineSVG from "../InlineSVG";
import {
    timeDurationStartStop,
    getFormattedDate,
    timeLeftDuration,
} from "../../helpers/utils/dates/dates";
import Button from "../button/Button";

const EPGModal = ({ data, resetFn, onClick }) => {
    const now = new Date();
    const nowTime = now.getTime() / 1000;
    const isBroadcasting =
        nowTime >= data?.nowprogram?.starts &&
        nowTime <= data?.nowprogram?.ends;
    // console.log("date", data, getFormattedDate);
    const clicked = () => {
        console.log("Clicked", data);
        resetFn();
        onClick(data);
    };
    return data ? (
        <div id="myModal" className="modal">
            <div className="modal-content">
                <div className="close" onClick={() => resetFn()}>
                    <InlineSVG type="close" />
                </div>
                <div className="modal-header">
                    <div>
                        <div className="modal-time">
                            {timeDurationStartStop(
                                data.nowprogram.starts,
                                data.nowprogram.ends
                            )}{" "}
                            {constants.BULLETS}
                            <span className="modal-time-left">
                                {timeLeftDuration(
                                    isBroadcasting
                                        ? data.nowprogram.ends - nowTime
                                        : data.nowprogram.starts - nowTime
                                )}
                                left
                            </span>
                        </div>
                        <h1>{data.nowprogram.title}</h1>
                    </div>
                    <img
                        className="current-channel-information-img"
                        src={constants.NOT_FOUND_SRC}
                        data-sizes="auto"
                        data-srcset={`${data.logo}/60`}
                        data-src={`${data.logo}/60`}
                        alt={data.name}
                        className="lazyload"
                    />
                </div>

                <div class="modal-body">
                    <h1>{`${data.nowprogram.title} Presented by ${data.name}`}</h1>
                    <span className="info">
                        Airdate:{getFormattedDate(data.nowprogram.starts)}{" "}
                        {constants.BULLETS} PG {constants.BULLETS}{" "}
                        {data.genres.join(constants.BULLETS)}
                    </span>
                    <p>{data.nowprogram.description}</p>
                </div>
                <div class="modal-footer">
                    <Button
                        className='watch'
                        svg="play"
                        inner={isBroadcasting ? "Watch Now" : `Watch Channel`}
                        onClick={isBroadcasting ? clicked : null}
                    />
                </div>
            </div>
        </div>
    ) : null;
};

export default EPGModal;
