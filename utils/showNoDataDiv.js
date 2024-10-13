export const showNoDataDiv = () => {
    const emptyDiv = document.createElement("div");
    emptyDiv.classList.add("empty");
    emptyDiv.innerHTML = "<strong>Нет данных для отображения</strong>";
    document.body.append(emptyDiv);
};