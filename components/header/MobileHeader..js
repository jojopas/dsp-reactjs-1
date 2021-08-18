import React from "react";
import Router from "next/router";
import { useObserver } from "mobx-react-lite";

import { StoreContext } from "../../store";
import InlineSVG from "../InlineSVG";
import "./MobileHeader.less";

export default function MobileHeader() {
    const store = React.useContext(StoreContext);

    if (!store.isBreakpoint) {
        return null;
    }
    const isOnDemand = Router.router.route.includes("/on-demand");
    // console.log("Channels", isOnDemand, Router.router.route);

    return (
        <span className="mobileHeader">
            <a href="/">
                <div className="listHeader">
                    <InlineSVG
                        type={isOnDemand ? "channels" : "channelsActive"}
                    />
                    <h1>Live Channels</h1>
                </div>
            </a>
            <a href="/on-demand">
                <div className="listHeader">
                    <InlineSVG
                        type={isOnDemand ? "on-demandActive" : "on-demand"}
                    />
                    <h1>On Demand</h1>
                </div>
            </a>
        </span>
    );
}
