// Функция, которая находит всех супругов (женщин) и отфильтровает из массива всех её прямых родственников: братьев, сестер, родителей, бабушек и дедушек всех поколений.
// Для того чтобы не было конфликта с корневой нодой, которая определяется по наименьшей дате рождения. Таким образом если у предков супруги (женщины) окажется год рождения раньше года дерево будет построено неверно.

export const filterTreeFromWifeRelations = (data) => {

    // Функция для поиска человека по id
    const findPerson = (id) => data.find(person => person.id === id);

    // Функция для получения фамилии из полного имени
    const getLastName = (fullName) => {
        const nameParts = fullName.split(' ');
        return nameParts[nameParts.length - 1];
    };

    // Функция для получения всех предков человека
    const getAncestors = (person, ancestors = new Set()) => {
        if (!person || ancestors.has(person.id)) return ancestors;
        ancestors.add(person.id);

        if (person.parents && person.parents.parents) {
            person.parents.parents.forEach(parentId => {
                const parent = findPerson(parentId);
                if (parent) {
                    getAncestors(parent, ancestors);
                }
            });
        }

        return ancestors;
    };

    // Функция для получения всех потомков человека
    const getDescendants = (person, descendants = new Set()) => {
        if (!person || descendants.has(person.id)) return descendants;
        descendants.add(person.id);

        if (person.children && person.children.children) {
            person.children.children.forEach(childId => {
                const child = findPerson(childId);
                if (child) {
                    getDescendants(child, descendants);
                }
            });
        }

        return descendants;
    };

    // Находим всех жен
    const wives = data.filter(person => person.gender === "F" && person.partner && person.partner.spouse);

    // Собираем всех родственников жен для удаления
    const relativesToRemove = new Set();
    wives.forEach(wife => {
        // Если фамилия жены не Майсак, добавляем всех её предков в список для удаления
        if (getLastName(wife.name) !== 'Майсак') {
            getAncestors(wife).forEach(id => {
                if (id !== wife.id) relativesToRemove.add(id);
            });
        }
    });

    // Фильтруем данные, удаляя родственников жен, но сохраняя жен и их потомков
    return data.filter(person => {
        // Если это жена или потомок жены, оставляем в списке
        if (wives.some(wife => wife.id === person.id || getDescendants(wife).has(person.id))) {
            return true;
        }
        // Иначе удаляем, если это родственник жены
        return !relativesToRemove.has(person.id);
    });
}