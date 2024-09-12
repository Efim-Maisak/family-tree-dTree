const baseImagePath = "https://coldnaked.pockethost.io/api/files/genealogy";

export const changePersonPortret = (extra) => {
    if(extra.portret) {
        document.querySelector(".person-photo").src=`${baseImagePath}/${extra.id}/${extra.portret}`;
    } else {
        document.querySelector(".person-photo").src="../assets/avatar-default-512x488.png";
    }
};