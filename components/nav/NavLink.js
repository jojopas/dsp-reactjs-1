import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { pathToRegexp } from "path-to-regexp";

export default function NavLink({
    href,
    as,
    exact,
    children,
    passActive,
    navIndex,
    shallow,
    scroll,
    ...props
}) {
    const { asPath } = useRouter();
    const [isActive, setIsActive] = React.useState(false);
    React.useEffect(() => {
        if (!href.includes("http")) {
            let active = Array.isArray(as)
                ? as.reduce((isAs, asItems, index) => {
                      const thisAsItem = pathToRegexp(asItems, [], {
                          sensitive: true,
                          end: !!exact[index],
                      }).test(asPath);
                      return isAs || thisAsItem;
                  }, false)
                : pathToRegexp(as || href, [], {
                      sensitive: true,
                      end: !!exact,
                  }).test(asPath);
            setIsActive(active);
            if (passActive && active) {
                passActive(navIndex);
            }
        }
    }, [isActive, asPath]);

    const child = React.Children.only(children);
    const className = (
        (child?.props?.className || "") +
        " " +
        (isActive ? "active" : "")
    ).trim();

    return (
        <Link
            href={href}
            as={Array.isArray(as) ? as[0] : as}
            {...props}
            shallow={typeof shallow === "boolean" ? shallow : false}
            scroll={typeof scroll === "boolean" ? scroll : true}
        >
            {React.cloneElement(child, { className })}
        </Link>
    );
}
