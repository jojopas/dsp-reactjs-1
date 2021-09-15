import React from 'react';
import useSWR from 'swr';
import getConfig from 'next/config';
import Link from 'next/link';

import {constants} from '../../config';
import {fetchData} from '../../helpers/utils/fetch-data';

const {publicRuntimeConfig} = getConfig();

export default function Ad() {

    const { token } = JSON.parse(publicRuntimeConfig.DSP_TOKEN);
    const [linkHref, setLinkHref] = React.useState('');
    const [linkAs, setLinkAs] = React.useState('');
    const [image, setImage] = React.useState('');
    const [alt, setAlt] = React.useState('');

    let apiUrl = `https://${publicRuntimeConfig.DSP_API_URL}/channels/${constants.DSP_COUNTRY}/promo-ad-banner`;

    const { data } = useSWR(apiUrl, async (url) => await fetchData(url, {authorization: token}));

    const deepLinks = [
        { prefix: '/channels', slug: '/channels/[[...slug]]'},
        { prefix: '/on-demand/movies/', slug: '/on-demand/movies/[...slug]'},
        { prefix: '/on-demand/shows/', slug: '/on-demand/shows/[...slug]'},
    ];

    React.useEffect(() => {
        //console.log(data);
        if (data?.data?.channels[0]) {
            const { spotlight_poster, story_blocks } = data?.data?.channels[0];
            const linkTo = `/${story_blocks[0].detail.link.toString().match(/\/\/[^\/]+\/([^\.]+)/)[1]}`;
            const routerSlug = deepLinks.find(link => linkTo.includes(link.prefix));
            setLinkHref(routerSlug?.slug);
            setLinkAs(linkTo);
            setImage(spotlight_poster);
            setAlt(story_blocks[0].detail?.call_to_action);
        }
    }, [data]);

    if(linkHref !== ''){
        return (
            <Link href={linkHref} as={linkAs}>
                <a>
                    <img src={image} alt={alt} />
                </a>
            </Link>
        )
    }
    return <div/>;
}
