const prepareAddChildData = (formData, nodePersonData) => {

    const addSecondParent = (child) => {
        if(nodePersonData.partner !== null && nodePersonData.partner.hasOwnProperty("spouse")) {
            child.parents.parents.push(nodePersonData.partner.spouse)
        }
    };

    let child = {
        "children": null,
        "date_of_birth": formData.birthDate,
        "date_of_death": formData.deathDate,
        "gender": formData.gender,
        "information": formData.info,
        "isLivingPerson": formData.isLiving,
        "isMainTree": formData.isMainTree,
        "key_node": false,
        "name": formData.name,
        "parents": { parents: [nodePersonData.id]},
        "partner": null,
        "place_of_birth": formData.birthPlace,
        "place_of_birth_coordinates": formData.coordinates,
        "place_of_death": formData.deathPlace,
    }

    addSecondParent(child);

    return child;
};

export default prepareAddChildData;