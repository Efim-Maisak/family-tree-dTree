// Параметры с указанием пути к серверным ресурсам pocketbase
// Для примера указаны адреса для локального запуска

// Базовый адрес для запроса к БД
export const baseDBpath = "http://127.0.0.1:8090/api/collections";

// Название таблицы с данными, например "genealogy"
export const dataTable = "genealogy"

// Максимально количество записей, которое вернется из БД
export const maxItems = "100"

// Базовый адрес для получения изображений из БД
export const baseImagePath = "http://127.0.0.1:8090/api/files";