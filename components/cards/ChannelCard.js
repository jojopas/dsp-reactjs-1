import React from "react";
import Link from "next/link";

import "./Cards.less";
import { constants } from "../../config";
import { StoreContext } from "../../store";

export default function ChannelCard(data) {
    const store = React.useContext(StoreContext);

    const deepLinks = [
        { prefix: "channel", slug: "/channels/[[...slug]]" },
        { prefix: "/movies/genre/", slug: "/movies/genre/[...slug]" },
        { prefix: "/movies/", slug: "/movies/[...slug]" },
        { prefix: "/movies", slug: "/movies" },
        { prefix: "/shows/genre/", slug: "/shows/genre/[...slug]" },
        { prefix: "/shows/", slug: "/shows/[...slug]" },
        { prefix: "/shows", slug: "/shows" },
        { prefix: "/search", slug: "/[[...searchQuery]]" },
        { prefix: "/account", slug: "/account/[[...slug]]" },
        { prefix: "/about", slug: "/about/[[...slug]]" },
        { prefix: "/my-mix", slug: "/my-mix/[...slug]" },
        { prefix: "/", slug: "/" },
    ];

    const routerSlug = deepLinks.find((link) =>
        data?.slug?.includes(link.prefix)
    );

    const sanitiseSlug = (slug) => {
        if (slug[0] !== "/") {
            const last = slug.split("/");
            return "/channels/" + last[1];
        }
        return slug;
    };

    const SearchImage = ({ isMobile }) => {
        // const date = new Date();
        // const nowTime = date.getTime() / 1000;
        // const isLive = data.starts_at <= nowTime && data.ends_at > nowTime;
        const style = !isMobile
            ? {
                  borderRadius: 0,
                  borderTopLeftRadius: 7,
                  borderTopRightRadius: 7,
              }
            : null;
        return (
            <div className="image">
                <img
                    // src={constants.NOT_FOUND_SRC}
                    data-src={`${data.image || data.channel.spotlight_poster}${
                        isMobile ? "/180/90" : ""
                    }`}
                    alt={data.program_title}
                    className="lazyload"
                    style={style}
                />
                <div
                    className="logo"
                    style={{
                        background: `linear-gradient(
            to bottom left,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0)  40%,
            rgba(0, 0, 0, 0) 100%   
        s)`,
                    }}
                >
                    <div
                        className="logo-image"
                        style={{
                            background: `
        url("${data.channel.logo}/50") no-repeat`,
                        }}
                    ></div>
                </div>
                {/* {isLive && <div className="live">LIVE</div>} */}
            </div>
        );
    };

    // console.log("ChannelCard", data, routerSlug);
    return store.isBreakpoint ? (
        <div className="channelCard">
            <Link href={routerSlug?.slug} as={sanitiseSlug(data?.slug)}>
                <a className="cardChannel">
                    <SearchImage isMobile={true} />

                    <div className="title">
                        {data.program_title ? (
                            <span>
                                <span>{data.program_title}</span>
                            </span>
                        ) : null}
                    </div>
                </a>
            </Link>
        </div>
    ) : (
        <span className="promoCard ">
            <span className="cardOuter" style={{ paddingBottom: "66.25%" }}>
                <Link href={routerSlug?.slug} as={sanitiseSlug(data?.slug)}>
                    <a className="cardChannel" style={{ paddingBottom: 50 }}>
                        <SearchImage isMobile={false} />

                        <div className="title">
                            {data.program_title ? (
                                <span>
                                    <span>{data.program_title}</span>
                                </span>
                            ) : null}
                        </div>
                    </a>
                </Link>
            </span>
        </span>
    );
}
