export const showLoadingDiv = (loadingDiv) => {
    loadingDiv.classList.add("loading");
    loadingDiv.innerHTML = '<img src="../assets/svg-spinners-blocks-shuffle-96.svg" alt="Спиннер">';
    document.body.append(loadingDiv);
};