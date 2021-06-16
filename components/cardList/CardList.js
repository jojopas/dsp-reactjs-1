import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';

import TitleCard from '../cards/TitleCard';
import PromoCard from '../cards/PromoCard';
import VideoCard from '../cards/VideoCard';
import ListHeader from './ListHeader';
import SlickArrow from './SlickArrow';
import './CardList.less';

export default function CardList({className, type, useHeader, data, ...props}) {
    let curIndex = 0;
    useHeader = (typeof useHeader !== 'undefined') ? useHeader : true;

    const displayType = ('category' in data) ? data.category.displayType : 'default';

    // Inital Slick Settings
    let slickSettings = {
        className: 'cardList cardList-titleDefault',
        dots: false,
        infinite: false,
        initialSlide: 0,
        speed: 400,
        slidesToShow: 6.5,
        slidesToScroll: 6,
        touchThreshold: 20,
        prevArrow: <SlickArrow />,
        nextArrow: <SlickArrow />,
        draggable: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5.5,
                    slidesToScroll: 5,
                    touchThreshold: 17,
                },
            },
            {
                breakpoint: 767,
                settings: {
                    arrows: false,
                    slidesToShow: 4.5,
                    slidesToScroll: 4,
                    touchThreshold: 14,
                    speed: 300,
                },
            },
            {
                breakpoint: 479,
                settings: {
                    arrows: false,
                    slidesToShow: 2.25,
                    slidesToScroll: 2,
                    touchThreshold: 7,
                    speed: 300,
                },
            },
        ],
    };

    let settingsOverrides = {};

    // Slick Overrides for featured display type
    if (type === 'title' && displayType === 'featured') {
        settingsOverrides = {
            className: 'cardList cardList-titleFeatured',
            slidesToShow: 5.5,
            slidesToScroll: 5,
            touchThreshold: 17,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4.5,
                        slidesToScroll: 4,
                        touchThreshold: 14,
                    },
                },
                {
                    breakpoint: 767,
                    settings: {
                        arrows: false,
                        slidesToShow: 3.5,
                        slidesToScroll: 1,
                        touchThreshold: 11,
                        speed: 300,
                    },
                },
                {
                    breakpoint: 479,
                    settings: {
                        arrows: false,
                        slidesToShow: 1.75,
                        slidesToScroll: 1,
                        touchThreshold: 5,
                        speed: 300,
                    },
                },
            ],
        };
    }

    if (type === 'promo') {
        settingsOverrides = {
            className: 'cardList cardList-promo',
            slidesToShow: 3.1,
            slidesToScroll: 3,
            touchThreshold: 9,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        arrows: false,
                        slidesToShow: 2.1,
                        slidesToScroll: 2,
                        touchThreshold: 6,
                    },
                },
                {
                    breakpoint: 479,
                    settings: {
                        arrows: false,
                        slidesToShow: 1.1,
                        slidesToScroll: 1,
                        touchThreshold: 5,
                        speed: 300,
                    },
                },
            ],
        };
    }

    if (type === 'promoSmall') {
        settingsOverrides = {
            className: 'cardList cardList-promoSmall',
            slidesToShow: 4.5,
            slidesToScroll: 4,
            touchThreshold: 14,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3.5,
                        slidesToScroll: 3,
                        touchThreshold: 11,
                    },
                },
                {
                    breakpoint: 767,
                    settings: {
                        arrows: false,
                        slidesToShow: 2.5,
                        slidesToScroll: 1,
                        touchThreshold: 8,
                        speed: 300,
                    },
                },
                {
                    breakpoint: 479,
                    settings: {
                        arrows: false,
                        slidesToShow: 1.5,
                        slidesToScroll: 1,
                        touchThreshold: 6,
                        speed: 300,
                    },
                },
            ],
        };
    }

    if (type === 'video') {
        settingsOverrides = {
            className: 'cardList cardList-video',
            slidesToShow: 4.3,
            slidesToScroll: 4,
            touchThreshold: 13,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3.3,
                        slidesToScroll: 3,
                        touchThreshold: 10,
                    },
                },
                {
                    breakpoint: 767,
                    settings: {
                        arrows: false,
                        slidesToShow: 2.3,
                        slidesToScroll: 2,
                        touchThreshold: 7,
                        speed: 400,
                    },
                },
                {
                    breakpoint: 479,
                    settings: {
                        arrows: false,
                        slidesToShow: 1.3,
                        slidesToScroll: 1,
                        touchThreshold: 4,
                        speed: 400,
                    },
                },
            ],
        };
    }

    Object.assign(slickSettings, settingsOverrides);

    const cards = data.cards.map((card) => (
        <div key={card.id}>
            {type === 'video' ?
                <VideoCard {...card} onClick={props.onClick ? () => props.onClick(card.id) : null}  />
            :
                (type === 'promo' || type === 'promoSmall') ?
                    <PromoCard {...card} />
                    :
                    <TitleCard {...card} />
            }
        </div>
    ));

    return (
        <div className={className ? className : ""}>
            {type !== "grid" ? (
                <>
                    {useHeader ? (
                        <ListHeader
                            label={data.category.name}
                            onClick={() => props?.onHeaderClick(data)}
                        />
                    ) : null}
                    <div className="listRow">
                        <Slider {...slickSettings}>{cards}</Slider>
                    </div>
                </>
            ) : (
                <div className="listGrid">{cards}</div>
            )}
        </div>
    );
}
