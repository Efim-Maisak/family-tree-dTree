import { dataTable } from "../../config/apiConfig.js";
import { baseUrl } from "../../config/apiConfig.js";
import { baseImagePath } from "../../config/apiConfig.js";
import { lastClickedNodeTime as time } from "./main-graph.js";
import PocketBase from "../../lib/pocketbase.es.mjs";


let currentPersonId = null;
let photoIsChanged = false;
let originalData = {};

const editPerson = (extra, lastClickedNodeTime) => {

    const pb = new PocketBase(`${baseUrl}`);

    const personPhoto = document.querySelector(".person-photo");
    const photoOverlay = document.querySelector(".photo-overlay");
    const photoInput = document.getElementById("photo-input");
    const personInfo = document.querySelectorAll(".person-info");
    const inputsBlock = document.querySelector(".popup_content__edit");
    const showTreeBtn = document.querySelector(".popup_bottom__button");
    const isLivingToggle = document.getElementById("isLivingToggle");
    const editBtn = document.querySelector(".edit-button");
    const saveBtn = document.querySelector(".save-button");
    const cancelBtn = document.querySelector(".cancel-button");

    let fields = null;
    let isPhotoUploading = false;

    if(extra && extra.name === "неизвестно") {
        editBtn.style.display = "none";
    } else {
        editBtn.style.display = "block";
    }

    if(extra) {
        fields = [
            { input: "person-name-input", key: "name", value: extra.name },
            { input: "person-gender-select", key: "gender", value: extra.gender },
            { input: "person-birth-input", key: "date_of_birth", value: extra.birthDate },
            { input: "person-death-input", key: "date_of_death", value: extra.deathDate },
            { input: "place-birth-input", key: "place_of_birth", value: extra.birthPlace },
            { input: "place-death-input", key: "place_of_death", value: extra.deathPlace },
            { input: "person-info-input", key: "information", value: extra.information },
            { input: "coordinates-input", key: "place_of_birth_coordinates", value: extra.coordinates }
        ];
    };

    function toggleEditMode(isEditing) {
        personInfo.forEach( element => {
            element.style.display = isEditing ? "none" : "flex";
            showTreeBtn.style.display = isEditing ? "none" : "block";
        });
        inputsBlock.style.display = isEditing ? "flex" : "none";
        editBtn.style.display = isEditing ? "none" : "inline-block";
        saveBtn.style.display = isEditing ? "inline-block" : "none";
        cancelBtn.style.display = isEditing ? "inline-block" : "none";
    };

    function togglePhotoOverlay(isEditing) {
        photoOverlay.style.display = isEditing ? "flex" : "none";
    }

    photoOverlay.onclick = (e) => {
        e.preventDefault();
        if (!isPhotoUploading) {
            photoInput.click();
        }
    };

    photoInput.onchange = async (event) => {
        if (isPhotoUploading) return; // Если уже идёт загрузка, игнорируем новые события

        const file = event.target.files[0];
        if (!file) return;

        // Валидация формата файла
        const validFormats = ["image/jpeg", "image/png"];
        if (!validFormats.includes(file.type)) {
            alert("Пожалуйста, выберите файл в формате JPEG или PNG.");
            photoInput.value = "";
            return;
        }

        isPhotoUploading = true;

        const formData = new FormData();
        formData.append("portret", file);

        try {
            const updatedFoto = await pb.collection("genealogy").update(extra.id, formData);
            personPhoto.src = `${baseImagePath}/${dataTable}/${extra.id}/${updatedFoto.portret}`;
            photoIsChanged = true;
        } catch (error) {
            console.error("Ошибка загрузки фото: ", error);
        } finally {
            isPhotoUploading = false;
            photoInput.value = "";
        }
    };

    editBtn.removeEventListener("click", editBtn.handler);
    editBtn.handler = () => {
        if (fields) {
            fields.forEach(field => {
                originalData[field.key] = field.value;
            });
            originalData.isLivingPerson = extra.isLiving;

            fields.forEach(field => {
                document.getElementById(field.input).value = field.value;
            });
            isLivingToggle.checked = extra.isLiving;
            toggleEditMode(true);
            togglePhotoOverlay(true);
            currentPersonId = extra.id;
        }
    };
    editBtn.addEventListener("click", editBtn.handler);

    cancelBtn.addEventListener("click", () => {
        toggleEditMode(false);
        togglePhotoOverlay(false);
    });

    saveBtn.removeEventListener("click", saveChanges);
    saveBtn.addEventListener("click", saveChanges);

    async function saveChanges() {
        if(time === lastClickedNodeTime) {
            const newData = {
                "name": document.getElementById("person-name-input").value,
                "gender": document.getElementById("person-gender-select").value,
                "date_of_birth": document.getElementById("person-birth-input").value,
                "date_of_death": document.getElementById("person-death-input").value,
                "place_of_birth": document.getElementById("place-birth-input").value,
                "place_of_birth_coordinates": document.getElementById("coordinates-input").value,
                "place_of_death": document.getElementById("place-death-input").value,
                "information": document.getElementById("person-info-input").value,
                "isLivingPerson": isLivingToggle.checked
            }

            const hasChanges = Object.keys(newData).some(key => {
                return newData[key] !== originalData[key];
            });

            if(hasChanges) {
                saveBtn.disabled = true;
                try {
                    const response = await pb.collection('genealogy').update(currentPersonId, newData);
                    if (response.id) {
                        saveBtn.disabled = false;
                        toggleEditMode(false);
                        location.reload();
                    };
                } catch(e) {
                    toggleEditMode(false);
                    togglePhotoOverlay(false);
                    alert(`Возникла ошибка при изменении данных: ${e}`);
                }
            } else if(photoIsChanged) {
                toggleEditMode(false);
                location.reload();
            }
        }
    }

    return {
        toggleEditMode,
        togglePhotoOverlay
    }
}

export default editPerson;