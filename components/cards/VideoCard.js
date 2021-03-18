import React from 'react';
import Link from 'next/link';

import {constants} from '../../config';

import './Cards.less';
import {duration} from '../../helpers/utils/time';
import InlineSVG from '../InlineSVG';

export default function VideoCard(data) {

	//const videoPageActive = () => props.id === props.match.params.id;

    const handleClick = (e) => {
        data.onClick(e);
    }

	return (
		<span className="videoCard">
			<span className="cardOuter">
                <a className="card" onClick={handleClick}>
					<span className="card-image">
                        <span className="card-image-inner">
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
                            <span className="card-playButton">
                                <InlineSVG type="play"/>
                            </span>
                            {data.episode ? <span className="card-episode">Ep {data.episode}</span> : null}
                            <span className="card-duration">{duration(data.duration, true)}</span>
                        </span>
					</span>
					<span className="card-info">
						<span className="card-title">{data.title}</span>
						<span className="card-description">{data.description}</span>
					</span>
				</a>
			</span>
		</span>
	);
};
