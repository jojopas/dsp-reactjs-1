import { constants } from "../../config";
import InlineSVG from "../InlineSVG";

const ChannelLogo = ({
    channel,
    isLocked,
    isShowing,
    width,
    onClick,
    index,
    id,
}) => {
    const channelStyle = {
        width: width,
        // background: `url(${channel.logo}/${width - 10})`,
    };
    // if (isShowing) {
    //     channelStyle.backgroundColor = "#fbcc35";
    //     channelStyle.fill = "#122d42";
    // }

    const imageDiff = 70;
    return (
        <div
            className={`channel-info ${isShowing? 'active': ''}`}
            style={channelStyle}
            title={channel.name}
            onClick={onClick}
            key={id}
        >
            {channel.logo ? (
                <img
                    className="channel-info--image"
                    data-sizes="auto"
                    sizes={`${width - imageDiff}px`}
                    data-srcset={`${channel.logo}/${imageDiff}/${imageDiff}`}
                    data-src={`${channel.logo}/${width - imageDiff}/${
                        width - imageDiff
                    }`}
                    alt={channel.name}
                    className="lazyload"
                />
            ) : (
                <img
                    className="channel-info--image"
                    src={constants.NOT_FOUND_SRC}
                    alt={channel.name}
                    className="lazyloaded"
                />
            )}
            {/* {isLocked && (
                <div className="channel-info--locked">
                    <InlineSVG type="lock" />
                </div>
            )} */}
        </div>
    );
};

export default ChannelLogo;
