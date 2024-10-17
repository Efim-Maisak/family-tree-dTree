import httpService from "../../services/http.js";
import { baseDBpath } from "../../config/apiConfig.js";
import { dataTable } from "../../config/apiConfig.js";
import { lastClickedNodeTime as time } from "./main-graph.js";


const editPerson = (extra, lastClickedNodeTime) => {

    const { request } = httpService();

    const personInfo = document.querySelectorAll(".person-info");
    const inputsBlock = document.querySelector(".popup_content__edit");
    const showTreeBtn = document.querySelector(".popup_bottom__button");
    const isLivingToggle = document.getElementById('isLivingToggle');
    const editBtn = document.querySelector(".edit-button");
    const saveBtn = document.querySelector(".save-button");
    const cancelBtn = document.querySelector(".cancel-button");


    let fields = null;
    let originalData = {};

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

    if(fields) {
        fields.forEach(field => {
            originalData[field.key] = field.value;
            originalData.isLivingPerson = extra.isLiving;
        });
    }

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

    editBtn.addEventListener("click", () => {
        if(fields) {
            fields.forEach(field => {
                const input = document.getElementById(field.input);
                if (input) {
                    input.value = field.value;
                }
            });
            isLivingToggle.checked = extra.isLiving;
            toggleEditMode(true);
        };
    });

    cancelBtn.addEventListener("click", () => {
        toggleEditMode(false);
    });

    saveBtn.removeEventListener("click", saveChanges);
    saveBtn.addEventListener("click", saveChanges);

    function saveChanges() {
        if(time === lastClickedNodeTime) {
            console.log(time + " - " + lastClickedNodeTime);
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

            const hasChanges = Object.keys(newData).some( key => {
                return newData[key] !== originalData[key];
            });


            if(hasChanges) {
                saveBtn.disabled = true;
                request(
                    `${baseDBpath}/${dataTable}/records/${extra.id}`,
                    "PATCH",
                    newData
                )
                .then((response) => {
                    if(!response.hasOwnProperty("code")) {
                        saveBtn.disabled = false;
                        toggleEditMode(false);
                        location.reload();
                    }
                });
            } else {
                toggleEditMode(false);
            }
        }
    }

    return {
        toggleEditMode
    }
}

export default editPerson;