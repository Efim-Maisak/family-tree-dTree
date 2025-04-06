import contextMenuModals from "./contextMenuModals.js";
import { changePersonPortret } from "../../utils/changePersonPortet.js";

const contextMenu = (name, extra) => {
    const modalControls = contextMenuModals();

    const contextMenu = document.querySelector(".context-menu");

    if(!contextMenu) {
        console.warn("Контекстное меню не найдено");
        return;
    }

    const parentMenuItem = `<div class="context-menu-item" data-action="add-parent">Добавить родителя</div>`;
    const childMenuItem = `<div class="context-menu-item" data-action="add-child">Добавить ребенка</div>`;
    const spouseMenuItem = `<div class="context-menu-item" data-action="add-spouse">Добавить супруга</div>`;

    let menuItems = [childMenuItem];

    const event = d3.event || window.event;
    if(!event) {
        console.warn("Событие для контекстного меню не найдено");
        return;
    };

    event.preventDefault();
    event.stopPropagation();

    if(name == "неизвестно") {
        return;
    };

    if(extra.parents == null || extra.parents.parents.length < 2) {
        menuItems.unshift(parentMenuItem);
    };

    if(extra.partner == null) {
        menuItems.push(spouseMenuItem);
    };

    // Очищаем предыдущий контент
    contextMenu.innerHTML = menuItems.join("");

    // Устанавливаем позицию меню
    contextMenu.style.position = "absolute";
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.style.display = "block";

    // Сохранем ссылку на функцию closeContextMenu чтобы удлить ее позже
    if(window.currentCloseHandler) {
        document.removeEventListener("click", window.currentCloseHandler);
    }

    // Функция для закрытия меню при клике вне него и вне узлов
    function closeContextMenu(e) {
        const isClickInsideMenu = contextMenu.contains(e.target);
        const isClickOnNode = e.target.closest(".node"); // Проверяем, кликнули ли на ноду

        if (!isClickInsideMenu && !isClickOnNode) {
            contextMenu.style.display = "none";
            document.removeEventListener("click", closeContextMenu);
            window.currentCloseHandler = null;
        }
    };

    // Сохраняем текущий обработчик закрытия меню
    window.currentCloseHandler = closeContextMenu;

    // Добавляем обработчик клика для закрытия меню
    setTimeout(() => {
        document.addEventListener("click", closeContextMenu);
    }, 0);

    // Уделяем предыдущие обработчики событий
    const newContextMenu = contextMenu.cloneNode(true);
    contextMenu.parentNode.replaceChild(newContextMenu, contextMenu);

    // Добавляем заново обработчики событий клика на меню
    newContextMenu.querySelectorAll(".context-menu-item").forEach((item) => {
        item.addEventListener("click", (e) => {
            const action = e.target.dataset.action;
            newContextMenu.style.display = "none";

            // Удаляем глобальный обработчик
            if (window.currentCloseHandler) {
                document.removeEventListener("click", window.currentCloseHandler);
                window.currentCloseHandler = null;
            }

            if(action === "add-parent") {
                console.log(`Добавление родителя для ${name}`);
                modalControls.openModal("addParent", extra);
            } else if (action === "add-child") {
                console.log(`Добавление ребенка для ${name}`);
                modalControls.openModal("addChild", extra);
            } else if (action === "add-spouse") {
                console.log(`Добавление супруга для ${name}`);
                modalControls.openModal("addSpouse", extra);
                changePersonPortret(extra);
            }
        });
    });
};

export default contextMenu;