import "./index.less";
import LocalSEOTags from "../../head/local";
import { useObserver } from "mobx-react-lite";
import ContactForm from "../../components/contact/ContactForm";
import { getLayout } from "../../components/Layout";

export default function Settings({
    session,
    config,
    slug,
    page,
    pageError,
    seoObj,
    pageType,
}) {
    return useObserver(() =>
        !pageError ? (
            <>
                <LocalSEOTags pageType="settings" seoObj={seoObj} />
                <h1 className="noShow">Settings</h1>

                <div className="placeholder">
                    <h1>Contact Us</h1>
                    <p>
                        We love feedback and great Ideas! Tell us what you
                        think. Email us today at{" "}
                        <a href="mailTo:sportstvfeedback@sports.tv">
                            sportstvfeedback@sports.tv
                        </a>
                    </p>

                    <ContactForm />
                    <div className="build">Release 1.0 build 3317</div>
                </div>
            </>
        ) : (
            <Error404 />
        )
    );
}

Settings.getLayout = getLayout;
