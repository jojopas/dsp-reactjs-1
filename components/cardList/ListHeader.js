import React from "react";
import InlineSVG from "../InlineSVG";

import "./ListHeader.less";

export default function ListHeader({ className, style, label,showArrow=true, onClick }) {
    return (
        <div className="listHeaders" onClick={onClick}>
            <h2
                className={`listHeader${className ? ` ${className}` : ""}`}
                style={style}
            >
                {label.toUpperCase()}
            </h2>
            {showArrow && (
                <div className="listHeaderIcon">
                    <InlineSVG type="arrow" />
                </div>
            )}
        </div>
    );
}
