export const changeInfoIsLivingPerson = (extra) => {
    const personInfoDeath = document.getElementById("person-info-death");
    const personInfoPlaceOfDeath = document.getElementById("person-info-place-death");
    const personDeathSpan = document.getElementById("person-death");
    const personPlaceDeathSpan = document.getElementById("place-death");

    if (extra && !extra.isLiving) {
        if(personInfoDeath) personInfoDeath.style.display = "";
        if(personInfoDeath) personInfoPlaceOfDeath.style.display = "";
        if(personDeathSpan) personDeathSpan.textContent = `${extra.deathDate || "неизвестный "} г.`;
        if(personPlaceDeathSpan) personPlaceDeathSpan.textContent = extra.deathPlace || "неизвестно";
    } else {
        if(personInfoDeath) personInfoDeath.style.display = "none";
        if(personInfoDeath) personInfoPlaceOfDeath.style.display = "none";
        if(personDeathSpan) personDeathSpan.textContent = "";
        if(personPlaceDeathSpan) personPlaceDeathSpan.textContent = "";
    }
};