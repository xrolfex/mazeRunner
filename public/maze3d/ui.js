// maze3d/ui.js
// Handles pointer lock overlay, finish popup, and related UI event listeners

let pointerLockOverlay = null;
let finishPopup = null;

export function setupPointerLockOverlay(container, onResume) {
    pointerLockOverlay = document.createElement('div');
    pointerLockOverlay.style.position = 'absolute';
    pointerLockOverlay.style.top = 0;
    pointerLockOverlay.style.left = 0;
    pointerLockOverlay.style.width = '100%';
    pointerLockOverlay.style.height = '100%';
    pointerLockOverlay.style.background = 'rgba(0,0,0,0.5)';
    pointerLockOverlay.style.display = 'none';
    pointerLockOverlay.style.alignItems = 'center';
    pointerLockOverlay.style.justifyContent = 'center';
    pointerLockOverlay.style.zIndex = 10001;
    pointerLockOverlay.style.pointerEvents = 'none';
    const pointerLockMessage = document.createElement('div');
    pointerLockMessage.innerText = 'Click to resume mouse look';
    pointerLockMessage.style.color = '#fff';
    pointerLockMessage.style.fontSize = '2rem';
    pointerLockMessage.style.background = 'rgba(0,0,0,0.7)';
    pointerLockMessage.style.padding = '32px 48px';
    pointerLockMessage.style.borderRadius = '16px';
    pointerLockMessage.style.cursor = 'pointer';
    pointerLockMessage.style.pointerEvents = 'auto';
    pointerLockMessage.addEventListener('click', onResume);
    pointerLockOverlay.appendChild(pointerLockMessage);
    return pointerLockOverlay;
}

export function showPointerLockOverlay() {
    if (pointerLockOverlay) pointerLockOverlay.style.display = 'flex';
}

export function hidePointerLockOverlay() {
    if (pointerLockOverlay) pointerLockOverlay.style.display = 'none';
}

export function setupFinishPopup(modal, onClose) {
    finishPopup = document.getElementById('maze3d-finish-popup');
    if (!finishPopup) {
        finishPopup = document.createElement('div');
        finishPopup.id = 'maze3d-finish-popup';
        finishPopup.style.position = 'absolute';
        finishPopup.style.top = '0';
        finishPopup.style.left = '0';
        finishPopup.style.width = '100%';
        finishPopup.style.height = '100%';
        finishPopup.style.background = 'rgba(0,0,0,0.7)';
        finishPopup.style.display = 'none';
        finishPopup.style.alignItems = 'center';
        finishPopup.style.justifyContent = 'center';
        finishPopup.style.zIndex = 10002;
        finishPopup.innerHTML = '<div style="background:#222;padding:40px 60px;border-radius:16px;color:#fff;font-size:2rem;text-align:center;box-shadow:0 0 30px #000;">You finished!<br><button id="maze3d-finish-ok" style="margin-top:30px;font-size:1.5rem;padding:8px 32px;border-radius:8px;border:none;background:#4caf50;color:#fff;cursor:pointer;">OK</button></div>';
        if (modal) modal.appendChild(finishPopup);
    }
    document.getElementById('maze3d-finish-ok')?.addEventListener('click', onClose);
    return finishPopup;
}

export function showFinishPopup() {
    if (finishPopup) finishPopup.style.display = 'flex';
    document.exitPointerLock();
}

export function hideFinishPopup() {
    if (finishPopup) finishPopup.style.display = 'none';
}

export function removePointerLockOverlay() {
    if (pointerLockOverlay && pointerLockOverlay.parentNode) pointerLockOverlay.parentNode.removeChild(pointerLockOverlay);
    pointerLockOverlay = null;
}

export function removeFinishPopup() {
    if (finishPopup && finishPopup.parentNode) finishPopup.parentNode.removeChild(finishPopup);
    finishPopup = null;
}
