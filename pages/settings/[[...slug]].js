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

                <div className="settings">
                    <h1>Header</h1>
                    <p>
                        LoreamReprehenderit et incididunt et mollit eu do ea ad.
                        Cillum veniam amet sit amet Lorem amet duis sint
                        nostrud. Dolore enim qui tempor incididunt eiusmod anim
                        duis est. Excepteur nostrud nisi consectetur pariatur
                        excepteur sint laboris.
                        <span className="hover">Hover Color</span> Ex eiusmod
                        elit excepteur sit id reprehenderit magna.
                        <span className="link">Link Color</span>
                    </p>

                    <h2>Header 2</h2>
                    <p>
                        LoreamReprehenderit et incididunt et mollit eu do ea ad.
                        Cillum veniam amet sit amet Lorem amet duis sint
                        nostrud. Dolore enim qui tempor incididunt eiusmod anim
                        duis est. Excepteur nostrud nisi consectetur pariatur
                        excepteur sint laboris.
                        <span className="hover">Hover Color</span> Ex eiusmod
                        elit excepteur sit id reprehenderit magna.
                        <span className="link">Link Color</span>
                    </p>
                    <br />
                    <br />
                    <br />
                    <h1>Contact Us</h1>
                    <p>
                        We love feedback and great Ideas! Tell us what you
                        think. Email us today at{" "}
                        <a href="mailTo:sportstvfeedback@sports.tv">
                            sportstvfeedback@sports.tv
                        </a>
                    </p>

                    <ContactForm />
                    <div className="build">Release 1.0 build 3306</div>
                </div>
            </>
        ) : (
            <Error404 />
        )
    );
}

Settings.getLayout = getLayout;