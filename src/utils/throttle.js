function throttle(func, wait, options = { leading: false, trailing: true }) {
    let timeout = null;
    let previous = 0;
    return function (...args) {
        const now = Date.now();
        if (!previous && !options.leading) {
            previous = now;
        }
        if (now - previous > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            func(...args);
            previous = now;
        } else if (options.trailing && !timeout) {
            timeout = setTimeout(() => {
                func(...args);
                previous = Date.now();
                timeout = null;
            }, wait);
        }
    };
}

export { throttle };
