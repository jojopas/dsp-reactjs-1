import React from "react";
import { useRouter } from "next/router";

import "./GenreSelector.less";
import InlineSVG from "../InlineSVG";
import { titleCase } from "../../helpers/utils/strings";

export default function GenreSelector({
    className,
    style,
    links,
    type,
    changeListener,
    hoveredListener,
}) {
    if (!links) {
        return <></>;
    }
    const router = useRouter();
    const [currentGenre, setCurrentGenre] = React.useState(null);
    const [isHovered, setIsHovered] = React.useState(false);

    let currName = type === "live" ? "All Channels" : "All Genres";
    if (type !== "live" && router.asPath !== `/${type}`) {
        const currLink = links.find((el) => el.as === router.asPath);
        currName = `${currLink?.inner} ${titleCase(type)}`;
    }

    const [currentName, setCurrentName] = React.useState(currName);

    React.useEffect(() => {
        if (type === "live") {
        } else {
            setCurrentGenre(router.asPath);

            if (router.asPath !== `/${type}`) {
                const currLink = links.find((el) => el.as === router.asPath);
                setCurrentName(`${currLink?.inner || ''} ${titleCase(type)}`.trim());
            }
        }
    }, [currentGenre, router.asPath]);

    React.useEffect(() => {
        if (hoveredListener) {
            hoveredListener(isHovered);
        }
    }, [isHovered]);

    const handleChange = (e) => {
        e.preventDefault();
        if (type === "live") {
            setCurrentName(e.target.options[e.target.selectedIndex].text);
            setCurrentGenre(e.target.value);
            changeListener(
                e.target.value === "All Genres" ? "" : e.target.value
            );
            setIsHovered(false);
        } else {
            let url = `/${type}`;
            if (e.target.selectedIndex > 0) {
                url = `${url}/genre/[...slug]`;
            }
            router.push(url, e.target.value);
        }
    };

    return (
        <span
            className={
                className ? `genreSelector ${className}` : "genreSelector"
            }
            style={style}
        >
            <select
                onChange={handleChange}
                value={
                    type === "live"
                        ? currentGenre || ""
                        : currentGenre || `/${type}`
                }
                
            >
                <option
                    key="all-genres"
                    value={type === "live" ? "" : `/${type}`}
                >
                    {(type === "live"
                        ? "All Channels"
                        : "All Genres"
                    ).toUpperCase()}
                </option>
                {links.map((link) => (
                    <option key={link.id} value={link.as}>
                        {link.inner.toUpperCase()}
                    </option>
                ))}
            </select>
            <span
                className={`genreSelector-selected${
                    isHovered ? " genreSelector-hover" : ""
                }`}
            >
                {currentName}
                <span className="genreSelector-arrow">
                    <InlineSVG type="down-arrow" />
                </span>
            </span>
        </span>
    );
}
