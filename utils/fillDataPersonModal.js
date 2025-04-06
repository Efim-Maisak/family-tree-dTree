import graphs from "../js/modules/graphs.js";
import { filterSpouseFamily } from "../../utils/filterSpouseFamily.js";
import { convertToDTreeFormat } from "./convertToDTreeFormat.js";
import { genealogyData } from "../js/script.js";
import { treeMainFamily } from "../js/script.js";


export let filteredSpouseFamily;

const fillDataPersonModal = (name, extra) => {
    const personNameEl = document.getElementById('person-name');
    const personGenderEl = document.getElementById('person-gender');
    const personBirthEl = document.getElementById('person-birth');
    const personInfoEl = document.getElementById('person-info');
    const placeBirthEl = document.getElementById('place-birth');
    const popupBottomEl = document.querySelector('.popup_bottom');
    const popupBottomBtnEl = document.querySelector('.popup_bottom__button');

    if (personNameEl) personNameEl.textContent = name;
    if (personGenderEl) personGenderEl.textContent = name === "неизвестно" ? "?" : (extra.gender === "M" ? "М" : "Ж");
    if (personBirthEl) personBirthEl.textContent = `${extra.birthDate || "неизвестный "} г.`;
    if (personInfoEl) personInfoEl.innerHTML = extra.information || "информация отсутствует";
    if (placeBirthEl) {
        placeBirthEl.textContent = extra.birthPlace || "неизвестно";
        if(extra.coordinates) {
            placeBirthEl.href = `https://www.google.com/maps/@${extra.coordinates},10z?q=${extra.coordinates}`;
            placeBirthEl.style.textDecoration = "underline";
            placeBirthEl.style.pointerEvents = "";
        } else {
            placeBirthEl.style.pointerEvents = "none";
            placeBirthEl.style.textDecoration = "none";
        };
    };

    if(extra.gender === "F" && extra.partner && !extra.name.includes(treeMainFamily) && popupBottomEl && popupBottomBtnEl) {
        popupBottomEl.style.display = "block";
        popupBottomBtnEl.textContent = `Показать древо ${name.split(" ")[0]}`;
        if(genealogyData && genealogyData.length > 0) {
            filteredSpouseFamily = filterSpouseFamily(genealogyData, extra.id);
            graphs("#graph-spouse", convertToDTreeFormat(filteredSpouseFamily));
        }
    } else if(popupBottomEl) {
        popupBottomEl.style.display = "none";
    }
};

export default fillDataPersonModal;