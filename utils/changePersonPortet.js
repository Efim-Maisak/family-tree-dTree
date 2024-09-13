import { baseImagePath } from "../config/apiConfig.js";
import { dataTable } from "../config/apiConfig.js";

export const changePersonPortret = (extra) => {
    if(extra.portret) {
        document.querySelector(".person-photo").src=`${baseImagePath}/${dataTable}/${extra.id}/${extra.portret}`;
    } else {
        document.querySelector(".person-photo").src="../assets/avatar-default-512x488.png";
    }
};