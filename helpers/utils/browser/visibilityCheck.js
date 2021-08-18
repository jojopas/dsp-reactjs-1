export default function visibilityCheck() {
    let hidden = null;
    let visibilityChange = null;

    if (document.hidden !== undefined) {
        hidden = 'hidden';
        visibilityChange = 'visibilitychange';
    } else if (document.msHidden !== undefined) {
        hidden = 'msHidden';
        visibilityChange = 'msvisibilitychange';
    } else if (document.webkitHidden !== undefined) {
        hidden = 'webkitHidden';
        visibilityChange = 'webkitvisibilitychange';
    }

    return {hidden, visibilityChange};
};
