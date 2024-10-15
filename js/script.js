import httpService from "../services/http.js";
import { baseDBpath } from "../config/apiConfig.js";
import { dataTable } from "../config/apiConfig.js";
import { maxItems } from "../config/apiConfig.js";
import { keyGraph } from "./modules/main-graph.js";
import { filterMainTreePerson } from "../utils/filterMainTreePerson.js";
import { genealogyDataWithNodeId } from "./modules/main-graph.js";
import searchPearsonList from "./modules/search-person-list.js";
import { showLoadingDiv } from "../utils/showLoadingDiv.js";
import { showErrorDiv } from "../utils/showErrorDiv.js";
import { showNoDataDiv } from "../utils/showNoDataDiv.js";
import { deleteLoadingDiv } from "../utils/deleteLoadingDiv.js";


export let genealogyData = [];
export let treeMainFamily = null;
const { request, isLoading } = httpService();
const loadingDiv = document.createElement("div");
let mainTree = null;


if(isLoading) {
    showLoadingDiv(loadingDiv);
};

request(`${baseDBpath}/${dataTable}/records?perPage=${maxItems}`)
    .then( response => {
            if(response.totalItems === 0) {
                showNoDataDiv();
            } else {
                console.log(response);
                console.log(response.items);
                genealogyData = response.items;

                const treeMainFamilyNode = genealogyData.find( item => {
                     return item.key_node === true;
                });
                treeMainFamily = treeMainFamilyNode.name.split(" ")[0];

                keyGraph(genealogyData)
                    .then(tree => {
                        mainTree = tree;
                        searchPearsonList(filterMainTreePerson(genealogyData), mainTree, genealogyDataWithNodeId);
                    })
                    .catch( error => {
                        throw new Error("Ошибка инициализации дерева: ", error);
                    })
            }
        })
        .catch(e => showErrorDiv(e))
        .finally(() => deleteLoadingDiv(loadingDiv));


export default mainTree;