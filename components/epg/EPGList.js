import React from 'react';

import {StoreContext} from '../../store';
import EPGCurrent from './EPGCurrent';
import EPGRow from './EPGRow';
import './EPGList.less';
import PromoCard from "../cards/PromoCard";
import {useObserver} from 'mobx-react-lite';
import {getBrowserHeight, getBrowserWidth} from '../../helpers/utils/browser';
import {constants} from '../../config';
import {slugify} from '../../helpers/utils/strings';
import GenreSelector from '../nav/GenreSelector';


export default function EPGList({data, changeCurrentSlug, currentSlug, className, genres, genreHoveredListener, promos}) {
    const store = React.useContext(StoreContext);
    const [currentIndex, setCurrentIndex] = React.useState(null);
    const [rowList, setRowList] = React.useState([]);
    const epgListOuter = React.useRef(null);
    const [currentGenre, setCurrentGenre] = React.useState(null);

    const genreNav = genres.map((genre) => {
        return  {id: genre, inner: genre, as: genre}
    });

    /*function filterList() {
        const channelList = data.filter((row, index) => {
            if(row.slug === currentSlug){
                setCurrentIndex(index);
                return false;
            }
            return (!currentGenre || currentGenre === '' || (row.genres && row.genres.includes(currentGenre)));
        });

        // working in promos into the channels
        let promosStep = 0;
        const promosLength = promos && promos.length;
        const promosSpacing = promos.length === 1 ? Math.ceiling(channelList.length / (promos.length + 1)) : Math.floor(channelList.length / promos.length);
            let allChannels = channelList && channelList.map((c, index) => {
                if ((index + 1) % promosSpacing === 0) {
                    if (promosStep < promosLength) {
                        const returnPromo = { type: 'promo', ...promos[promosStep] };
                        promosStep = promosStep + 1;
                        return [c, returnPromo];
                    }
                }
                return c;
            });
        return allChannels && [].concat.apply([], allChannels);
    }*/

    function filterList() {
        const filteredResult = data.filter((row, index) => {
            if(row.slug === currentSlug){
                setCurrentIndex(index);
                return false;
            }
            return (!currentGenre || currentGenre === '' || (row.genres && row.genres.includes(currentGenre)));
        });

        // working in promos into the channels
        let promosStep = 0;
        const promosLength = promos && promos.length;
        const allChannels = filteredResult && filteredResult.map((c, index) => {
            if ((index > 0 && index % (constants.EPG_PROMO_CNT-1) === 0) || (index === filteredResult.length - 1 && promosStep === 0)) {
                if (promosStep < promosLength) {
                    const returnPromo = { type: 'promo', ...promos[promosStep] };
                    promosStep = promosStep + 1;
                    return [c, returnPromo];
                }
            }
            return c;
        });
        return allChannels && [].concat.apply([], allChannels);
    }

    React.useEffect(() => {
        if (data) {
            setRowList(filterList());
        }
    }, [data, currentSlug]);

    React.useEffect(() => {
        if (data) {
            setRowList(filterList());
        }
    }, [currentGenre]);


    const epgCurrentContainer = React.useRef(null);
    const epgListScrollRef = React.useRef(null);
    let isScrollUpdating = false;
    let halfHeight;
    let halfHeightEl;
    let epgCurrentHeight;
    let disableHoverTimer;
    const onScrollUpdate = () => {
        const newHalfHeight = halfHeightEl.getBoundingClientRect().height;
        if(newHalfHeight !== halfHeight){
            halfHeight = newHalfHeight;
            epgCurrentContainer.current.style.top = `${Math.ceil(halfHeight)}px`;
        }

        if(!store.isBreakpoint && epgListScrollRef && epgListScrollRef.current){
            const epgListScrollTop = epgListScrollRef.current.getBoundingClientRect().top;
            const topPos = `${Math.ceil(halfHeight - epgListScrollTop + epgCurrentHeight)}px`;
            //epgListScrollRef.current.style.clipPath = `polygon(0 ${topPos}, 100% ${topPos}, 100% 100%, 0% 100%)`;
            epgListScrollRef.current.style.clipPath = `inset(${topPos} 0 0)`;
        }
        isScrollUpdating = false;
    };

    const requestScrollUpdate = () => {
        if(!isScrollUpdating){
            requestAnimationFrame(onScrollUpdate);
            isScrollUpdating = true;
        }
    };


    const onScroll = () => {
        clearTimeout(disableHoverTimer);
        if(!epgListScrollRef.current.classList.contains('disableHover')) {
            epgListScrollRef.current.classList.add('disableHover');
        }
        requestScrollUpdate();
        disableHoverTimer = setTimeout(() => {
            if(epgListScrollRef && epgListScrollRef.current) {
                epgListScrollRef.current.classList.remove('disableHover');
            }
        }, 500);
    };

    React.useEffect(() => {
        halfHeightEl = document.querySelector('.player-halfHeight');
        epgCurrentHeight = document.querySelector('.epgCurrent').getBoundingClientRect().height;
        window.addEventListener('scroll', onScroll, false);

        return () => {
            clearTimeout(disableHoverTimer);
            window.removeEventListener('scroll', onScroll, false);
        }
    }, [data]);

    const adjustTopOfEpg = () => {
        if(epgListOuter && epgListOuter.current) {
            const epgTop = epgListOuter.current.getBoundingClientRect().top;
            if (epgTop > 0) {
                clearInterval(interval);
                const browserHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
                const epgCurrentHeight = document.querySelector('.epgCurrent').getBoundingClientRect().height;
                let heightNeeded = epgCurrentHeight + 60;
                let shouldMove = false;
                //console.log('browser height', browserHeight);
                //console.log('epg top', epgTop);
                if (browserHeight < epgTop) {
                    heightNeeded = (epgTop - browserHeight) + heightNeeded;
                    shouldMove = true;
                    //console.log('height a');
                } else if ((browserHeight - epgTop) < heightNeeded) {
                    shouldMove = true;
                    //console.log('height b');
                }
                epgListOuter.current.style.marginTop = shouldMove ? `-${heightNeeded}px` : '-160px';
            }
        }
    }

    let interval;
    React.useEffect(() => {
        if(window) {
            window.addEventListener('resize', adjustTopOfEpg, false);
            interval = setInterval(() => {
                if (window && store.playerInstance && store.playerInstance.vjs && epgListOuter && epgListOuter.current) {
                    adjustTopOfEpg();
                    onScroll();
                }
            }, 16);
        }
        return () => {
            clearInterval(interval);
            window.addEventListener('resize', adjustTopOfEpg, false);
        }

    }, []);

    const epgCurrent = (
        <div className="epgList-current" ref={epgCurrentContainer}>
            <EPGCurrent
                key="epg-current"
                slug={data[currentIndex] ? data[currentIndex].slug : ''}
                logo={data[currentIndex] ? data[currentIndex].logo : ''}
                name={data[currentIndex] ? data[currentIndex].name : ''}
                program={data[currentIndex] ? data[currentIndex].program : {}}
            />
        </div>
    );

    const epgScroll = (
        <div className="epgList-scroll" ref={epgListScrollRef}>
            <GenreSelector
                type="live"
                links={genreNav}
                changeListener={(genre) => setCurrentGenre(genre)}
                hoveredListener={(isHovered) => genreHoveredListener(isHovered)}
            />
            <ul>
                {rowList.map((row, index) => {
                    if (row.type === 'promo') {
                        return (
                            <li key={`epg-row-${index}`}>
                                <PromoCard {...row} changeCurrentSlug={changeCurrentSlug} epg={true} />
                            </li>
                        )
                    }
                    return (
                        <EPGRow
                            key={`epg-row-${index}`}
                            slug={row.slug}
                            logo={row.logo}
                            name={row.name}
                            program={row.program}
                            changeCurrentSlug={changeCurrentSlug}
                        />
                    )
                })}
            </ul>
        </div>
    );

    return useObserver(() => (
        <>
            { store.isBreakpoint ? (
                <>
                    {epgCurrent}
                    <div className="epgList">
                        <div className="epgList-inner">
                            {epgScroll}
                        </div>
                    </div>
                </>
            ) : (
                <div ref={epgListOuter} className={`epgList${className ? ` ${className}` : ''}`}>
                    <div className="epgList-inner">
                        {epgCurrent}
                        {epgScroll}
                    </div>
                </div>
            )}
        </>
    ));
}
