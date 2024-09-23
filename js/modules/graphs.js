import modals from "./modals.js";
import mainTree from "../script.js";
import searchPearsonList from "./search-person-list.js";
import { changeInfoIsLivingPerson } from "../../utils/changeInfoIsLivingPerson.js";
import { changePersonPortret } from "../../utils/changePersonPortet.js";
import { filterMainTreePerson } from "../../utils/filterMainTreePerson.js";
import { keyGraph } from "./main-graph.js";
import { zoomControl } from "../../utils/zoomControl.js";
import { genealogyData } from "../script.js";
import { filteredSpouseFamily } from "./main-graph.js";


let pageWidth = window.innerWidth;
let pageHeight = window.innerHeight;

const modalControls = modals();
const { removeZoomListener } = zoomControl();
let spouseTree = null;


const graphs = (elementId, treeData) => {
    const spouseGraph = document.querySelector(elementId);
    const spouseGraphButton = document.querySelector(".popup_bottom__button");
    const spouseGraphClose = document.querySelector(".graph-spouse_close");

    const generateSpouseGraph = () => {

        d3.select(elementId).select("svg").remove();

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
                    document.getElementById('place-birth').textContent = extra.birthPlace || "неизвестно";
                    document.getElementById('person-info').innerHTML = extra.information || "информация отсутствует";
                    document.querySelector(".popup_bottom").style.display = "none";
                    changeInfoIsLivingPerson(extra);
                    changePersonPortret(extra);
                    modalControls.openModal();
                },
                nodeRightClick: function(name, extra) {
                    alert('Right-click: ' + name);
                },
                textRenderer: function(name, extra, textClass) {
                    var text = "<div style='width: 120px; padding: 5px; word-wrap: break-word;'>";
                    text += "<p align='center' class='" + textClass + "' style='margin-bottom: 5px; font-weight: bold;'>" + name + "</p>";
                    if(name == "неизвестно") {
                        return text;
                    }
                    if (extra) {
                        text += "<p align='center' style='margin-bottom: 3px;'>" + (extra.birthDate || '') + " - " + (extra.deathDate || '') + "</p>";
                        if (extra.birthPlace) text += "<p align='center'>" + extra.birthPlace + "</p>";
                    }
                    return text;
                }
            }
        });
    }

    const graphOpen = () => {
        modalControls.closeModal();
        d3.select("#graph").select("svg").remove();
        spouseGraph.style.cssText = `position: fixed; top: 0; left: 0; width: ${pageWidth}px; height: ${pageHeight}px; z-index: 100;`;
        spouseGraphClose.style.display = "block";
        generateSpouseGraph();
        removeZoomListener();
        zoomControl(spouseTree, elementId);
        searchPearsonList(filteredSpouseFamily, spouseTree);
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
                searchPearsonList(filterMainTreePerson(genealogyData), newMainTree);
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