export function debounce(func, delay, obj = {leading: false}) {
 
    let timeOutID;
    return (...arg) => {
        // if obj.leading is ture call the callback immediately don't it de maniere asynchronously.
        if (obj.leading && !timeOutID) {
            func(...arg);
        }
        clearTimeout(timeOutID);
        // setimeout s'execute de maniere asynchrone even thought the delay is 0, your callback will execute in the background.
        timeOutID = setTimeout( () => {
            func(...arg)
        }, delay)
    }
}