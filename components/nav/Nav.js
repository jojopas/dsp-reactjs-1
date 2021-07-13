import React from 'react';
import NavLink from './NavLink';

import InlineSVG from '../InlineSVG';
import {useRouter} from 'next/router';
import {pathToRegexp} from 'path-to-regexp';
import {sendToSegment} from '../../analytics';

const linkInner = (link) => {
    switch (link.type) {
        case 'svg':
            return <span className="svgPlaceholder"><InlineSVG type={link.svg} /><InlineSVG type={`${link.svg}Active`} /></span>;
        case 'img':
            return <img alt={link.inner} src={link.src} />;
        default:
            return link.inner;
    }
};

export default function Nav({className, style, links, activeBar}) {
    const [activeSlideIndex, setActiveSlideIndex] = React.useState();
    const allNavRefs = React.useRef(links.map(() => React.createRef()));
    const activeBarRef = React.useRef(null);

    const { asPath } = useRouter();

    React.useEffect(() => {
        if (activeBar) {
            const activeNavItem = allNavRefs.current[activeSlideIndex] && allNavRefs.current[activeSlideIndex].current;
            if (activeNavItem) {
                const active = pathToRegexp(links[activeSlideIndex].as || links[activeSlideIndex].url, [], {sensitive: true, end: !!links[activeSlideIndex].exact}).test(asPath);
                if (!active) {
                    setActiveSlideIndex(null);
                } else {
                    const {offsetLeft, offsetWidth} = activeNavItem;
                    activeBarRef.current.style.transform = `translateX(${offsetLeft}px)`;
                    activeBarRef.current.style.width = `${offsetWidth}px`;
                }
            } else {
                //activeBarRef.current.style.transform = '';
                activeBarRef.current.style.width = '0';
            }
        }
    }, [activeSlideIndex, asPath]);

    const detectActiveNavItem = (activeNavItemIndex) => {
        setActiveSlideIndex(activeNavItemIndex);
    };

    return (
        <>
            <nav className={className} style={style}>
                <ul>
                    {links.map((link, index) => link?(
                        <li ref={allNavRefs.current[index]} key={link.id} className={link.class}>
                            <NavLink href={link.url} as={link.as} passActive={detectActiveNavItem} navIndex={index} exact={(link.exact) ? link.exact : false}>
                                <a
                                    target={link.newWin ? '_blank' : null}
                                    rel={link.newWin ? 'noopener noreferrer' : null}
                                    data-title={link.type === 'svg' ? link.inner : null}
                                    title={link.type === 'svg' ? link.inner : null}
                                    onClick={link.tracking ? () => {sendToSegment('track', link.tracking);} : null}
                                >
                                {linkInner(link)}
                                </a>
                            </NavLink>
                        </li>
                    ):<br></br>)}
                </ul>
                {activeBar ? <span ref={activeBarRef} className="activeBar" /> : null}
            </nav>
        </>
    )
}
