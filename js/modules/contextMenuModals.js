import { calcScroll } from "../../utils/calcScroll.js";

const contextMenuModals = () => {
    const modalElement = document.getElementById("modal");
    const modalContent = modalElement.querySelector(".popup_content");
    const modalContentHTML = modalContent.innerHTML;
    const scrollWidth = calcScroll();

    // Сохраняем данные модального окна
    let currentModalData = null;

    function openModal(type, data) {
        // Сохраняем данные
        currentModalData = data;

        // Отображаем модальное окно
        modalElement.style.display = "flex";
        modalContent.style.display = "block";
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollWidth}px`;

        // Генерируем содержимое в зависимости от типа
        switch(type) {
            case "addSpouse":
                renderAddSpouseModal(data);
                break;
            case "addParent":
                renderAddParentModal(data);
                break;
            case "addChild":
                renderAddChildModal(data);
                break;
            default:
                console.error("Неизвестный тип модального окна:", type);
                closeModal();
        }
    }

    function renderAddSpouseModal(data) {
        if (!data) return;

        const addingSpouseHTML = `
            <span class="popup_close">&times;</span>
            <h3 class="popup_content__title">${data.name} - добавление супруга</h3>
            <div class="photo-wrapper">
                <img alt="портрет" class="person-photo">
                <div class="photo-overlay" style="display: none;">Загрузить фото</div>
            </div>
            <div class="popup_content__add-spouse">
                <label for="person-name-input">Имя:</label>
                <input type="text" id="person-name-input" autocomplete="off" autocorrect="off">
                <label for="person-gender-select">Пол:</label>
                <select id="person-gender-select">
                    <option value="M">М</option>
                    <option value="F">Ж</option>
                </select>
                <label for="person-birth-input">Дата рождения:</label>
                <input type="text" id="person-birth-input" autocomplete="off" autocorrect="off">
                <label for="person-death-input">Дата смерти:</label>
                <input type="text" id="person-death-input" autocomplete="off" autocorrect="off">
                <label for="place-birth-input">Место рождения:</label>
                <input type="text" id="place-birth-input" autocomplete="off" autocorrect="off">
                <label for="coordinates-input">Координаты места рождения (широта, долгота):</label>
                <input type="text" id="coordinates-input" autocomplete="off" autocorrect="off">
                <label for="place-death-input">Место смерти:</label>
                <input type="text" id="place-death-input" autocomplete="off" autocorrect="off">
                <div class="toggle-container">
                    <span class="toggle-label">Жив:</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="isLivingToggle" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="toggle-container">
                    <span class="toggle-label">Корневая нода:</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="isKeyNode">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <label for="person-info-input">Общая информация:</label>
                <div tabindex="0" id="person-info-input"></div>
            </div>
            <div class="edit-buttons">
                <button class="save-button">Сохранить</button>
                <button class="cancel-button">Отмена</button>
            </div>
        `;

        modalContent.innerHTML = addingSpouseHTML;
        setupEventListeners("addSpouse");
    }

    function renderAddParentModal(data) {
        if (!data) return;

        const addingParentHTML = `
            <span class="popup_close">&times;</span>
            <h3 class="popup_content__title">${data.name} - добавление родителя</h3>
            <!-- Аналогичные поля как в addSpouse, но с соответствующими изменениями -->
            <div class="photo-wrapper">
                <img alt="портрет" class="person-photo">
                <div class="photo-overlay" style="display: none;">Загрузить фото</div>
            </div>
            <div class="popup_content__add-parent">
                <label for="person-name-input">Имя:</label>
                <input type="text" id="person-name-input" autocomplete="off" autocorrect="off">
                <label for="person-gender-select">Пол:</label>
                <select id="person-gender-select">
                    <option value="M">М</option>
                    <option value="F">Ж</option>
                </select>
                <!-- Остальные поля -->
            </div>
            <div class="edit-buttons">
                <button class="save-button">Сохранить</button>
                <button class="cancel-button">Отмена</button>
            </div>
        `;

        modalContent.innerHTML = addingParentHTML;
        setupEventListeners("addParent");
    }

    function renderAddChildModal(data) {
        if (!data) return;

        const addingChildHTML = `
            <span class="popup_close">&times;</span>
            <h3 class="popup_content__title">${data.name} - добавление ребенка</h3>
            <!-- Аналогичные поля как в addSpouse, но с соответствующими изменениями -->
            <div class="photo-wrapper">
                <img alt="портрет" class="person-photo">
                <div class="photo-overlay" style="display: none;">Загрузить фото</div>
            </div>
            <div class="popup_content__add-child">
                <label for="person-name-input">Имя:</label>
                <input type="text" id="person-name-input" autocomplete="off" autocorrect="off">
                <label for="person-gender-select">Пол:</label>
                <select id="person-gender-select">
                    <option value="M">М</option>
                    <option value="F">Ж</option>
                </select>
                <!-- Остальные поля -->
            </div>
            <div class="edit-buttons">
                <button class="save-button">Сохранить</button>
                <button class="cancel-button">Отмена</button>
            </div>
        `;

        modalContent.innerHTML = addingChildHTML;
        setupEventListeners("addChild");
    }

    function setupEventListeners(modalType) {
        // Обработчик для кнопки закрытия
        const closeElement = modalContent.querySelector(".popup_close");
        if (closeElement) {
            closeElement.addEventListener("click", handleClose);
        }

        // Обработчик для кнопки сохранения
        const saveButton = modalContent.querySelector(".save-button");
        if (saveButton) {
            saveButton.addEventListener("click", () => {
                handleSave(modalType);
            });
        }

        // Обработчик для кнопки отмены
        const cancelButton = modalContent.querySelector(".cancel-button");
        if (cancelButton) {
            cancelButton.addEventListener("click", handleClose);
        }
    }

    function handleClose() {
        const photoOverlay = document.querySelector(".photo-overlay");
        if (photoOverlay) {
            photoOverlay.style.display = "none";
        }
        closeModal();
    }

    function handleSave(modalType) {
        // Здесь логика сохранения данных в зависимости от типа модального окна
        console.log(`Сохранение данных для ${modalType}:`, currentModalData);

        // Собираем данные из полей формы
        const formData = {
            name: document.getElementById("person-name-input")?.value || "",
            gender: document.getElementById("person-gender-select")?.value || "M",
            birthDate: document.getElementById("person-birth-input")?.value || "",
            deathDate: document.getElementById("person-death-input")?.value || "",
            birthPlace: document.getElementById("place-birth-input")?.value || "",
            coordinates: document.getElementById("coordinates-input")?.value || "",
            deathPlace: document.getElementById("place-death-input")?.value || "",
            isLiving: document.getElementById("isLivingToggle")?.checked || false,
            isKeyNode: document.getElementById("isKeyNode")?.checked || false,
            info: document.getElementById("person-info-input")?.textContent || ""
        };

        console.log("Форма данных:", formData);

        // Тут можно добавить отправку данных или обновление дерева
        // в зависимости от типа модального окна

        closeModal();
    }

    function closeModal() {
        modalElement.style.display = "none";
        modalContent.style.display = "none";
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        modalContent.innerHTML = modalContentHTML; // Восстанавливаем содержимое базового модального окна.
    }

    // Обработчики для закрытия модального окна при клике вне него и нажатии Escape
    function setupGlobalEventListeners() {
        modalElement.addEventListener("click", (event) => {
            if (event.target === modalElement) {
                handleClose();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                handleClose();
            }
        });
    }

    // Инициализация глобальных обработчиков
    setupGlobalEventListeners();

    return { openModal, closeModal };
};

export default contextMenuModals;