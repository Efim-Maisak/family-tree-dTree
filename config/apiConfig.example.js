// Параметры с указанием пути к серверным ресурсам pocketbase
// Для примера указаны адреса локального запуска

// Базовый адрес БД
export const baseUrl = "http://127.0.0.1:8090";

// Адрес для запроса к БД
export const baseDBpath = "http://127.0.0.1:8090/api/collections";

// Название таблицы с данными, например "genealogy"
export const dataTable = "genealogy";

// Максимальное количество записей, которое вернется из БД
export const maxItems = "200";

// Адрес для получения изображений из БД
export const baseImagePath = "http://127.0.0.1:8090/api/files";

// Первая буква фамилии для расположения на щите экрана логина
export const letterOnShield = "A";