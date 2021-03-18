import React from 'react';

import './Share.less';
import {constants} from '../../config';
import InlineSVG from '../InlineSVG';

export default function Share({title = '', className}) {

    function postSocial(network = 'facebook') {
        let wWidth = 500;
        let wHeight = 220;
        let wURL;
        const shareUrl = window.location.href;
        const handle = constants.TWITTER_HANDLE;
        if (network === 'twitter') {
            wURL = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${title}&via=${handle}`;
        } else {
            wHeight = 610;
            wURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        }
        const wLeft = (screen.width - wWidth) / 2;
        const wTop = (screen.height - wHeight) / 2;
        window.open(
            wURL,
            network,
            `left=${wLeft},top=${wTop},width=${wWidth},height=${wHeight},toolbar=0,location=0,status=0,
			menubar=0,scrollbars=0,resizable=0`,
        );
    }

    return (
        <span className={`share-tip${className ? ` ${className}` : ''}`}>
            <span className="share-tip-inner">
                <span className="share-tip-facebook" onClick={()=> postSocial('facebook')} title='Share to Facebook'>
                    <InlineSVG type="facebook"/>
                </span>
                <span className="share-tip-twitter" onClick={()=> postSocial('twitter')} title='Share to Twitter'>
                    <InlineSVG type="twitter"/>
                </span>
            </span>
        </span>
    );
}
