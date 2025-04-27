export const validateSendData = (formData) => {
    const isValidName = formData.name.length >= 7;
    const isValidBirthDate = formData.birthDate !== "";

    if(isValidName && isValidBirthDate) {
        return true;
    } else {
        alert("Поля c именем и датой рождения должны быть заполнены.");
        return false;
    }
};