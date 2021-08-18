function _isHidden(el) {
    // return (el.offsetParent === null);
    return false;
}

function _aniEnd(evt) {
    const endEl = evt.currentTarget;
    clearTimeout(endEl.timeout);

    if (!endEl.isIn) {
        endEl.style.display = 'none';
    }
    endEl.classList.remove('fadeIn', 'fadeOut');
    if (typeof endEl.callback === 'function') {
        endEl.callback();
    }

    // console.log('**************animationend', endEl.isIn, endEl, endEl.callback);
    endEl.isIn = null;
    endEl.isAnimating = false;
    endEl.callback = null;
    endEl.removeEventListener('animationend', _aniEnd, false);
}

function fade(type, element, callback) {
    const isIn = type === 'in';
    const el = element;

    // If a second call to fade the same direction and we are in the middle of animating then discard new request
    if (el && el.isIn && (el.isIn === isIn) && el.isAnimating) {
        return;
    }

    el.removeEventListener('animationend', _aniEnd, false);
    el.classList.remove('fadeIn', 'fadeOut');

    if (isIn) {
        el.style.display = 'block';
    }

    // console.log('\n\n**************fade', isIn, el, el.offsetParent);
    // console.trace();

    el.isIn = isIn;
    el.isAnimating = true;
    el.callback = callback;
    if (_isHidden(el)) {
        // console.log('************isHidden', el);
        _aniEnd({ currentTarget: el });
    } else {
        el.addEventListener('animationend', _aniEnd, false);
        el.timeout = setTimeout(() => {
            if (el.isAnimating) {
                // console.log('********* animationend failed fix', el);
                _aniEnd({ currentTarget: el });
            }
        }, 500);
        el.classList.add((isIn) ? 'fadeIn' : 'fadeOut');
    }
}

function fadeIn(el, callback) {
    fade('in', el, callback);
}

function fadeOut(el, callback) {
    fade('out', el, callback);
}

export { fade, fadeIn, fadeOut };
