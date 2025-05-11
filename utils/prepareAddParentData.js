import { genealogyData } from "../js/script.js";

const prepareAddParentData = (formData, nodePersonData) => {

    const addParentSpouse = (parentObj) => {
        const parentSpouse = genealogyData.find(person => nodePersonData.parents?.parents[0] == person.id);
        if(parentSpouse) {
            const childrenArr = parentSpouse.children.children;
            parentObj.children = { children: childrenArr}
            parentObj.partner = {spouse: parentSpouse.id};
        }
    };

    let parent = {
        "children": { children: [ nodePersonData.id ]},
        "date_of_birth": formData.birthDate,
        "date_of_death": formData.deathDate,
        "gender": formData.gender,
        "information": formData.info,
        "isLivingPerson": formData.isLiving,
        "isMainTree": formData.isMainTree,
        "key_node": formData.isKeyNode,
        "name": formData.name,
        "parents": null,
        "partner": null,
        "place_of_birth": formData.birthPlace,
        "place_of_birth_coordinates": formData.coordinates,
        "place_of_death": formData.deathPlace,
    }

    addParentSpouse(parent);

    return parent;
};

export default prepareAddParentData;