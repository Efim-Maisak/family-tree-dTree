export const zoomControl = (tree) => {
    const resetButton = document.querySelector(".button_reset");
    const zoomToFitButton = document.querySelector(".button_tofit");

    const reset = () => {
        if(tree) {
            try {
                tree.resetZoom(500);
            } catch(e) {
                throw new Error("Ошибка зума:", e);
            }
        }
    };

    const toFit = () => {
        if(tree) {
            try {
                tree.zoomToFit(500);
            } catch (e) {
                throw new Error("Ошибка зума:", e);
            }

        }
    };


    resetButton.addEventListener("click", () => {
        reset();
    });
    zoomToFitButton.addEventListener("click", () => {
        toFit();
    });
};