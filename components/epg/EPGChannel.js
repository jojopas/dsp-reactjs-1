import { constants } from "../../config";
import InlineSVG from "../InlineSVG";

const ChannelLogo = ({ channel, isLocked, isShowing, width }) => {
    const channelStyle = {
        width: width,
        // background: `url(${channel.logo}/${width - 10})`,
    };
    if (isShowing) {
        channelStyle.backgroundColor = "#fbcc35";
    }

    return (
        <div
            className={"channel-info"}
            style={channelStyle}
            title={channel.name}
        >
            {/* <div className="channel-info--image" title={channel.name}> */}
            {channel.logo ? (
                <img
                    className="channel-info--image"
                    src={constants.NOT_FOUND_SRC}
                    data-sizes="auto"
                    data-srcset={`${channel.logo}/${width - 30}/${width - 30}`}
                    data-src={`${channel.logo}/${width - 30}/${width - 30}`}
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
            {isLocked && (
                <div className="channel-info--locked">
                    <InlineSVG type="lock" />
                </div>
            )}
        </div>
    );
};
export default ChannelLogo;
