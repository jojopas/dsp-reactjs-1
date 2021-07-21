import React from "react";
import Link from "next/link";

import "./Cards.less";
import { constants } from "../../config";

export default function ChannelCard(data) {
    const deepLinks = [
        { prefix: "/channels", slug: "/channels/[[...slug]]" },
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

    const epgTest = () => {
        if (data.changeCurrentSlug && routerSlug.prefix === "/channels") {
            return data?.slug.substring(data?.slug.lastIndexOf("/") + 1);
        }
        return false;
    };

    console.log("ChannelCard", data);
    return (
        <span className="promoCard ">
            <span className="cardOuter channelCard" >
                <Link href={routerSlug?.slug} as={data?.slug}>
                    <a className="cardChannel">
                        <img
                            src={constants.NOT_FOUND_SRC}
                            data-src={data.channel.logo}
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
            </span>
        </span>
    );
}
