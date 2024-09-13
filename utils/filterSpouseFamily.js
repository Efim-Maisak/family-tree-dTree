export const filterSpouseFamily = (data, name) => {
    if (data) {
        const surname = name.split(" ")[0];

        const isMatchingSurname = (itemSurname, targetSurname) => {
            // Фамилии, которые не склоняются
            const nonDeclinableEndings = ['ко', 'як', 'сак', 'ук', 'иц', 'ок', 'ич'];
            const targetEnding = targetSurname.slice(-2);

            // Если фамилия с не склоняемым окончанием
            if (nonDeclinableEndings.includes(targetEnding)) {
                return itemSurname === targetSurname;
            }

            // Обработка фамилий на -ий, которые могут склоняться в женский род
            if (targetEnding === 'ий') {
                const femaleForm = `${targetSurname.slice(0, -2)}ая`;
                return itemSurname === targetSurname || itemSurname === femaleForm;
            }

            // Проверка склоняемых фамилий
            return itemSurname === targetSurname ||
                   itemSurname === `${targetSurname}а` ||
                   itemSurname === targetSurname.slice(0, -1);
        };

        return data.filter(item => {
            const itemSurname = item.name.split(" ")[0];
            return isMatchingSurname(itemSurname, surname);
        });
    }
    return [];
};