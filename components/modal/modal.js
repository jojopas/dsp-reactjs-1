import "./modal.less";
import { constants } from "../../config";
import InliveSVG from "../InlineSVG";
import InlineSVG from "../InlineSVG";

const Modal = ({ data, resetFn, onClick }) => {
    const timeDuration = (seconds) => {
        const date = new Date(0);
        date.setSeconds(seconds);
        // console.log(date.toTimeString());
        const timeDuration = date.toTimeString().substr(0, 5);
        return timeDuration;
    };

    const timeLeftDuration = (seconds) => {
        const date = new Date(0);
        date.setUTCSeconds(seconds);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const timeDuration = date.toISOString().substr(11, 5);
        return hours > 0 ? `${hours}h ${minutes}m ` : `${minutes}m `;
    };
    const now = new Date();
    const nowTime = now.getTime() / 1000;
    const isBroadcasting =
        nowTime >= data?.nowprogram?.starts &&
        nowTime <= data?.nowprogram?.ends;

    return data ? (
        <div id="myModal" className="modal">
            <div className="modal-content">
                <div className="close" onClick={() => resetFn()}>
                    <InlineSVG type="close" />
                </div>
                <div className="modal-header">
                    <div>
                        <div className="modal-time">
                            {`${timeDuration(
                                data.nowprogram.starts
                            )} - ${timeDuration(data.nowprogram.ends)}`}
                            {" . "}
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
                        data-srcset={`${data.logo}/30`}
                        data-src={`${data.logo}/30`}
                        alt={data.name}
                        className="lazyload"
                    />
                </div>

                <div class="modal-body">
                    <h1>{`${data.nowprogram.title} Presented by ${data.name}`}</h1>
                    <p>{data.nowprogram.description}</p>
                </div>
                <div
                    class="modal-footer"
                    onClick={() => (isBroadcasting ? onClick(data) : null)}
                >
                    <div
                        className={`watch ${isBroadcasting ? "" : "inActive"}`}
                    >
                        <InliveSVG type="play" />
                        {isBroadcasting
                            ? "Watch Now"
                            : `Watch after ${timeLeftDuration(
                                  data.nowprogram.starts - nowTime
                              )}`}
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};

export default Modal;
