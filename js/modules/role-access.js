const applyRoleAccess = (pb) => {

    const editBtn = document.querySelector(".edit-button");
    const editContainer = document.querySelector(".edit-buttons");

    if(editBtn && pb.authStore.model?.role == "viewer") {
        editBtn.style.visibility = "hidden";
        editContainer.style.display = "none";
    };
};

export default applyRoleAccess;