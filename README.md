# Приложение для отображения генеологического дерева

Отображает семейное дерево и дополнительные сведения о человеке, включая его портрет. Прямые родственники супруг отображаются в отдельных деревьях.
Имеется функционал поиска человека и перехода к найденной ноде.
Также позволяет редактировать данные о человеке при наличии соответствующих прав у пользователя (role = "editor").

В данном проекте используется библиотека для построения семейных деревьев [dTree](https://github.com/ErikGartner/dTree) версии 2.4.1 и база данных [pocketbase](https://pocketbase.io/).

### Зависимости
Для работы dTree необходимы следующие библиотеки:
* lodash (версия 4.17.4);
* d3 (версия 4).

Данные библиотеки уже подключены к проекту и дополнительно их устанавливать не требуется.

### Структура проекта
    /lib  - файлы библиотек dTree и Pocketbase;
    /config - параметры с указанием пути к ресурсам pocketbase (нужно настроить для подключения к вашим данным!);
    /js - основные файлы проекта и модули;
    /css - стили;
    /assets - набор изображений и иконок;
    /services - файлы обеспечивающие осуществление запросов к базе данных и обработку ошибок;
    /utils - вспомогательные функции;
    index.html - корневой файл проекта.

### Схема таблицы с данными в pocketbase
База данных pocketbase позволяет импортировать коллекцию (схему данных) в формате json.

<details> <summary>Скопировать пример коллекции</summary>

```json
[
    {
        "id": "djal98a7q4a4nnq",
        "name": "genealogy",
        "type": "base",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "1cpdgevn",
                "name": "name",
                "type": "text",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "3oxskp1c",
                "name": "gender",
                "type": "select",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSelect": 1,
                    "values": [
                        "M",
                        "F"
                    ]
                }
            },
            {
                "system": false,
                "id": "y7f7i70j",
                "name": "portret",
                "type": "file",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "mimeTypes": [
                        "image/jpeg",
                        "image/vnd.mozilla.apng",
                        "image/png"
                    ],
                    "thumbs": [
                        "200x200f"
                    ],
                    "maxSelect": 1,
                    "maxSize": 5242880,
                    "protected": false
                }
            },
            {
                "system": false,
                "id": "rjs05tyj",
                "name": "date_of_birth",
                "type": "text",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": 20,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "wh80oml2",
                "name": "date_of_death",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": 20,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "hj19lfca",
                "name": "place_of_birth",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": 50,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "12xua8gn",
                "name": "place_of_birth_coordinates",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "qfatge8n",
                "name": "place_of_death",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": 50,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "n3tnaasl",
                "name": "information",
                "type": "editor",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "convertUrls": false
                }
            },
            {
                "system": false,
                "id": "t5b1guf8",
                "name": "parents",
                "type": "json",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSize": 2000000
                }
            },
            {
                "system": false,
                "id": "uanxbdqu",
                "name": "children",
                "type": "json",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSize": 2000000
                }
            },
            {
                "system": false,
                "id": "vgdxarjd",
                "name": "partner",
                "type": "json",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSize": 2000000
                }
            },
            {
                "system": false,
                "id": "2tmbacn5",
                "name": "key_node",
                "type": "bool",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {}
            },
            {
                "system": false,
                "id": "5xbc2aun",
                "name": "isLivingPerson",
                "type": "bool",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {}
            },
            {
                "system": false,
                "id": "hpittoif",
                "name": "isMainTree",
                "type": "bool",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {}
            }
        ],
        "indexes": [],
        "listRule": "",
        "viewRule": null,
        "createRule": "@request.auth.id != \"\" && @request.auth.role = \"editor\"",
        "updateRule": "@request.auth.id != \"\" && @request.auth.role = \"editor\"",
        "deleteRule": null,
        "options": {}
    }
]
```
</details>

Поле "isMainTree" принимает true для отображения ноды в основном дереве.

Поле "isLivingPerson" принимает true отображения информации о живом человеке.

Поле "key_node" устанавливает корневую ноду (единственная со значением true).

Поле "place_of_birth_coordinates" принимает координаты точки на google maps (широта,долгота).

Несколько полей таблицы имеют тип "json" и для формирования дерева должны иметь следующую структуру:

Поле таблицы "parents".
```json
{
  "parents": [
    "parent1Id",
    "parent2Id"
  ]
}
```

Поле таблицы "children".
```json
{
  "children": [
    "children1Id",
  ]
}
```

Поле таблицы "partner".
```json
{
  "spouse": "spouseId"
}
```

### Схема таблицы "пользователи" в pocketbase

Для доступа к редактированию данных о человеке и добавления детей/супруга/родителя созданы роли в таблице users.

<details> <summary>Скопировать пример коллекции users</summary>

```json
[
    {
        "id": "_pb_users_auth_",
        "name": "users",
        "type": "auth",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "users_avatar",
                "name": "avatar",
                "type": "file",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "mimeTypes": [
                        "image/jpeg",
                        "image/png",
                        "image/svg+xml",
                        "image/gif",
                        "image/webp"
                    ],
                    "thumbs": null,
                    "maxSelect": 1,
                    "maxSize": 5242880,
                    "protected": false
                }
            },
            {
                "system": false,
                "id": "tqrvqkyv",
                "name": "role",
                "type": "select",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSelect": 1,
                    "values": [
                        "viewer",
                        "editor"
                    ]
                }
            },
            {
                "system": false,
                "id": "u822yrfz",
                "name": "name",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            }
        ],
        "indexes": [],
        "listRule": "id = @request.auth.id",
        "viewRule": "id = @request.auth.id",
        "createRule": null,
        "updateRule": null,
        "deleteRule": null,
        "options": {
            "allowEmailAuth": true,
            "allowOAuth2Auth": false,
            "allowUsernameAuth": false,
            "exceptEmailDomains": null,
            "manageRule": null,
            "minPasswordLength": 8,
            "onlyEmailDomains": null,
            "onlyVerified": false,
            "requireEmail": true
        }
    }
]
```
</details>

### Запуск приложения на локальном компьютере
<Будет дополняться>