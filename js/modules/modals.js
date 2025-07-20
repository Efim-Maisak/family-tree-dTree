import editPerson from "./edit-person.js";


const modals = () => {

    const { toggleEditMode, togglePhotoOverlay } = editPerson();

    const modalElement = document.getElementById("modal");
    const modalContent = modalElement.querySelector(".popup_content");

    function openModal() {
        modalElement.style.display = "flex";
        modalContent.style.display = "block";
        document.body.style.overflow = "hidden";
    };

    function closeModal() {
        modalElement.style.display = "none";
        modalContent.style.display = "none";
        document.body.style.overflow = "";
    };

    modalElement.addEventListener("click", (event) => {
        if (event.target === modalElement) {
            closeModal();
            toggleEditMode(false);
            togglePhotoOverlay(false);
        }

        if (event.target.classList.contains("popup_close")) {
            closeModal();
            toggleEditMode(false);
            togglePhotoOverlay(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
            toggleEditMode(false);
            togglePhotoOverlay(false);
        }
    });

    return { openModal, closeModal };
};

export default modals;