export const filterPersonList = (personList) => {
    const personInput = document.querySelector(".input_search");
    const inputName = personInput.value.toLowerCase().trim();

    let filteredPersonList = personList.filter(item => {
        const personName = item.name.toLowerCase().trim();

        return personName.includes(inputName);
    })

    return filteredPersonList;
};