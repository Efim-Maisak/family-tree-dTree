export const filterMainTreePerson = (data) => {
    return data.filter(item => item.isMainTree === true);
};