// Функция для фильтрации массива родственников, нужна чтобы оставить в нем только супругу, её мужа и прямых родственников супруги.

export const filterSpouseFamily = (data, spouseId) => {
  const result = new Set();

  function addPersonWithFamily(id) {
    const person = data.find(p => p.id === id);
    if (person && !result.has(person)) {
      result.add(person);

      // Добавляем супруга/супругу текущего человека
      if (person.partner && person.partner.spouse) {
        const partner = data.find(p => p.id === person.partner.spouse);
        if (partner) {
          result.add(partner);
        }
      }

      // Рекурсивно добавляем родителей и их супругов
      if (person.parents && person.parents.parents) {
        person.parents.parents.forEach(parentId => addPersonWithFamily(parentId));
      }
    }
  }

  // Находим и добавляем супругу со всеми предками и их супругами
  addPersonWithFamily(spouseId);

  // Находим супругу в результате
  const spouse = Array.from(result).find(person => person.id === spouseId);

  if (spouse) {
    // Добавляем братьев и сестер супруги
    data.forEach(person => {
      if (person.id !== spouseId && person.parents && person.parents.parents) {
        const hasCommonParent = person.parents.parents.some(parentId =>
          spouse.parents &&
          spouse.parents.parents &&
          spouse.parents.parents.includes(parentId)
        );
        if (hasCommonParent) {
          result.add(person);
          // Добавляем супругов братьев и сестер
          if (person.partner && person.partner.spouse) {
            const siblingPartner = data.find(p => p.id === person.partner.spouse);
            if (siblingPartner) {
              result.add(siblingPartner);
            }
          }
        }
      }
    });
  }

  return Array.from(result);
}