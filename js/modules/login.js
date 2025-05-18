import { initApp } from "../script.js";
import { pb } from "../../services/pocketbase-service.js";
import { showMainContent } from "../../utils/showMainContent.js";
import addLogoutListener from "./logout.js";


const login = () => {

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const loginButton = document.getElementById("loginButton");
    const loginStatus = document.getElementById("loginStatus");
    const togglePassword = document.getElementById("togglePassword");
    const userInfoSpan = document.querySelector(".header-user-text");

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