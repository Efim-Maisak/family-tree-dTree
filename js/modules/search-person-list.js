import { filterPersonList } from "../../utils/filterPersonList.js";


const searchPearsonList = (personList, tree, dataWithNodeId) => {
    const listWrapperBlock = document.querySelector(".list-wrapper");
    const personInput = document.querySelector(".input_search");
    const searchButton = document.querySelector(".header-panel-button");

    const showList = (persons) => {
        if(personInput.value === "") {
            return;
        };

        let elementPersonList = persons.map( item => {
            return `<div class="list-item" data-id="${item.id}">
                <span class="list-item__nametext">${item.name}</span>
                <span class="list-item__birthtext">${item.date_of_birth.split(".")[2] || item.date_of_birth}</span>
            </div>`
        });

        if(persons.length === 0) {
            listWrapperBlock.innerHTML = '<div class="list-item">Ничего не найдено</div>';
        } else {
            listWrapperBlock.innerHTML = elementPersonList.join("");
        }
        listWrapperBlock.style.display = "flex";
    };

    const hideList = () => {
        listWrapperBlock.style.display = "none";
        listWrapperBlock.innerHTML = "";

    };

    const performSearch = () => {
        if(personList) {
            const filteredList = filterPersonList(personList);
            showList(filteredList);
        }
    }

    const searchButtonClickHandler = () => {
        performSearch();
    };

    const enterButtonHandler = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            performSearch();
        }
    }

    const inputHandler = (e) => {
        if(e.target.value === "") {
            hideList();
        }
    };

    const personListItemClickHandler = (e) => {
        const listItem = e.target.closest(".list-item");
        if(listItem) {
            const idAttribute = listItem.getAttribute("data-id");
            if(dataWithNodeId) {
                const person = dataWithNodeId.find( item => item.id === idAttribute);
                if(person) {
                    const nodeId = person.nodeId;
                    console.log(nodeId);
                    tree.zoomToNode(nodeId, 2, 500);
                }
            }
        }
    };

    const outsideClickHandler = (e) => {
        if (!listWrapperBlock.contains(e.target) && !personInput.contains(e.target)) {
            hideList();
            personInput.value = "";
        }
    };

    const removeHandlers = () => {
        listWrapperBlock.removeEventListener("click", personListItemClickHandler);
        document.body.removeEventListener("click", outsideClickHandler);
        searchButton.removeEventListener("click", searchButtonClickHandler);
        personInput.removeEventListener("keypress", enterButtonHandler);
    };

    searchButton.addEventListener("click", searchButtonClickHandler);
    personInput.addEventListener("keypress", enterButtonHandler);
    personInput.addEventListener("input", inputHandler);
    listWrapperBlock.addEventListener("click", personListItemClickHandler);
    document.body.addEventListener("click", outsideClickHandler );


    searchButton.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    return {
        removeHandlers
    }

};

export default searchPearsonList;