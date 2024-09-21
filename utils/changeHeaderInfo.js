export const changeHeaderInfo = (name) => {
    const surname = name.split(" ")[0];

    const info = document.querySelector(".header-panel__info p");
    info.textContent = `Древо ${surname}`;
}