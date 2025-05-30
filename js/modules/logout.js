import { pb } from "../../services/pocketbase-service.js";

const addLogoutListener = () => {
    const exitButton = document.querySelector(".header-user-button");
    exitButton.addEventListener("click", () => {
        pb.authStore.clear();
        location.reload();
    });
}

export default addLogoutListener;