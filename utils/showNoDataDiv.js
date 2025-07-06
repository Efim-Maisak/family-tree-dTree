import firstNodeModal from "../js/modules/firstNodeModals.js";

export const showNoDataDiv = () => {
    const noDataDiv = document.createElement("div");
    noDataDiv.classList.add("add-first-node");
    noDataDiv.innerHTML = `<div class="add-first-node-leftfake"></div><div class="add-first-node-cntr"><p>Давайте добавим первого родственника в семейное древо.</p><buton class="add-first-node-btn">Добавить</button></div><div class="add-first-node-rightfake"></div>`;
    document.body.append(noDataDiv);

    firstNodeModal();
};