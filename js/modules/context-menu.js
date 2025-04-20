import contextMenuModals from "./contextMenuModals.js";


const contextMenu = (name, extra, isMain) => {
    const modalControls = contextMenuModals(isMain);

    const contextMenu = document.querySelector(".context-menu");
    const parentMenuItem = `<div class="context-menu-item" data-action="add-parent">Добавить родителя</div>`;
    const childMenuItem = `<div class="context-menu-item" data-action="add-child">Добавить ребенка</div>`;
    const spouseMenuItem = `<div class="context-menu-item" data-action="add-spouse">Добавить ${extra.gender == "M" ? "супругу" : "супруга"}</div>`;
    let menuItems = [childMenuItem];

    if(!contextMenu) {
        console.warn("Контекстное меню не найдено");
        return;
    }

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