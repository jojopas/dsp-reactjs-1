import InlineSVG from "../InlineSVG";
import "./ScrollLeftRight.less";

export default function ScrollLeftRight({ onScrollLeft }) {
    return (
        <div className="scroll">
            <div className="scrollLeftRight" onClick={() => onScrollLeft(true)}>
                <InlineSVG type="left" />
            </div>
            <div className="scrollLeftRight" onClick={() => onScrollLeft(false)}>
                <InlineSVG type="right" />
            </div>
        </div>
    );
}
