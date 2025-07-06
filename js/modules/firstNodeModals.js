import { calcScroll } from "../../utils/calcScroll.js";
import { createQuill } from "./editor.js";
import { validateSendData } from "../../utils/validateSendData.js";
import { dataTable } from "../../config/apiConfig.js";
import { pb } from "../../services/pocketbase-service.js";
import toast from "./toast.js";


const firstNodeModal = () => {
    const modalElement = document.getElementById("modal");
    const modalContent = modalElement.querySelector(".popup_content");
    const addFirstNodeBtn = document.querySelector(".add-first-node-btn")
    const modalContentHTML = modalContent.innerHTML;
    const scrollWidth = calcScroll();

    let quillEditor = null;


    addFirstNodeBtn.addEventListener("click", openModal);

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

    function openModal() {

        // Отображаем модальное окно
        modalElement.style.display = "flex";
        modalContent.style.display = "block";
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollWidth}px`;


    function renderFirstNodeModal() {

        const firstNodeModalHTML = `
            <span class="popup_close">&times;</span>
            <h3 class="popup_content__title" style="margin-right: 48px; margin-bottom: 42px; margin-top: 6px;">Добавление персоны в древо</h3>
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

        modalContent.innerHTML = firstNodeModalHTML;
        setupEventListeners();
    };

    function setupEventListeners() {
        // Обработчик для кнопки закрытия
        const closeElement = modalContent.querySelector(".popup_close");
        if (closeElement) {
            closeElement.addEventListener("click", closeModal);
        }

        // Обработчик для кнопки сохранения
        const saveButton = modalContent.querySelector(".save-button");
        if (saveButton) {
            saveButton.addEventListener("click", () => {
                handleSave();
            });
        }

        // Обработчик для кнопки отмены
        const cancelButton = modalContent.querySelector(".cancel-button");
        if (cancelButton) {
            cancelButton.addEventListener("click", closeModal);
        }

        quillEditor = createQuill("#added-person-info-input");
    };


    renderFirstNodeModal();

    async function handleSave() {

        const saveBtn = modalContent.querySelector(".save-button");

        // Собираем данные из полей формы
        const formData = {
            name: document.getElementById("person-name-input")?.value || "",
            gender: document.getElementById("person-gender-select")?.value || "M",
            date_of_birth: document.getElementById("person-birth-input")?.value || "",
            date_of_death: document.getElementById("person-death-input")?.value || "",
            place_of_birth: document.getElementById("place-birth-input")?.value || "",
            place_of_birth_coordinates: document.getElementById("coordinates-input")?.value || "",
            place_of_death: document.getElementById("place-death-input")?.value || "",
            isLivingPerson: document.getElementById("isLivingToggle")?.checked || false,
            isMainTree: true,
            key_node: true,
            information: quillEditor.root.innerHTML || ""
        };

        // Запись данных в БД
        if(validateSendData(formData)) {
            saveBtn.disabled = true;
            saveBtn.textContent = "Сохраняю...";
            try {
                await pb.collection(dataTable).create(formData);
                saveBtn.disabled = false;
                closeModal();
                location.reload();
                } catch(e) {
                    saveBtn.disabled = false;
                    saveBtn.textContent = "Сохранить";
                    toast(`Код ${e.code}: ${e.message}`, "error", 5000);
                }
            }
        }
    };

    // Обработчики для закрытия модального окна при клике вне него и нажатии Escape
    function setupGlobalEventListeners() {
        modalElement.addEventListener("click", (event) => {
            if (event.target === modalElement) {
                closeModal();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        });
    };

    // Инициализация глобальных обработчиков
    setupGlobalEventListeners();

};

export default firstNodeModal;