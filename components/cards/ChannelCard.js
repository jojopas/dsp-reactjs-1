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

    // console.log("ChannelCard", data, routerSlug);
    return store.isBreakpoint ? (
        <div className="channelCard">
            <Link href={routerSlug?.slug} as={sanitiseSlug(data?.slug)}>
                <a className="cardChannel">
                    <img
                        src={constants.NOT_FOUND_SRC}
                        data-src={data.channel.poster + "/180/90"}
                        alt={data.program_title}
                        className="lazyload"
                    />
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
                        <img
                            src={constants.NOT_FOUND_SRC}
                            data-src={data.channel.logo}
                            alt={data.program_title}
                            className="lazyload"
                            style={{
                                borderRadius: 0,
                                borderTopLeftRadius: 7,
                                borderTopRightRadius: 7,
                            }}
                        />

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
