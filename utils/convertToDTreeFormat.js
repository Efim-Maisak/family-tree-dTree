export const convertToDTreeFormat = (data) => {
    const nodeMap = new Map();
    let rootNode = null;

    // Создаем узлы для каждого человека
    data.forEach(person => {
        if (!nodeMap.has(person.id)) {
            const node = {
                name: person.name,
                class: person.gender === 'M' ? 'man' : 'woman',
                textClass: "nodeText",
                depthOffset: 1,
                extra: {
                    id: person.id,
                    name: person.name,
                    gender: person.gender,
                    birthDate: person.date_of_birth,
                    deathDate: person.date_of_death,
                    birthPlace: person.place_of_birth,
                    deathPlace: person.place_of_death,
                    information: person.information,
                    isLiving: person.isLivingPerson,
                    portret: person.portret,
                    partner: person.partner,
                    coordinates: person.place_of_birth_coordinates
                },
                marriages: []
            };
            nodeMap.set(person.id, node);
        }
    });

    // Находим корневой узел (самый старший предок)
    let oldestPerson = data.reduce((oldest, current) => {
        const oldestBirth = oldest.date_of_birth ? new Date(oldest.date_of_birth.split('.').reverse().join('-')) : new Date(0);
        const currentBirth = current.date_of_birth ? new Date(current.date_of_birth.split('.').reverse().join('-')) : new Date(0);
        return currentBirth < oldestBirth ? current : oldest;
    });
    rootNode = nodeMap.get(oldestPerson.id);

    // Функция для создания узла неизвестного супруга
    function createUnknownSpouse(gender) {
        return {
            name: "неизвестно",
            class: "unknown",
            textClass: "nodeText",
            extra: {
                id: "unknown-" + Math.random().toString(36).substr(2, 9),
                gender: gender,
                birthDate: "",
                deathDate: "",
                birthPlace: "",
                deathPlace: "",
                information: "Информация отсутствует"
            }
        };
    }

    // Устанавливаем связи между узлами
    data.forEach(person => {
        const node = nodeMap.get(person.id);

        // Добавляем супруга
        if (person.partner && (person.partner.spouse || person.partner.partner)) {
            const spouseId = person.partner.spouse || person.partner.partner;
            const spouseNode = nodeMap.get(spouseId);
            if (spouseNode) {
                if (!node.marriages.some(m => m.spouse.extra.id === spouseNode.extra.id)) {
                    node.marriages.push({ spouse: spouseNode, children: [] });
                }
            } else {
                console.warn(`Не найден супруг для ${person.name} (ID: ${person.id})`);
            }
        }

        // Добавляем детей
        if (person.children && person.children.children) {
            let marriage = node.marriages[0];
            if (!marriage) {
                // Если нет известного супруга, создаем неизвестного
                const unknownSpouse = createUnknownSpouse(person.gender === 'M' ? 'F' : 'M');
                marriage = { spouse: unknownSpouse, children: [] };
                node.marriages.push(marriage);
            }
            person.children.children.forEach(childId => {
                const childNode = nodeMap.get(childId);
                if (childNode && !marriage.children.some(c => c.extra.id === childId)) {
                    marriage.children.push(childNode);
                }
            });
        }
    });

    // Добавляем детей к родителям
    data.forEach(person => {
        if (person.parents && person.parents.parents) {
            person.parents.parents.forEach(parentId => {
                const parentNode = nodeMap.get(parentId);
                if (parentNode) {
                    let marriage = parentNode.marriages[0];
                    if (!marriage) {
                        const unknownSpouse = createUnknownSpouse(parentNode.extra.gender === 'M' ? 'F' : 'M');
                        marriage = { spouse: unknownSpouse, children: [] };
                        parentNode.marriages.push(marriage);
                    }
                    const childNode = nodeMap.get(person.id);
                    if (childNode && !marriage.children.some(c => c.extra.id === person.id)) {
                        marriage.children.push(childNode);
                    }
                }
            });
        }
    });

    // Рекурсивная функция для построения дерева
    function buildTree(node) {
        node.marriages.forEach(marriage => {
            marriage.children = marriage.children.map(child => buildTree(child));
        });
        return node;
    }

    return [buildTree(rootNode)];
}