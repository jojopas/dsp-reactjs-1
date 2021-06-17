import React from "react";
import Link from "next/link";

import { constants } from "../../config";

import "./Cards.less";
import ProgressBar from "./ProgressBar";
import Locked from "./Locked";

export default function TitleCard(data) {
    return (
        <span className="titleCard">
            <span className="cardOuter">
                <Link
                    href={
                        data.type === "channels"
                            ? `/${data.type}/[[...slug]]`
                            : `/${data.type}/[...slug]`
                    }
                    as={`/${data.type}/${data.slug}`}
                >
                    <a className="card">
                        <>
                            {" "}
                            {data.image ? (
                                <img
                                    src={constants.NOT_FOUND_SRC}
                                    data-sizes="auto"
                                    data-srcset={`${data.image}/100 100w,
                                ${data.image}/200 200w,
                                ${data.image}/300 300w,
                                ${data.image}/400 400w`}
                                    data-src={`${data.image}/200`}
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
                            {data.locked ? <Locked /> : null}
                            <ProgressBar value={Math.random()} />
                        </>
                    </a>
                </Link>
            </span>
        </span>
    );
}
