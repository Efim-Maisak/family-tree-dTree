import toast from "../js/modules/toast.js";

export const validateSendData = (formData) => {
    const isValidName = formData.name.length >= 7;
    const isValidBirthDate = formData.birthDate !== "";

    if(isValidName && isValidBirthDate) {
        return true;
    } else {
        toast("Поля c именем и датой рождения должны быть заполнены.", "warning", 5000);
        return false;
    }
};