import Button from "../button/Button";
import { constants } from "../../config";
import "./FeaturedView.less";

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
                ></span>
                <div className="featured-wrapper-container">
                    <div className="info">
                        <div className="info-container">
                            <h1>{data.title}</h1>
                            <p>{data.description}</p>
                            <div className="cta">
                                <Button
                                    className="cta-button"
                                    inner={constants.WATCH_NOW}
                                    url={`/on-demand/${data.type || "movies"}/${
                                        data.slug
                                    }`}
                                    as={`/on-demand/${data.type || "movies"}/${
                                        data.slug
                                    }`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="image">
                        <img
                            src={`${data.image || data.poster}`}
                            alt=""
                            className="lazyload"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedView;
