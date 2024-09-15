import httpService from "../services/http.js";
import { convertToDTreeFormat } from "../utils/convertToDTreeFormat.js";
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
                let treeData = convertToDTreeFormat(genealogyData);
                mainTree = keyGraph(genealogyData);
                // mainTree = dTree.init(treeData, {
                //     target: "#graph",
                //     debug: true,
                //     hideMarriageNodes: true,
                //     marriageNodeSize: 5,
                //     height: pageHeight,
                //     width: pageWidth,
                //     nodeWidth: 130,
                //     margin: {
                //         top: 0,
                //         right: 0,
                //         bottom: 0,
                //         left: 0
                //       },
                //       styles: {
                //         node: 'node',
                //         linage: 'linage',
                //         marriage: 'marriage',
                //         text: 'nodeText'
                //       },
                //     callbacks: {
                //         nodeClick: function(name, extra) {
                //             document.getElementById('person-name').textContent = name;
                //             document.getElementById('person-gender').textContent = name === "неизвестно" ? "?" : (extra.gender === "M" ? "М" : "Ж");
                //             document.getElementById('person-birth').textContent = `${extra.birthDate || "неизвестный "} г.`;
                //             document.getElementById('place-birth').textContent = extra.birthPlace || "неизвестно";
                //             document.getElementById('person-info').innerHTML = extra.information || "информация отсутствует";
                //             if(extra.gender === "F" && extra.partner) {
                //                 document.querySelector(".popup_bottom").style.display = "block";
                //                 console.log(filterSpouseFamily(genealogyData, name));
                //                 console.log(filterSpouseFamily(genealogyData, extra.id));
                //                 graphs("#graph-spouse", convertToDTreeFormat(filterSpouseFamily(genealogyData, extra.id)));
                //             } else {
                //                 document.querySelector(".popup_bottom").style.display = "none";
                //             }
                //             changeInfoIsLivingPerson(extra);
                //             changePersonPortret(extra);
                //             modalControls.openModal();
                //         },
                //         nodeRightClick: function(name, extra) {
                //             alert('Right-click: ' + name);
                //         },
                //         textRenderer: function(name, extra, textClass) {
                //             var text = "<div style='width: 120px; padding: 5px; word-wrap: break-word;'>";
                //             text += "<p align='center' class='" + textClass + "' style='margin-bottom: 5px; font-weight: bold;'>" + name + "</p>";
                //             if(name == "неизвестно") {
                //                 return text;
                //             }
                //             if (extra) {
                //                 text += "<p align='center' style='margin-bottom: 3px;'>" + (extra.birthDate || '') + " - " + (extra.deathDate || '') + "</p>";
                //                 if (extra.birthPlace) text += "<p align='center'>" + extra.birthPlace + "</p>";
                //             }
                //             return text;
                //         },
                //         marriageClick: function(extra, id) {
                //             alert('Clicked marriage node ' + id);
                //         },
                //         marriageRightClick: function(extra, id) {
                //             alert('Right-clicked marriage node ' + id);
                //         },
                //     }
                // });
                //zoomControl(mainTree);
            }
        })
        .catch(e => showErrorDiv(e))
        .finally(() => deleteLoadingDiv());

export default mainTree;