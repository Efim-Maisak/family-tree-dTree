import { baseImagePath } from "../config/apiConfig.js";
import { dataTable } from "../config/apiConfig.js";


export const changePersonPortret = (extra) => {

    const personPhoto = document.querySelector(".person-photo");

    if(extra.portret) {
        if(personPhoto) personPhoto.src=`${baseImagePath}/${dataTable}/${extra.id}/${extra.portret}`;
    } else {
        if(personPhoto) personPhoto.src="../assets/avatar-default-512x488.png";
    }
};