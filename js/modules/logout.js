import { pb } from "../script.js";

const logout = () => {
    const exitButton = document.querySelector(".header-user-button");
    exitButton.addEventListener("click", () => {
        pb.authStore.clear();
        location.reload();
    });
}

export default logout;