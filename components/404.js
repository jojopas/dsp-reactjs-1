import React from 'react';

import './404.less';
import Button from './button/Button';
import {constants} from '../config';
import {sendToSegment} from '../analytics';

export default function Error404() {
    return (
        <div className="not-found-container">
            <div className="not-found-inner">
            <h1>{constants.MSG_404}</h1>
            <Button
                url="/"
                as="/"
                inner={constants.HOME_404}
                className="button-current"
                onClick={()=>{sendToSegment('track', { event:'Error Message' });}}/>
            </div>
        </div>
    )
}
