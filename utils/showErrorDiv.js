export const showErrorDiv = (error) => {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error");
    errorDiv.innerHTML = `<strong>Ошибка получения данных с сервера: ${error.message}</strong>`;
    document.body.append(errorDiv);
};