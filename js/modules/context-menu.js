import contextMenuModals from "./contextMenuModals.js";
import { treeMainFamily } from "../script.js";
import { pb } from "../../services/pocketbase-service.js";
import toast from "./toast.js";


const contextMenu = (name, extra, isMain, rootNodeExtra = null) => {
    const modalControls = contextMenuModals(isMain);

    const contextMenu = document.querySelector(".context-menu");
    const parentMenuItem = `<div class="context-menu-item" data-action="add-parent">Добавить родителя</div>`;
    const childMenuItem = `<div class="context-menu-item" data-action="add-child">Добавить ребенка</div>`;
    const spouseMenuItem = `<div class="context-menu-item" data-action="add-spouse">Добавить ${extra.gender == "M" ? "супругу" : "супруга"}</div>`;

    let menuItems = [childMenuItem];

    if (contextMenu && pb.authStore.model?.role == "viewer") {
        toast("Недостаточно прав для вызова контекстного меню.", "warning", 4000);
        return;
    };

    if(!contextMenu) {
        console.warn("Контекстное меню не найдено");
        return;
    };

    const event = d3.event || window.event;
    if(!event) {
        console.warn("Событие для контекстного меню не найдено");
        return;
    };

    event.preventDefault();
    event.stopPropagation();


    // Условия отображения пунктов контекстного меню
    if(name == "неизвестно") {
        return;
    };


    if(isMain) {
        if (
        (extra.parents == null || extra.parents.parents.length < 2) &&
        !(
            treeMainFamily !== extra.name.split(" ")[0].trim() &&
            extra.gender !== "F"
        )
        ) {
            menuItems.unshift(parentMenuItem);
        };
    }

    if(extra.partner == null) {
        menuItems.push(spouseMenuItem);
    };


    // Доп. условия отображения контекстного меню для вторичных деревьев
    // - если выбранная нода совпадет с нодой на которой вызвали вторичное дерево или это супруг этой ноды
    if(!isMain && (name === rootNodeExtra.name || extra.id == rootNodeExtra?.partner?.spouse)) {
        if(extra.parents == null || extra.parents.parents.length < 2) {
            menuItems = [parentMenuItem];
        } else {
            return;
        }
    };

    // - если выбранная нода не имеет родителей и она не является супругом женского пола
    if(!isMain && (extra.parents == null || extra.parents.parents.length < 2)) {
        if(!menuItems.includes(parentMenuItem) && extra.gender !== "F") {
            menuItems.unshift(parentMenuItem);
        }
    };

    //- если нода является частью основного дерева и тажже мужского пола
    if(!isMain && extra.isMainTree && extra.gender == "M") {
        return;
    };



    // Очищаем предыдущий контент
    contextMenu.innerHTML = menuItems.join("");

    // Устанавливаем позицию меню
    contextMenu.style.position = "absolute";
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.style.display = "block";

    // Сохраняем ID текущего узла для проверки
    const currentNodeId = extra.id;

    // Удаляем предыдущий обработчик, если он существует
    if(window.currentCloseHandler) {
        document.removeEventListener("click", window.currentCloseHandler);
        window.currentCloseHandler = null;
    }

    // Функция для закрытия меню
    function closeContextMenu(e) {
        const isClickInsideMenu = contextMenu.contains(e.target);
        const clickedNode = e.target.closest(".node");

        // Закрываем меню, если клик был вне меню
        // ИЛИ если клик был на другой ноде (не на той, которая вызвала меню)
        if (!isClickInsideMenu || (clickedNode && !clickedNode.id.includes(currentNodeId))) {
            contextMenu.style.display = "none";
            document.removeEventListener("click", closeContextMenu);
            window.currentCloseHandler = null;
        }
    }

    // Сохраняем текущий обработчик закрытия меню
    window.currentCloseHandler = closeContextMenu;

    // Добавляем обработчик клика для закрытия меню
    setTimeout(() => {
        document.addEventListener("click", closeContextMenu);
    }, 0);

    // Добавляем обработчики событий на пункты меню
    contextMenu.querySelectorAll(".context-menu-item").forEach((item) => {
        item.addEventListener("click", (e) => {
            const action = e.target.dataset.action;
            contextMenu.style.display = "none";

            // Удаляем глобальный обработчик
            if (window.currentCloseHandler) {
                document.removeEventListener("click", window.currentCloseHandler);
                window.currentCloseHandler = null;
            }

            if(action === "add-parent") {
                modalControls.openModal("addParent", extra);
            } else if (action === "add-child") {
                modalControls.openModal("addChild", extra);
            } else if (action === "add-spouse") {
                modalControls.openModal("addSpouse", extra);
            }
        });
    });
};

export default contextMenu;