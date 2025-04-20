const prepareAddSpouseData = (formData, nodePersonData) => {

    let spouse = {
        "children": nodePersonData.children,
        "date_of_birth": formData.birthDate,
        "date_of_death": formData.deathDate,
        "gender": formData.gender,
        "information": formData.info,
        "isLivingPerson": formData.isLiving,
        "isMainTree": formData.isMainTree,
        "key_node": formData.isKeyNode,
        "name": formData.name,
        "parents": null,
        "partner": {
            spouse: nodePersonData.id,
        } ,
        "place_of_birth": formData.birthPlace,
        "place_of_birth_coordinates": formData.coordinates,
        "place_of_death": formData.deathPlace,
    }

    return spouse;
};

export default prepareAddSpouseData;