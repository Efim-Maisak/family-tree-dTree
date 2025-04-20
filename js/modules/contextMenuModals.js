import { calcScroll } from "../../utils/calcScroll.js";
import { createQuill } from "./editor.js";
import { validateSendData } from "../../utils/validateSendData.js";
import prepareAddSpouseData from "../../utils/prepareAddSpouseData.js";
import { pb } from "../script.js";

const contextMenuModals = (isMain) => {
    const modalElement = document.getElementById("modal");
    const modalContent = modalElement.querySelector(".popup_content");
    const modalContentHTML = modalContent.innerHTML;
    const scrollWidth = calcScroll();

    let quillEditor = null;
    let currentModalExtra = null;

    function openModal(type, data) {
        // Сохраняем данные о человеке из node extra
        currentModalExtra = data;

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
    };

    function renderAddSpouseModal(data) {
        if (!data) return;

        const addingSpouseHTML = `
            <span class="popup_close">&times;</span>
            <h3 class="popup_content__title" style="margin-right: 48px; margin-bottom: 24px;">${data.name} - добавление ${data.gender == "M" ? "супруги" : "супруга"}</h3>
            <div class="popup_content__add-spouse">
                <label for="person-name-input" style="display: block; margin-top: 8px;">Фамилия, имя, отчество:</label>
                <p style=" font-style: italic; color: gray;">${data.gender == "M" ? "Желательно указывать девичью фамилию" : ""}<p>
                <input type="text" id="person-name-input" autocomplete="off" autocorrect="off">
                <label for="person-gender-select" style="display: block; margin-top: 16px;">Пол:</label>
                <select id="person-gender-select">
                    <option value="M">М</option>
                    <option value="F">Ж</option>
                </select>
                <label for="person-birth-input" style="display: block; margin-top: 16px;">Дата рождения:</label>
                <input type="text" id="person-birth-input" autocomplete="off" autocorrect="off">
                <label for="person-death-input" style="display: block; margin-top: 16px;">Дата смерти:</label>
                <input type="text" id="person-death-input" autocomplete="off" autocorrect="off">
                <label for="place-birth-input" style="display: block; margin-top: 16px;">Место рождения:</label>
                <input type="text" id="place-birth-input" autocomplete="off" autocorrect="off">
                <label for="coordinates-input" style="display: block; margin-top: 16px;">Координаты места рождения (широта, долгота):</label>
                <p style=" font-style: italic; color: gray;">Вставьте координаты скопированные из google maps<p>
                <input type="text" id="coordinates-input" autocomplete="off" autocorrect="off">
                <label for="place-death-input" style="display: block; margin-top: 16px;">Место смерти:</label>
                <input type="text" id="place-death-input" autocomplete="off" autocorrect="off">
                <div class="toggle-container">
                    <span class="toggle-label">Жив:</span>
                    <label class="toggle-switch" style="display: block; margin-top: 16px;">
                        <input type="checkbox" id="isLivingToggle" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <label for="person-info-input" style="display: block; margin-top: 16px;">Общая информация:</label>
                <div tabindex="0" id="added-person-info-input" style="margin-top: 6px;"></div>
            </div>
            <div class="edit-buttons" style="margin-top: 32px;">
                <button class="save-button">Сохранить</button>
                <button class="cancel-button">Отмена</button>
            </div>
        `;

        modalContent.innerHTML = addingSpouseHTML;
        setupEventListeners("addSpouse");
    };

    function renderAddParentModal(data) {
        if (!data) return;

        const addingParentHTML = `
            <span class="popup_close">&times;</span>
            <h3 class="popup_content__title" style="margin-right: 48px; margin-bottom: 24px;">${data.name} - добавление родителя</h3>
            <div class="popup_content__add-spouse">
                <label for="person-name-input" style="display: block; margin-top: 8px;">Фамилия, имя, отчество:</label>
                <input type="text" id="person-name-input" autocomplete="off" autocorrect="off">
                <label for="person-gender-select" style="display: block; margin-top: 16px;">Пол:</label>
                <select id="person-gender-select">
                    <option value="M">М</option>
                    <option value="F">Ж</option>
                </select>
                <label for="person-birth-input" style="display: block; margin-top: 16px;">Дата рождения:</label>
                <input type="text" id="person-birth-input" autocomplete="off" autocorrect="off">
                <label for="person-death-input" style="display: block; margin-top: 16px;">Дата смерти:</label>
                <input type="text" id="person-death-input" autocomplete="off" autocorrect="off">
                <label for="place-birth-input" style="display: block; margin-top: 16px;">Место рождения:</label>
                <input type="text" id="place-birth-input" autocomplete="off" autocorrect="off">
                <label for="coordinates-input" style="display: block; margin-top: 16px;">Координаты места рождения (широта, долгота):</label>
                <p style=" font-style: italic; color: gray;">Вставьте координаты скопированные из google maps<p>
                <input type="text" id="coordinates-input" autocomplete="off" autocorrect="off">
                <label for="place-death-input" style="display: block; margin-top: 16px;">Место смерти:</label>
                <input type="text" id="place-death-input" autocomplete="off" autocorrect="off">
                <div class="toggle-container">
                    <span class="toggle-label">Жив:</span>
                    <label class="toggle-switch" style="display: block; margin-top: 16px;">
                        <input type="checkbox" id="isLivingToggle" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="toggle-container">
                    <span class="toggle-label">Корневая нода:</span>
                    <label class="toggle-switch" style="display: block; margin-top: 16px;">
                        <input type="checkbox" id="isKeyNode">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <label for="person-info-input" style="display: block; margin-top: 16px;">Общая информация:</label>
                <div tabindex="0" id="added-person-info-input" style="margin-top: 6px;"></div>
            </div>
            <div class="edit-buttons" style="margin-top: 32px;">
                <button class="save-button">Сохранить</button>
                <button class="cancel-button">Отмена</button>
            </div>
        `;

        modalContent.innerHTML = addingParentHTML;
        setupEventListeners("addParent");
    };

    function renderAddChildModal(data) {
        if (!data) return;

        const addingChildHTML = `
            <span class="popup_close">&times;</span>
            <h3 class="popup_content__title" style="margin-right: 48px; margin-bottom: 24px;">${data.name} - добавление ребенка</h3>
            <div class="popup_content__add-spouse">
                <label for="person-name-input" style="display: block; margin-top: 8px;">Фамилия, имя, отчество:</label>
                <input type="text" id="person-name-input" autocomplete="off" autocorrect="off">
                <label for="person-gender-select" style="display: block; margin-top: 16px;">Пол:</label>
                <select id="person-gender-select">
                    <option value="M">М</option>
                    <option value="F">Ж</option>
                </select>
                <label for="person-birth-input" style="display: block; margin-top: 16px;">Дата рождения:</label>
                <input type="text" id="person-birth-input" autocomplete="off" autocorrect="off">
                <label for="person-death-input" style="display: block; margin-top: 16px;">Дата смерти:</label>
                <input type="text" id="person-death-input" autocomplete="off" autocorrect="off">
                <label for="place-birth-input" style="display: block; margin-top: 16px;">Место рождения:</label>
                <input type="text" id="place-birth-input" autocomplete="off" autocorrect="off">
                <label for="coordinates-input" style="display: block; margin-top: 16px;">Координаты места рождения (широта, долгота):</label>
                <p style=" font-style: italic; color: gray;">Вставьте координаты скопированные из google maps<p>
                <input type="text" id="coordinates-input" autocomplete="off" autocorrect="off">
                <label for="place-death-input" style="display: block; margin-top: 16px;">Место смерти:</label>
                <input type="text" id="place-death-input" autocomplete="off" autocorrect="off">
                <div class="toggle-container">
                    <span class="toggle-label">Жив:</span>
                    <label class="toggle-switch" style="display: block; margin-top: 16px;">
                        <input type="checkbox" id="isLivingToggle" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <label for="person-info-input" style="display: block; margin-top: 16px;">Общая информация:</label>
                <div tabindex="0" id="added-person-info-input" style="margin-top: 6px;"></div>
            </div>
            <div class="edit-buttons" style="margin-top: 32px;">
                <button class="save-button">Сохранить</button>
                <button class="cancel-button">Отмена</button>
            </div>
        `;

        modalContent.innerHTML = addingChildHTML;
        setupEventListeners("addChild");
    };

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

        quillEditor = createQuill("#added-person-info-input");
    };

    function handleClose() {
        const photoOverlay = document.querySelector(".photo-overlay");
        if (photoOverlay) {
            photoOverlay.style.display = "none";
        }
        closeModal();
    };

    async function handleSave(modalType) {
        console.log(`Сохранение данных для ${modalType}:`, currentModalExtra);

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
            isMainTree: isMain,
            isKeyNode: document.getElementById("isKeyNode")?.checked || false,
            info: quillEditor.root.innerHTML || ""
        };

        console.log("Форма данных:", formData);

        // Запись данных в БД
        if(modalType === "addSpouse") {
            if(validateSendData(formData)) {
                const createResponse = await pb.collection("genealogy").create(prepareAddSpouseData(formData, currentModalExtra));
                if(!createResponse.hasOwnProperty("code")) {
                    await pb.collection("genealogy").update(currentModalExtra.id, { partner: {spouse: createResponse.id}});
                    location.reload();
                } else {
                    alert(`Код ${createResponse.code}: ${createResponse.message}`);
                }
            } else {
                alert("Поля c именем и датой рождения должны быть заполнены.");
            }
        } else if(modalType === "addParent") {

        } else if(modalType === "addChild") {

        };

        closeModal();
    }

    function closeModal() {
        if (quillEditor) {
            quillEditor.setText("");
            quillEditor = null;
        };

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