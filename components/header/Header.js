import React from "react";
import Router from "next/router";
import { useObserver } from "mobx-react-lite";

import { StoreContext } from "../../store";

import Logo from "./Logo";
import Nav from "../nav/Nav";
import NavLink from "../nav/NavLink";
import InlineSVG from "../InlineSVG";

import "./Header.less";
import ButtonList from "../buttonList/ButtonList";

export default function Header({}) {
    const store = React.useContext(StoreContext);

    const [open, setOpen] = React.useState(false);

    Router.events.on("routeChangeStart", () => {
        setOpen(false);
    });

    const main = [
        {
            id: "search",
            class: "search",
            type: "svg",
            inner: "Search",
            svg: "search",
            url: "/search/[[...searchQuery]]",
            as: "/search",
        },
        // { id: "home", inner: "Featured", url: "/", exact: true },
        {
            id: "channels",
            inner: "Live Channels",
            url: "/[[...slug]]",
            as: "/",
            exact: true,
        },
        {
            id: "ondemand",
            inner: "On Demand",
            url: "/movies",
            as: "/movies",
        },

        // {id: 'shows', inner: 'Shows', url: '/shows', as: '/shows'},
    ];

    const navAccount = [
        {
            id: "settings",
            class: "settings",
            type: "svg",
            inner: "Settings",
            svg: "settings",
            url: "/settings/[[...slug]]",
            as: "/settings",
        },
    ];

    const mainMobile = [
        {
            id: "channels",
            type: "svg",
            svg: "channels",
            inner: "Live Channels",
            url: "/[[...slug]]",
            as: "/",
            exact: true,
        },
        {
            id: "on-demand",
            type: "svg",
            svg: "movies",
            inner: "On Demand",
            url: "/movies",
            as: "/movies",
        },
        {
            id: "settings",
            type: "svg",
            inner: "Settings",
            svg: "settings",
            url: "/settings/[[...slug]]",
            as: "/settings",
        },
        // {id: 'shows', type:'svg', svg:'shows', inner: 'Shows', url: '/shows', as: '/shows'}
    ];

    const mainMobile2 = [
        {
            id: "account",
            inner: "My Account",
            url: "/account/[[...slug]]",
            as: "/account",
        },
    ];

    return useObserver(() => (
        <header>
            <Logo />
            {store.isBreakpoint ? (
                <NavLink href="/search/[[...searchQuery]]" as="/search">
                    <a title="Search" className="header-mobileSearch">
                        <InlineSVG type="search" />
                        <InlineSVG type="searchActive" />
                    </a>
                </NavLink>
            ) : (
                <>
                    <Nav
                        className="header-nav"
                        links={main}
                        activeBar={true}
                    ></Nav>
                    <NavLink
                        href="/settings/[[...slug]]"
                        as="/settings"
                        className="account"
                    >
                        <a title="Settings" className="account">
                            <InlineSVG type="settings" />
                            <InlineSVG type="settingsActive" />
                        </a>
                    </NavLink>
                </>
            )}
            {store.isBreakpoint ? (
                <>
                    <span
                        className={
                            open
                                ? "header-mobileBurger header-mobileBurger-open"
                                : "header-mobileBurger"
                        }
                        onClick={() => setOpen(!open)}
                    >
                        <span></span>
                    </span>
                    <span
                        className={
                            open
                                ? "header-navMobile header-navMobile-open"
                                : "header-navMobile"
                        }
                    >
                        <span className="header-navMobile-mask">
                            <span className="header-navMobile-inner">
                                <span className="header-navMobile-topLine"></span>
                                <Nav
                                    className="header-navMobile-main"
                                    links={mainMobile}
                                />
                            </span>
                        </span>
                    </span>
                </>
            ) : null}
        </header>
    ));
}
