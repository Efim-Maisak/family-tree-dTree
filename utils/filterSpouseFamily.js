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


  // export const filterSpouseFamily = (data, name) => {
//     if (data) {
//         const surname = name.split(" ")[0];

//         const isMatchingSurname = (itemSurname, targetSurname) => {
//             // Фамилии, которые не склоняются
//             const nonDeclinableEndings = ['ко', 'як', 'сак', 'ук', 'иц', 'ок', 'ич'];
//             const targetEnding = targetSurname.slice(-2);

//             // Если фамилия с не склоняемым окончанием
//             if (nonDeclinableEndings.includes(targetEnding)) {
//                 return itemSurname === targetSurname;
//             }

//             // Обработка фамилий на -ий, которые могут склоняться в женский род
//             if (targetEnding === 'ий') {
//                 const femaleForm = `${targetSurname.slice(0, -2)}ая`;
//                 return itemSurname === targetSurname || itemSurname === femaleForm;
//             }

//             // Проверка склоняемых фамилий
//             return itemSurname === targetSurname ||
//                    itemSurname === `${targetSurname}а` ||
//                    itemSurname === targetSurname.slice(0, -1);
//         };

//         return data.filter(item => {
//             const itemSurname = item.name.split(" ")[0];
//             return isMatchingSurname(itemSurname, surname);
//         });
//     }
//     return [];
// };