export const validateSendData = (formData) => {
    const isValidName = formData.name.length >= 7;
    const isValidBirthDate = formData.birthDate !== "";

    if(isValidName && isValidBirthDate) {
        return true;
    }
};