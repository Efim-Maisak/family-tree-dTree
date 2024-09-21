import httpService from "../services/http.js";
import { baseDBpath } from "../config/apiConfig.js";
import { dataTable } from "../config/apiConfig.js";
import { maxItems } from "../config/apiConfig.js";
import { keyGraph } from "./modules/main-graph.js";


export let genealogyData = [];
const { request, isLoading } = httpService();
const loadingDiv = document.createElement("div");
let mainTree = null;


const showLoadingDiv = () => {
    loadingDiv.classList.add("loading");
    loadingDiv.innerHTML = '<img src="../assets/svg-spinners-blocks-shuffle-96.svg" alt="Спиннер">';
    document.body.append(loadingDiv);
};

const showErrorDiv = (error) => {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error");
    errorDiv.innerHTML = `<strong>Ошибка получения данных с сервера: ${error.message}</strong>`;
    document.body.append(errorDiv);
};

const showNoDataDiv = () => {
    const emptyDiv = document.createElement("div");
    emptyDiv.classList.add("empty");
    emptyDiv.innerHTML = "<strong>Нет данных для отображения</strong>";
    document.body.append(emptyDiv);
};

if(isLoading) {
    showLoadingDiv();
};

const deleteLoadingDiv = () => {
    if(loadingDiv) {
        loadingDiv.remove();
    }
};

request(`${baseDBpath}/${dataTable}/records?perPage=${maxItems}`)
    .then( response => {
            if(response.totalItems === 0) {
                showNoDataDiv();
            } else {
                console.log(response);
                console.log(response.items);
                genealogyData = response.items;
                mainTree = keyGraph(genealogyData);
            }
        })
        .catch(e => showErrorDiv(e))
        .finally(() => deleteLoadingDiv());


export default mainTree;