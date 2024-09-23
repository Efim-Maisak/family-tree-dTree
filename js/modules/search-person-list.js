import { filterPersonList } from "../../utils/filterPersonList.js";
import { genealogyDataWithNodeId } from "./main-graph.js";

const searchPearsonList = (personList, tree) => {
    const listWrapperBlock = document.querySelector(".list-wrapper");
    const personInput = document.querySelector(".input_search");
    const searchButton = document.querySelector(".header-panel-button");

    const showList = (persons) => {
        if(personInput.value === "") {
            return
        };
        let elementPersonList = persons.map( item => {
            return `<div class="list-item" data-id="${item.id}">${item.name}</div>`
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

    listWrapperBlock.addEventListener("click", (e) => {
        if(e.target.className === "list-item") {
            const idAttribute = e.target.getAttribute("data-id");
            const person = genealogyDataWithNodeId.find( item => item.id === idAttribute);
            const nodeId = person.nodeId;
            tree.zoomToNode(nodeId, 2, 500);
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