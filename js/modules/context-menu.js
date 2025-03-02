
const conextMenu = (name, extra) => {
    const contextMenu = document.querySelector(".context-menu");

    const parentMenuItem = `<div class="context-menu-item" data-action="add-parent">Добавить родителя</div>`;
    const childMenuItem = `<div class="context-menu-item" data-action="add-child">Добавить ребенка</div>`;
    const spouseMenuItem = `<div class="context-menu-item" data-action="add-spouse">Добавить супруга</div>`;

    let menuItems = [childMenuItem];

    if(!contextMenu) {
        return;
    }

    const event = d3.event;
    if(!event) {
        return;
    }

    event.preventDefault();

    if(extra.parents == null || extra.parents.parents.length < 2) {
        menuItems.unshift(parentMenuItem);
    }

    if(extra.partner == null) {
        menuItems.push(spouseMenuItem);
    }

    contextMenu.innerHTML = menuItems.join("");

    // Устанавливаем позицию меню
    contextMenu.style.position = "absolute";
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.style.display = "block";

    // Функция для закрытия меню при клике вне него и вне узлов
    function closeContextMenu(e) {
        const isClickInsideMenu = contextMenu.contains(e.target);
        const isClickOnNode = e.target.closest(".node"); // Проверяем, кликнули ли на ноду

        if (!isClickInsideMenu && !isClickOnNode) {
            contextMenu.style.display = "none";
            document.removeEventListener("click", closeContextMenu);
        }
    }

    // Добавляем обработчик клика для закрытия меню
    setTimeout(() => {
        document.addEventListener("click", closeContextMenu);
    }, 0);

    // Добавляем обработчики кликов по пунктам меню
    contextMenu.querySelectorAll(".context-menu-item").forEach((item) => {
        item.addEventListener("click", (e) => {
            const action = e.target.dataset.action;
            contextMenu.style.display = "none";

            if(action === "add-parent") {
                console.log(`Добавление родителя для ${name}`);
            }else if (action === "add-child") {
                console.log(`Добавление ребенка для ${name}`);
            }else if (action === "add-spouse") {
                console.log(`Добавление супруга для ${name}`);
            }
        });
    });

};

export default conextMenu;
