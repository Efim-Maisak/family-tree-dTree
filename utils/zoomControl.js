import { customZoomToFit } from "./customZoomToFit.js";

export const zoomControl = (tree, graph) => {

    const zoomPanel = document.querySelector(".zoom-panel");

    const reset = () => {
        if(tree) {
            tree.resetZoom(500);
        }
    };

    const toFit = () => {
        if(tree) {
            customZoomToFit(tree, graph);
        }
    };

    const zoomPanelClickHandler = (e) => {
        const button = e.target.closest('.zoom-panel-button');
            if(button) {
                const action = button.dataset.action;
                if(action === "reset") {
                    reset();
                }else if(action === "tofit") {
                    toFit();
                }
            }
    }

    zoomPanel.addEventListener("click", zoomPanelClickHandler);

    const removeZoomListener = () => {
        zoomPanel.removeEventListener("click", zoomPanelClickHandler);
    }

    return {
        removeZoomListener
    }
};