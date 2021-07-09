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
    const isChannel = Router.router.route.includes("/channels");
    console.log('Channels', isChannel);

    return (
        <div className="mobileHeader">
            <div className="listHeader">
                <InlineSVG type={isChannel ? "channelsActive" : "channels"} />
                <h1>Live Channels</h1>
            </div>
            <div className="listHeader">
                <InlineSVG type={isChannel ? "on-demand" : "on-demandActive"} />
                <h1>On Demand</h1>
            </div>
        </div>
    );
}
