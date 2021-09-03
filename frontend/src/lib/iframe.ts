export function isIframed() {
    try { // accessing window.top may raise SecurityError in cross-origin situations
        return window.self !== window.top
    } catch (e) {
        return true
    }
}

export function sendMessageToParent(data: any) {
    if (!isIframed()) { return }
    window.parent.postMessage(JSON.stringify(data), '*')
}

