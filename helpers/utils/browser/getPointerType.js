export default function getPointerType(e) {
    let type = 'mouse';
    if (typeof e.pointerType !== 'undefined') {
        type = e.pointerType;
    }
    return type;
}
