import React from "react";

import "./Button.less";
import NavLink from "../nav/NavLink";
import InlineSVG from "../InlineSVG";

export default function Button({
    url,
    as,
    className,
    inner,
    style,
    onClick,
    svg,
    ...props
}) {
    console.log("Button url", url);
    React.useEffect(() => {}, []);

    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        }
    };

    return url ? (
        <NavLink href={url} as={as}>
            <>
                {svg ? <InlineSVG type={svg} /> : null}
                <a
                    className={`button${className ? ` ${className}` : ""}`}
                    style={style}
                    href={url}
                    onClick={onClick ? handleClick : null}
                >
                    {inner}
                </a>
            </>
        </NavLink>
    ) : (
        <a
            className={`button${className ? ` ${className}` : ""}${
                props.current ? " button-current" : ""
            }`}
            onClick={onClick ? handleClick : null}
            style={style}
        >
            <>
                {svg ? <InlineSVG type={svg} /> : null}
                {inner}
                {props.type === "season" && props.current ? (
                    <span>{props.episodes}</span>
                ) : null}
            </>
        </a>
    );
}
