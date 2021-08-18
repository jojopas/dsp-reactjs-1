export default function hasPointerEvents() {
    if (window && typeof window.PointerEvent !== 'undefined') {
        return true;
    }
    return false;
}
