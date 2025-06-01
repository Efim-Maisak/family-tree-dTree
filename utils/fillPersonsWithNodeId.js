export const fillPersonsWithNodeId = (dataWithNodeId, extra, id) => {

    // Проверяем, есть ли уже такой id
    if (!dataWithNodeId.some(person => person.id === extra.id)) {
            dataWithNodeId.push({
                ...extra,
                nodeId: id
            });
        }

    return dataWithNodeId;
};