export const changeInfoIsLivingPerson = (extra) => {
    const personInfoDeath = document.getElementById("person-info-death");
    const personInfoPlaceOfDeath = document.getElementById("person-info-place-death");
    if (!extra.isLiving) {
        personInfoDeath.style.display = "";
        personInfoPlaceOfDeath.style.display = "";
        document.getElementById("person-death").textContent = `${extra.deathDate || "неизвестный "} г.`;
        document.getElementById("place-death").textContent = extra.deathPlace || "неизвестно";
    } else {
        personInfoDeath.style.display = "none";
        personInfoPlaceOfDeath.style.display = "none";
        document.getElementById("person-death").textContent = "";
        document.getElementById("place-death").textContent = "";
    }
};