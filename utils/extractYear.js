const extractYear = (birthDate) => {
    if (!birthDate || typeof birthDate !== "string") return null;

    // Убираем все символы кроме цифр и пробелов
    const match = birthDate.match(/\d{4}/g);
    if (match && match.length > 0) {
        return parseInt(match[0]); // Первый год считается основным
    }
    return null;
};

export default extractYear;