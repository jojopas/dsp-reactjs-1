import React from 'react';

import NavLink from '../nav/NavLink';
import {constants} from '../../config';

export default function EPGRow ({ slug, logo, name, program, changeCurrentSlug }) {
    const [rowLogo, setRowLogo] = React.useState(logo || constants.NOT_FOUND_SRC);
    React.useEffect(() => {
        if (logo) {
            setRowLogo(logo);
        } else {
            setRowLogo(constants.NOT_FOUND_SRC);
        }
    }, [logo]);

    return (
		<li>
            <a className="epgRow" onClick={() => changeCurrentSlug(slug)}>
                <span className="epgRow-inner">
                    <span className="epgRow-channel">
                        {rowLogo ? (
                            <img
                                src={constants.NOT_FOUND_SRC}
                                data-sizes="auto"
                                data-srcset={`${rowLogo}/200 100w,
                                ${rowLogo}/300 200w`}
                                data-src={`${rowLogo}/200`}
                                alt={name}
                                className="lazyload"
                            />
                        ) : (
                            <img
                                src={constants.NOT_FOUND_SRC}
                                alt={name}
                                className="lazyloaded"
                            />
                        )}
                    </span>
                    <span className="epgRow-onNow">
                        <span className="epgRow-title">{program[0].title}</span>
                        <span className="epgRow-desc">{program[0].description}</span>
                    </span>
                    {program[1] ? (
                     <span className="epgRow-next">
                        <span className="epgRow-title">{program[1].title}</span>
                        <span className="epgRow-desc">{program[1].description}</span>
                     </span>
                    ) : null}
                </span>
            </a>
		</li>
	);
}
