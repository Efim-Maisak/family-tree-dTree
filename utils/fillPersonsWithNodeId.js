export const fillPersonsWithNodeId = (dataWithNodeId, filteredData, extra, id) => {
    if(dataWithNodeId.length <= filteredData.length) {
        dataWithNodeId.push({
            name: extra.name,
            id: extra.id,
            gender: extra.gender,
            birthDate: extra.birthDate,
            deathDate: extra.deathDate,
            birthPlace: extra.birthPlace,
            deathPlace: extra.deathPlace,
            information: extra.information,
            isLiving: extra.isLiving,
            portret: extra.portret,
            partner: extra.partner,
            nodeId: id
        });
    }
    return dataWithNodeId;
};