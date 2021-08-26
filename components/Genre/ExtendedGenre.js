import "./ExtendedGenre.less";
import InlineSVG from "../InlineSVG";
import CardList from "../cardList/CardList";

export default function ExtendedGenre({ data, setClickedCardTitle }) {
    return (
        <>
            <h1 className="noShow">{data?.category?.name}</h1>
            <div className="clickedTitle">
                <div
                    className="backButton"
                    onClick={() => setClickedCardTitle(null)}
                >
                    <InlineSVG type="backArrow" />
                </div>
                <span className="clickedHeader">{data?.category?.name}</span>
            </div>
            <CardList key={data.category.id} type="grid" data={data} />
        </>
    );
}
