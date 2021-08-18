import React from 'react';

import NavLink from '../nav/NavLink';
import InlineSVG from '../InlineSVG';

export default function Logo() {
    return (
        <div className="logo">
            <NavLink href="/" as="/" exact={true}><a><InlineSVG type="logo" /></a></NavLink>
        </div>
    )
}
