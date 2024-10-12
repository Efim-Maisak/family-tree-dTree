const editPerson = (extra) => {
    const personInfo = document.querySelectorAll(".person-info");
    const inputsBlock = document.querySelector(".popup_content__edit");
    const showTreeBtn = document.querySelector(".popup_bottom__button");
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
            { span: 'person-name', input: 'person-name-input', key: 'name', value: extra.name },
            { span: 'person-gender', input: 'person-gender-select', key: 'gender', value: extra.gender },
            { span: 'person-birth', input: 'person-birth-input', key: 'date_of_birth', value: extra.birthDate },
            { span: 'person-death', input: 'person-death-input', key: 'date_of_death', value: extra.deathDate },
            { span: 'place-birth', input: 'place-birth-input', key: 'place_of_birth', value: extra.birthPlace },
            { span: 'place-death', input: 'place-death-input', key: 'place_of_death', value: extra.deathPlace },
            { span: 'person-info', input: 'person-info-input', key: 'information', value: extra.information }
        ];
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
    }

    editBtn.addEventListener("click", () => {
        if(fields) {
            fields.forEach(field => {
                const input = document.getElementById(field.input);
                if (input) {
                    input.value = field.value;
                }
            });
            toggleEditMode(true);
        };
    });

    cancelBtn.addEventListener("click", () => {
        toggleEditMode(false);
    });

    return {
        toggleEditMode
    }
}

export default editPerson;