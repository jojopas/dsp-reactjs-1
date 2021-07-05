import { isEmpty } from "../helpers/utils/objects";
import getSession from "../helpers/session/get-session";
import pageError from "../helpers/page/error";
import { getLayout } from "../components/Layout";
import { pageBuilder } from "../helpers/page/builder";
import Channels from "../components/channel/channel";

export default function Channel({
    session,
    config,
    slug,
    page,
    pageError,
    seoObj,
    pageType,
}) {
    return (
        <Channels
            session={session}
            config={config}
            slug={slug}
            page={page}
            pageError={pageError}
            seoObj={seoObj}
            pageType={pageType}
        />
    );
}
Channel.getLayout = getLayout;

export const getServerSideProps = async ({ req, res, query }) => {
    const slug = !isEmpty(query) ? query.slug[0] : "";
    const { session, config } = await getSession(req, res);
    const routes = [
        "/api/dsp/live/epg",
        "/api/dsp/company/available/genres/live",
    ];
    const pageOptions = { req, routes, session, config };
    const page = await pageBuilder(pageOptions);
    let error = pageError([session, config, page]);

    let seoObj = {
        title: "Channels",
    };
    if (slug) {
        const channel = page.channels.find((c) => c.slug === slug);
        if (channel && channel.name) {
            seoObj.title = channel.name;
            seoObj.image = channel.logo;
        } else {
            error = true;
        }
    }
    if (page.channels && page.channels.length === 0) {
        error = true;
    }

    if (error) {
        res.statusCode = 404;
    }

    return {
        props: {
            session: session || null,
            config: config || null,
            page: page || null,
            slug: slug || null,
            pageError: error || false,
            pageType: "channel",
            seoObj: seoObj || null,
        },
    };
};
