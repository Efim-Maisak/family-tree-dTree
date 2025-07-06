import toast from "../js/modules/toast.js";

export const validateSendData = (formData) => {
    const dateRegex = /(^|[^0-9])(~?\d{4}\??(?:[-–]~?\d{2,4}\??)?|\d{2}(\(\d{2}\))?\.\d{2}(\(\d{2}\))?\.\d{4}(\(\d{2,4}\))?(?:[-–]\d{4}(\(\d{2,4}\))?)?)(?!\d)/;

    const isValidName = formData.name.length >= 7;
    const isValidBirthDate = dateRegex.test(formData.birthDate || formData.date_of_birth);

    if(isValidName && isValidBirthDate) {
        return true;
    } else {
        toast("Поле ФИО не заполненно либо формат даты рождения некорректен", "warning", 5000);
        return false;
    }
};