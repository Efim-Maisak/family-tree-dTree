export const changeInfoIsLivingPerson = (extra) => {
    const personInfoDeath = document.getElementById("person-info-death");
    const personInfoPlaceOfDeath = document.getElementById("person-info-place-death");
    const personDeathSpan = document.getElementById("person-death");
    const personPlaceDeathSpan = document.getElementById("place-death");

    if (extra && !extra.isLiving) {
        personInfoDeath.style.display = "";
        personInfoPlaceOfDeath.style.display = "";
        personDeathSpan.textContent = `${extra.deathDate || "неизвестный "} г.`;
        personPlaceDeathSpan.textContent = extra.deathPlace || "неизвестно";
    } else {
        personInfoDeath.style.display = "none";
        personInfoPlaceOfDeath.style.display = "none";
        personDeathSpan.textContent = "";
        personPlaceDeathSpan.textContent = "";
    }
};