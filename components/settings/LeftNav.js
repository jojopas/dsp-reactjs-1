import Link from "next/link";
import "./LeftNav.less";

const LeftNav = ({ slug }) => {
    const navItems = [
        { inner: "About", slug: "about" },
        { inner: "Contact Us", slug: "contact" },
        { inner: "Terms & Conditions", slug: "terms-condition" },
        { inner: "CCPA", slug: "ccpa" },
        { inner: "Closed Captioning", slug: "closed-caption" },
        { inner: "Privacy Policy", slug: "privacy" },
    ];

    return (
        <div className="leftNav">
            <h1>Settings</h1>
            <ul>
                {navItems.map((nav) => (
                    <li>
                        <Link href={nav.slug}>{nav.inner}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LeftNav;
