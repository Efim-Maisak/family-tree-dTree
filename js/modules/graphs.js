import modals from "./modals.js";
import searchPearsonList from "./search-person-list.js";
import { changeInfoIsLivingPerson } from "../../utils/changeInfoIsLivingPerson.js";
import { changePersonPortret } from "../../utils/changePersonPortet.js";
import { filterMainTreePerson } from "../../utils/filterMainTreePerson.js";
import { zoomControl } from "../../utils/zoomControl.js";
import { fillPersonsWithNodeId } from "../../utils/fillPersonsWithNodeId.js";
import { keyGraph } from "./main-graph.js";
import editPerson from "./edit-person.js";
import { filteredSpouseFamily } from  "../../utils/fillDataPersonModal.js";
import { genealogyDataWithNodeId } from "./main-graph.js";
import contextMenu from "./context-menu.js";
import extractYear from "../../utils/extractYear.js";
import { genealogyData } from "../script.js";
import { pb } from "../../services/pocketbase-service.js";


export let spouseFamilyDataWithNodeId = [];
const modalControls = modals();
const { removeZoomListener } = zoomControl();
const { removeHandlers } = searchPearsonList();
let lastClickedSpouseNodeTime = new Date().getTime();
let graphRootNodeExtra; // данные ноды на которой сформировали вторичное дерево

let pageWidth = window.innerWidth;
let pageHeight = window.innerHeight;


const graphs = (elementId, treeData, rootNodeExtra = null) => {
    graphRootNodeExtra = rootNodeExtra;

    const spouseGraph = document.querySelector(elementId);
    const spouseGraphButton = document.querySelector(".popup_bottom__button");
    const spouseGraphClose = document.querySelector(".graph-spouse_close");

    const generateSpouseGraph = () => {

        return new Promise((resolve, reject) => {
            try {
                let spouseTree = null;
                d3.select(elementId).select("svg").remove();
                spouseFamilyDataWithNodeId = [];

                spouseTree = dTree.init(treeData, {
                    target: elementId,
                    debug: true,
                    hideMarriageNodes: true,
                    marriageNodeSize: 5,
                    height: pageHeight,
                    width: pageWidth,
                    nodeWidth: 130,
                    margin: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                      },
                      styles: {
                        node: 'node',
                        linage: 'linage',
                        marriage: 'marriage',
                        text: 'nodeText'
                      },
                    callbacks: {
                        nodeClick: function(name, extra) {
                            document.getElementById('person-name').textContent = name;
                            document.getElementById('person-gender').textContent = name === "неизвестно" ? "?" : (extra.gender === "M" ? "М" : "Ж");
                            document.getElementById('person-birth').textContent = `${extra.birthDate || "неизвестный "} г.`;
                            document.getElementById('person-info').innerHTML = extra.information || "информация отсутствует";
                            document.querySelector(".popup_bottom").style.display = "none";
                            const placeBirthElem =  document.getElementById("place-birth");
                            placeBirthElem.textContent = extra.birthPlace || "неизвестно";
                            if(extra.coordinates) {
                                placeBirthElem.href = `https://www.google.com/maps/@${extra.coordinates},10z?q=${extra.coordinates}`;
                                placeBirthElem.style.textDecoration = "underline";
                                placeBirthElem.style.pointerEvents = "";
                            } else {
                                placeBirthElem.style.pointerEvents = "none";
                                placeBirthElem.style.textDecoration = "none";
                            };
                            changeInfoIsLivingPerson(extra);
                            changePersonPortret(extra);
                            lastClickedSpouseNodeTime = new Date().getTime();
                            editPerson(extra, lastClickedSpouseNodeTime, pb);
                            modalControls.openModal();
                        },
                        nodeRightClick: function(name, extra) {
                            contextMenu(name, extra, false, graphRootNodeExtra);
                        },
                        textRenderer: function(name, extra, textClass) {
                            var text = "<div style='width: 120px; padding: 5px; word-wrap: break-word;'>";
                            text += "<p align='center' class='" + textClass + "' style='margin-bottom: 5px; font-weight: bold;'>" + name + "</p>";
                            if(name == "неизвестно") {
                                return text;
                            }
                            if (extra) {
                                text += "<p align='center' style='margin-bottom: 3px;'>" + (extra.birthDate || '') + " - " + (extra.deathDate || '') + "</p>";
                                if (extra.birthPlace === "" || extra.birthPlace == null) {
                                    text += "<p align='center'>м.р. неизвестно</p>";
                                } else {
                                    text += `<p align='center'>${extra.birthPlace}</p>`;
                                }
                            }
                            return text;
                        },
                        nodeRenderer: function(name, x, y, height, width, extra, id, nodeClass, textClass, textRenderer) {
                            spouseFamilyDataWithNodeId = fillPersonsWithNodeId(spouseFamilyDataWithNodeId, filteredSpouseFamily, extra, id);
                            let node = '';
                            node += '<div ';
                            node += 'style="height:100%;width:100%;" ';
                            node += 'class="' + nodeClass + '" ';
                            node += 'id="node' + id + '">\n';
                            node += textRenderer(name, extra, textClass);
                            node += '</div>';
                            return node;
                        },
                        nodeSorter: function(aName, aExtra, bName, bExtra) {
                            const aYear = extractYear(aExtra.birthDate);
                            const bYear = extractYear(bExtra.birthDate);

                            if (aYear === null && bYear === null) return 0;
                            if (aYear === null) return 1;
                            if (bYear === null) return -1;

                            return aYear - bYear;
                        }
                    }
                });
                resolve(spouseTree);
            } catch(error) {
                reject(error)
            }
        });
    };

    const graphOpen = () => {
        modalControls.closeModal();
        d3.select("#graph").select("svg").remove();
        spouseGraph.style.cssText = `position: fixed; top: 0; left: 0; width: ${pageWidth}px; height: ${pageHeight}px; z-index: 100;`;
        spouseGraphClose.style.display = "block";
        generateSpouseGraph()
        .then( spouseTree => {
            removeZoomListener();
            zoomControl(spouseTree, elementId);
            removeHandlers();
            searchPearsonList(filteredSpouseFamily, spouseTree, spouseFamilyDataWithNodeId);
        });
    };

    const graphClose = () => {
        spouseGraph.style.cssText = "";
        d3.select(elementId).select("svg").remove();
        spouseGraphClose.style.display = "none";
        d3.select("#graph").select("svg").remove();
        if(genealogyData && genealogyData.length > 0) {
            keyGraph(genealogyData)
            .then(tree => {
                const newMainTree = tree;
                removeHandlers();
                searchPearsonList(filterMainTreePerson(genealogyData), newMainTree, genealogyDataWithNodeId);
                removeZoomListener();
                zoomControl(newMainTree, "#graph");
            });
        }
    };

    spouseGraphButton.addEventListener("click", graphOpen);
    spouseGraphClose.addEventListener("click", graphClose);

    return {
        graphOpen,
        graphClose
    };
};


export default graphs;