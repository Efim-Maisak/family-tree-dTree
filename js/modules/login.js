import { initApp } from "../script.js";
import { pb } from "../../services/pocketbase-service.js";
import { showMainContent } from "../../utils/showMainContent.js";
import { letterOnShield } from "../../config/apiConfig.js";
import addLogoutListener from "./logout.js";



const login = () => {

    const appIcon =document.querySelector(".app-icon");
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const loginButton = document.getElementById("loginButton");
    const loginStatus = document.getElementById("loginStatus");
    const togglePassword = document.getElementById("togglePassword");
    const userInfoSpan = document.querySelector(".header-user-text");


    const createShieldIcon = (letter) => {
    return `
        <svg width="72" height="72" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <!-- Форма щита -->
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="#2196F3"/>
            <!-- Буква внутри щита -->
            <text x="12" y="12" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="white" stroke="#2196F3" stroke-width="0.6">${letter}</text>
        </svg>
    `;
    };

    appIcon.innerHTML = createShieldIcon(letterOnShield);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const validateForm = () => {
        const isEmailValid = validateEmail(emailInput.value);
        const isPasswordValid = validatePassword(passwordInput.value);

        // Показываем/скрываем ошибки email
        emailError.style.display = !isEmailValid && emailInput.value ? "block" : "none";
        emailInput.classList.toggle("error", !isEmailValid && emailInput.value);
        emailInput.classList.toggle("success", isEmailValid);

        // Показываем/скрываем ошибки пароля
        passwordError.style.display = !isPasswordValid && passwordInput.value ? "block" : "none";
        passwordInput.classList.toggle("error", !isPasswordValid && passwordInput.value);
        passwordInput.classList.toggle("success", isPasswordValid);

        // Активируем/деактивируем кнопку входа
        loginButton.disabled = !(isEmailValid && isPasswordValid);

        return isEmailValid && isPasswordValid;
    };

    emailInput.addEventListener("input", validateForm);
    passwordInput.addEventListener("input", validateForm);

    // Обработчик переключения видимости пароля
    togglePassword.addEventListener("click", () => {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        togglePassword.querySelector("img").style.opacity = type === "password" ? "0.6" : "1";
    });


    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = "Вход...";
        loginStatus.textContent = "";

        try {
            const authData = await pb.collection("users").authWithPassword(
                emailInput.value,
                passwordInput.value
            );

            if (authData.token) {
                userInfoSpan.textContent = authData.record.email;
                showMainContent();
                addLogoutListener();
                await initApp();
            }
        } catch (error) {
            console.error("Ошибка авторизации:", error);
            loginStatus.textContent = "Неверный email или пароль";
            loginStatus.style.color = "red";
        } finally {
            loginButton.textContent = "Войти";
            loginButton.disabled = false;
        }
    });

    // Начальная валидация
    validateForm();
};

export default login;