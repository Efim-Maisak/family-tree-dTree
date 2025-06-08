if (!document.querySelector("#toast-animations")) {
    const style = document.createElement("style");
    style.id = "toast-animations";
    style.textContent = `
        @keyframes slideInFromRight {
            0% {
                transform: translateX(100%);
                opacity: 0;
            }
            100% {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutToRight {
            0% {
                transform: translateX(0);
                opacity: 1;
            }
            100% {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        .toast-close {
            position: absolute;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.8);
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s ease;
            border-radius: 50%;

        }

        .toast-close:hover {
            border: 2px solid rgba(255, 255, 255, 0.8);
        }
    `;
    document.head.appendChild(style);
}

const toast = (message, type, duration = 3000) => {

    const toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";

    // Базовые стили
    toastContainer.style.position = "fixed";
    toastContainer.style.bottom = "30px";
    toastContainer.style.right = "30px";
    toastContainer.style.minWidth = "300px";
    toastContainer.style.maxWidth = "400px";
    toastContainer.style.padding = "16px 20px";
    toastContainer.style.paddingRight = "50px";
    toastContainer.style.borderRadius = "12px";
    toastContainer.style.color = "white";
    toastContainer.style.fontWeight = "500";
    toastContainer.style.fontSize = "14px";
    toastContainer.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.15)";
    toastContainer.style.zIndex = "1000";
    toastContainer.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    toastContainer.style.animation = "slideInFromRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    toastContainer.style.transformOrigin = "right center";

    // Стили для маленких экранов
    if (window.innerWidth <= 480) {
        toastContainer.style.right = "15px";
        toastContainer.style.left = "15px";
        toastContainer.style.minWidth = "auto";
        toastContainer.style.maxWidth = "none";
    }

    if (type === "success") {
        toastContainer.style.background = "#4caf50";
    } else if (type === "warning") {
        toastContainer.style.background = "#ff9800";
    } else if (type === "error") {
        toastContainer.style.background = "#f44336";
    }

    const messageSpan = document.createElement("span");
    messageSpan.textContent = message;

    const closeButton = document.createElement("button");
    closeButton.className = "toast-close";
    closeButton.innerHTML = "×";
    closeButton.setAttribute("aria-label", "Close notification");

    toastContainer.appendChild(messageSpan);
    toastContainer.appendChild(closeButton);
    document.body.appendChild(toastContainer);

    setTimeout(() => {
        toastContainer.remove();
    }, duration);

    closeButton.addEventListener("click", () => {
        toastContainer.remove();
    });

};

export default toast;