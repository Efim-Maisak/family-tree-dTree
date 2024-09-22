import { filterPersonList } from "../../utils/filterPersonList.js";

const searchPearsonList = (personList) => {
    const listWrapperBlock = document.querySelector(".list-wrapper");
    const personInput = document.querySelector(".input_search");
    const searchButton = document.querySelector(".header-panel-button");

    const showList = (persons) => {
        if(personInput.value === "") {
            return
        };
        let elementPersonList = persons.map( item => {
            return `<div class="list-item">${item.name}</div>`
        });
        listWrapperBlock.innerHTML = elementPersonList.join("");
        listWrapperBlock.style.display = "flex";
    };

    const hideList = () => {
        listWrapperBlock.style.display = "none";
        listWrapperBlock.innerHTML = "";

    };

    searchButton.addEventListener("click", () => {
        const filteredList = filterPersonList(personList);
        showList(filteredList);
    });

    personInput.addEventListener("input", (e) => {
        if(e.target.value === "") {
            hideList();
        }
    });

    document.body.addEventListener("click", (e) => {
        if (!listWrapperBlock.contains(e.target) && !personInput.contains(e.target)) {
            hideList();
            personInput.value = "";
        }
    });

    searchButton.addEventListener("click", (e) => {
        e.stopPropagation();
    });
};

export default searchPearsonList;