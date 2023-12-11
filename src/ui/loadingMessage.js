

// Function to display a loading message on the screen
export function showLoadingMessage() {
    const loadingMessage = document.createElement('div');
    loadingMessage.innerHTML = `<div>Loading...</div>`;
    loadingMessage.className = 'loading-message text-4xl text-white h-full flex items-center justify-center';
    document.getElementById("game-board")
    document.getElementById("game-board").appendChild(loadingMessage);
}

// Function to remove the loading message from the screen
export function hideLoadingMessage() {
    const loadingMessage = document.querySelector('.loading-message');
    if (loadingMessage) {
        document.getElementById("game-board").removeChild(loadingMessage);
    }
}