import httpService from "../../services/http.js";
import { baseDBpath } from "../../config/apiConfig.js";
import { dataTable } from "../../config/apiConfig.js";


const editPerson = (extra) => {

    const { request } = httpService();

    const personInfo = document.querySelectorAll(".person-info");
    const inputsBlock = document.querySelector(".popup_content__edit");
    const showTreeBtn = document.querySelector(".popup_bottom__button");
    const isLivingToggle = document.getElementById('isLivingToggle');
    const editBtn = document.querySelector(".edit-button");
    const saveBtn = document.querySelector(".save-button");
    const cancelBtn = document.querySelector(".cancel-button");


    let fields = null;

    if(extra && extra.name === "неизвестно") {
        editBtn.style.display = "none";
    } else {
        editBtn.style.display = "block";
    }

    console.log(extra);

    if(extra) {
        fields = [
            { input: "person-name-input", key: "name", value: extra.name },
            { input: "person-gender-select", key: "gender", value: extra.gender },
            { input: "person-birth-input", key: "date_of_birth", value: extra.birthDate },
            { input: "person-death-input", key: "date_of_death", value: extra.deathDate },
            { input: "place-birth-input", key: "place_of_birth", value: extra.birthPlace },
            { input: "place-death-input", key: "place_of_death", value: extra.deathPlace },
            { input: "person-info-input", key: "information", value: extra.information },
            { input: "coordinates-input", key: "coordinates", value: extra.coordinates }
        ];
    };

    const handleLivingToggle = (e) => {
        const isLiving = e.target.checked;
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

        if(isEditing) {
            isLivingToggle.addEventListener("change", handleLivingToggle);
        } else {
            isLivingToggle.removeEventListener("change", handleLivingToggle);
        }
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


    saveBtn.addEventListener("click", () => {

        const data = {
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

        if(extra) {
            request(
                `${baseDBpath}/${dataTable}/records/${extra.id}`,
                "PATCH",
                data
            )
            .then((response) => {
                if(!response.hasOwnProperty("code")) {
                    toggleEditMode(false);
                    location.reload();
                }
            })
        }
    });

    return {
        toggleEditMode
    }
}

export default editPerson;