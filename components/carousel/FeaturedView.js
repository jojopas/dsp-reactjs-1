import Button from "../button/Button";
import NavLink from "../nav/NavLink";
import { constants } from "../../config";
import "./FeaturedView.less";
import React from 'react';

const FeaturedView = ({ data, width, index, isMobile }) => {
    // const backgroundStyle = ["linear-gradient"].map(
    //     (browser) =>
    //         `${browser}(to bottom, rgba(13, 38, 56, 0) 0%, rgba(13, 38, 56, 0) 39%, rgba(13, 38, 56, 1) 100%), ${browser}(to left, rgba(13, 38, 56, 0) 0%, rgba(13, 38, 56, 0) 39%, rgba(13, 38, 56, 1) 100%), url("${data.image}/${width}/600?blur=90") no-repeat cover`
    // );

    if (index == 0) {
        // console.log("FeaturedCarousel", backgroundStyle);
    }
    return (
        <div className="featured" title={data.title}>
            <div className="featured-wrapper">
                <span
                    className="featured-wrapper-bg"
                    style={{
                        background: `${isMobile?'':`linear-gradient(
                            to bottom,
                            rgba(13, 38, 56, 0) 0%,
                            rgba(13, 38, 56, 0) 60%,
                            rgba(13, 38, 56, 1) 90%,
                            rgba(13, 38, 56, 1) 100%),
                        linear-gradient(
                            to right,
                            rgba(13, 38, 56, 1) 0%,
                            rgba(13, 38, 56, 1) 20%,
                            rgba(13, 38, 56, 0) 70%,
                            rgba(13, 38, 56, 0) 100%)`},
                        url("${
                            data.image || data.wallpaper || data.poster
                        }/${width}/600") no-repeat center center`,
                    }}
                />
                <div className="featured-wrapper-container">
                    <div className="info">
                        <div className="info-container">
                            <h1>{data.title}</h1>
                            <p>{data.description}</p>
                            <div className="cta">
                                <NavLink
                                    href={`/on-demand/${data.type || "movies"}/[...slug]`}
                                    as={`/on-demand/${data.type || "movies"}/${data.slug}`}
                                ><a className="button cta-button">{constants.WATCH_NOW}</a></NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="image">
                        {data.image || data.poster ? (
                            <img
                                src={constants.NOT_FOUND_SRC}
                                data-sizes="auto"
                                data-srcset={`${data.image || data.poster}/200 200w,
                                ${data.image || data.poster}/300 300w,
                                ${data.image || data.poster}/400 400w,
                                ${data.image || data.poster}/600 600w`}
                                data-src={`${data.image || data.poster}/200`}
                                alt={data.title}
                                className="lazyload"
                            />
                        ) : (
                            <img
                                src={constants.NOT_FOUND_SRC}
                                alt={data.title}
                                className="lazyloaded"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedView;
