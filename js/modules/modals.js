import editPerson from "./edit-person.js";
import { calcScroll } from "../../utils/calcScroll.js";

const modals = () => {

    const { toggleEditMode } = editPerson();

    const modalElement = document.getElementById("modal");
    const modalContent = modalElement.querySelector(".popup_content");
    const closeElement = modalElement.querySelector(".popup_close");

    const scrollWidth = calcScroll();

    function openModal() {
        modalElement.style.display = "flex";
        modalContent.style.display = "block";
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollWidth}px`;
    }

    function closeModal() {
        modalElement.style.display = "none";
        modalContent.style.display = "none";
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
    }

    closeElement.addEventListener("click", () => {
        closeModal();
        toggleEditMode(false);
    });

    modalElement.addEventListener("click", (event) => {
        if (event.target === modalElement) {
            closeModal();
            toggleEditMode(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            closeModal();
            toggleEditMode(false);
        }
    });

    return { openModal, closeModal };
};

export default modals;