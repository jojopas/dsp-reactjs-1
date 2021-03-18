import React from 'react';

import './ListHeader.less';

export default function ListHeader({className, style, label}) {
   return(
        <h2 className={`listHeader${(className) ? ` ${className}` : ''}`} style={style}>{label}</h2>
   )
}


