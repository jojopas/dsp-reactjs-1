import React from 'react';

import './PDPBg.less';
import {constants} from '../../config';

export default function PDPBg({pdp}) {
    return (
        <span className="pdp-bg">
            <img
                src={constants.NOT_FOUND_SRC}
                data-src={pdp.wallpaper ? `${pdp.wallpaper}/500` : ""}
                alt={pdp.title}
                className="lazyload"
            />
        </span>
    );
}
