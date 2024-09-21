import graphs from "./graphs.js";
import modals from "./modals.js";
import { convertToDTreeFormat } from "../../utils/convertToDTreeFormat.js";
import { changeInfoIsLivingPerson } from "../../utils/changeInfoIsLivingPerson.js";
import { changePersonPortret } from "../../utils/changePersonPortet.js";
import { filterSpouseFamily } from "../../utils/filterSpouseFamily.js";
import { genealogyData } from "../script.js";
import { zoomControl } from "../../utils/zoomControl.js";


let mainTree;

export const keyGraph = (treeData) => {

    let pageWidth = window.innerWidth;
    let pageHeight = window.innerHeight;

    const modalControls = modals();

    mainTree = dTree.init( convertToDTreeFormat(treeData), {
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
                document.getElementById('place-birth').textContent = extra.birthPlace || "неизвестно";
                document.getElementById('person-info').innerHTML = extra.information || "информация отсутствует";
                if(extra.gender === "F" && extra.partner) {
                    document.querySelector(".popup_bottom").style.display = "block";
                    if(genealogyData && genealogyData.length > 0) {
                        graphs("#graph-spouse", convertToDTreeFormat(filterSpouseFamily(genealogyData, extra.id)));
                    }
                } else {
                    document.querySelector(".popup_bottom").style.display = "none";
                }
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
            },
            marriageClick: function(extra, id) {
                alert('Clicked marriage node ' + id);
            },
            marriageRightClick: function(extra, id) {
                alert('Right-clicked marriage node ' + id);
            },
        }
    });
    zoomControl(mainTree, "#graph");
};