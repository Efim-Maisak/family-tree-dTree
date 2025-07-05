import modals from "./modals.js";
import editPerson from "./edit-person.js";
import { convertToDTreeFormat } from "../../utils/convertToDTreeFormat.js";
import { changeInfoIsLivingPerson } from "../../utils/changeInfoIsLivingPerson.js";
import { changePersonPortret } from "../../utils/changePersonPortet.js";
import { filterMainTreePerson } from "../../utils/filterMainTreePerson.js";
import { fillPersonsWithNodeId } from "../../utils/fillPersonsWithNodeId.js";
import { zoomControl } from "../../utils/zoomControl.js";
import contextMenu from "./context-menu.js";
import { pb } from "../../services/pocketbase-service.js";
import fillDataPersonModal from "../../utils/fillDataPersonModal.js";
import extractYear from "../../utils/extractYear.js";


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
                        fillDataPersonModal(name, extra);
                        changeInfoIsLivingPerson(extra);
                        changePersonPortret(extra);
                        lastClickedNodeTime = new Date().getTime();
                        editPerson(extra, lastClickedNodeTime, pb);
                        modalControls.openModal();
                    },
                    nodeRightClick: function(name, extra) {
                        contextMenu(name, extra, true);
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
                        genealogyDataWithNodeId = fillPersonsWithNodeId(genealogyDataWithNodeId, extra, id);
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
            zoomControl(mainTree, "#graph");
            resolve(mainTree);

        } catch(error) {
            reject(error);
        }
    });
};