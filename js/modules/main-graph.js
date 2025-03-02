import graphs from "./graphs.js";
import modals from "./modals.js";
import editPerson from "./edit-person.js";
import { convertToDTreeFormat } from "../../utils/convertToDTreeFormat.js";
import { changeInfoIsLivingPerson } from "../../utils/changeInfoIsLivingPerson.js";
import { changePersonPortret } from "../../utils/changePersonPortet.js";
import { filterSpouseFamily } from "../../utils/filterSpouseFamily.js";
import { filterMainTreePerson } from "../../utils/filterMainTreePerson.js";
import { fillPersonsWithNodeId } from "../../utils/fillPersonsWithNodeId.js";
import { zoomControl } from "../../utils/zoomControl.js";
import { genealogyData } from "../script.js";
import { treeMainFamily } from "../script.js";
import conextMenu from "./context-menu.js";


export let filteredSpouseFamily;
export let genealogyDataWithNodeId = [];
export let lastClickedNodeTime = null;


export const keyGraph = (treeData) => {

    return new Promise((resolve, reject) => {
        try {
            let mainTree;

            let pageWidth = window.innerWidth;
            let pageHeight = window.innerHeight;

            const modalControls = modals();
            const filteredTreeData = filterMainTreePerson(treeData);

            mainTree = dTree.init( convertToDTreeFormat(filteredTreeData), {
                target: "#graph",
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
                        if(extra.gender === "F" && extra.partner && !extra.name.includes(treeMainFamily)) {
                            document.querySelector(".popup_bottom").style.display = "block";
                            document.querySelector(".popup_bottom__button").textContent = `Показать древо ${name.split(" ")[0]}`;
                            if(genealogyData && genealogyData.length > 0) {
                                filteredSpouseFamily = filterSpouseFamily(genealogyData, extra.id);
                                graphs("#graph-spouse", convertToDTreeFormat(filteredSpouseFamily));
                            }
                        } else {
                            document.querySelector(".popup_bottom").style.display = "none";
                        }
                        changeInfoIsLivingPerson(extra);
                        changePersonPortret(extra);
                        lastClickedNodeTime = new Date().getTime();
                        editPerson(extra, lastClickedNodeTime);
                        modalControls.openModal();
                    },
                    nodeRightClick: function(name, extra) {
                        conextMenu(name, extra);
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
                            genealogyDataWithNodeId = fillPersonsWithNodeId(genealogyDataWithNodeId, filteredTreeData, extra, id);
                            let node = '';
                            node += '<div ';
                            node += 'style="height:100%;width:100%;" ';
                            node += 'class="' + nodeClass + '" ';
                            node += 'id="node' + id + '">\n';
                            node += textRenderer(name, extra, textClass);
                            node += '</div>';
                            return node;
                    }
                }
            });
            zoomControl(mainTree, "#graph");
            resolve(mainTree);

        } catch(error) {
            reject(error);
        }
    });
};