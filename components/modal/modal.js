import "./modal.less";
import { constants } from "../../config";
import InliveSVG from "../InlineSVG";

const Modal = ({ data, resetFn }) => {
    console.log("IsShow", data);
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
    return data ? (
        <div id="myModal" className="modal" onClick={() => resetFn()}>
            <div className="modal-content">
                <span className="close">&times;</span>
                <div className="modal-header">
                    <div>
                        <div className="modal-time">
                            {`${timeDuration(
                                data.nowprogram.starts
                            )} - ${timeDuration(data.nowprogram.ends)}`}
                            {" . "}
                            <span className="modal-time-left">
                                {timeLeftDuration(
                                    data.nowprogram.ends - nowTime
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
                <div class="modal-footer">
                    <div className="watch">
                        <InliveSVG type='lock'/>
                        Watch Now
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};

export default Modal;
