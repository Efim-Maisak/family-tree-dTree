// Функция для фильтрации массива родственников, нужна чтобы оставить в нем только супругу, её мужа и прямых родственников супруги.

export const filterSpouseFamily = (data, spouseId) => {
  const result = new Set();

  function addPerson(id) {
    const person = data.find(p => p.id === id);
    if (person && !result.has(person)) {
      result.add(person);
      // Рекурсивно добавляем родителей только для супруги
      if (person.id === spouseId && person.parents && person.parents.parents) {
        person.parents.parents.forEach(parentId => addPerson(parentId));
      }
    }
  }

  // Находим и добавляем супругу
  addPerson(spouseId);

  // Находим супругу в результате
  const spouse = Array.from(result).find(person => person.id === spouseId);

  if (spouse) {
    // Находим и добавляем супруга
    if (spouse.partner && spouse.partner.spouse) {
      addPerson(spouse.partner.spouse);
    }

    // Находим и добавляем братьев и сестер супруги
    data.forEach(person => {
      if (person.id !== spouseId && person.parents && person.parents.parents) {
        const hasCommonParent = person.parents.parents.some(parentId =>
          spouse.parents &&
          spouse.parents.parents &&
          spouse.parents.parents.includes(parentId)
        );
        if (hasCommonParent) result.add(person);
      }
    });
  }

  return Array.from(result);
  }