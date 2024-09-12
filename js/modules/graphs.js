import modals from "./modals.js";
import { changeInfoIsLivingPerson } from "../../utils/changeInfoIsLivingPerson.js";
import { changePersonPortret } from "../../utils/changePersonPortet.js";

const modalControls = modals();

const graphs = (treeData) => {
    const spouseGraph = document.getElementById("graph-spouse");
    const mainGraph = document.getElementById("graph");
    const spouseGraphButton = document.querySelector(".popup_bottom__button");
    const spouseGraphClose = document.querySelector(".graph-spouse_close");

    const generateSpouseGraph = () => {
        dTree.init(treeData, {
            target: "#graph-spouse",
            debug: true,
            hideMarriageNodes: true,
            marriageNodeSize: 5,
            height: 800,
            width: 1200,
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
                },
                marriageClick: function(extra, id) {
                    alert('Clicked marriage node ' + id);
                },
                marriageRightClick: function(extra, id) {
                    alert('Right-clicked marriage node ' + id);
                },
            }
        });
    }

    const graphOpen = () => {
        modalControls.closeModal();
        mainGraph.style.display = "none";
        spouseGraph.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 100;";
        spouseGraphClose.style.display = "block";
        generateSpouseGraph();
    }

    const graphClose = () => {
        spouseGraph.style.cssText = "";
        spouseGraphClose.style.display = "none";
        mainGraph.style.display = "block";
    }

    spouseGraphButton.addEventListener("click", () => {
        graphOpen();
    });

    spouseGraphClose.addEventListener("click", () => {
        graphClose();
    });


    return {
        graphOpen,
        graphClose
    };
};


export default graphs;