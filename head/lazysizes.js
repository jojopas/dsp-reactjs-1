import React from 'react';

import {constants} from '../config';

export default function LazySizes() {
    return (
        <>
            {/* Lazy Sizes Config */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                     const NOTFOUNDSRC = '${constants.NOT_FOUND_SRC}';
                     document.addEventListener(
                      'error',
                      (e) => {
                       // test whether error comes from an image + make sure that 404.png is not the cause of the error
                       if (e.target.nodeName.toLowerCase() === 'img' && e.target.getAttribute('src') !== NOTFOUNDSRC && !e.target.classList.contains("do-not-lazysize")) {
                        e.target.setAttribute('src', NOTFOUNDSRC);
                        // e.target.classList.add('errorImg');
                       }
                      },
                      true,
                     );
                `,
                }}
            />
        </>
    )
}
