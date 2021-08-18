import React from "react";
import InlineSVG from "../InlineSVG";
import "./ScrollLeftRight.less";

const status = {
    disableLeft: 0,
    disableRight: 1,
    disableNone:2,
}

export default function ScrollLeftRight({ onScrollLeft }) {
    const [disable, setDisable] = React.useState(status.disableNone);
    return (
        <div className="scroll">
            <div
                className={`scrollLeftRight ${
                    disable === status.disableLeft ? "noHover" : ""
                }`}
                onClick={() => onScrollLeft(true, setDisable)}
            >
                <InlineSVG type="left" />
            </div>
            <div
                className={`scrollLeftRight ${
                    disable === status.disableRight ? "noHover" : ""
                }`}
                onClick={() => onScrollLeft(false, setDisable)}
            >
                <InlineSVG type="right" />
            </div>
        </div>
    );
}
