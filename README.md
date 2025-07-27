# Приложение для отображения генеологического дерева

Отображает семейное дерево и дополнительные сведения о человеке, включая его портрет. Прямые родственники супруг отображаются в отдельных деревьях.
Имеется функционал поиска человека и перехода к найденной ноде.
Приложение позволяет редактировать данные о человеке, а также добавлять в дерево новые элементы через контекстное меню, при наличии соответствующих прав у пользователя (role = "editor").

В проекте используется библиотека для построения семейных деревьев [dTree](https://github.com/ErikGartner/dTree) версии 2.4.1 и база данных [pocketbase](https://pocketbase.io/).

### Зависимости
Для работы dTree необходимы следующие библиотеки:
* lodash (версия 4.17.4);
* d3 (версия 4).

Данные библиотеки уже подключены к проекту и дополнительно их устанавливать не требуется.

### Структура проекта
    /assets - набор изображений и иконок;
    /config - параметры с указанием пути к ресурсам pocketbase (ВАЖНО настроить для подключения к вашим данным!);
    /css - стили;
    /js - основные файлы проекта и модули;
    /lib - файлы библиотек dTree, d3 и Pocketbase;
    /services - файлы обеспечивающие осуществление запросов к базе данных и обработку ошибок;
    /utils - вспомогательные функции;
    index.html - корневой файл проекта.

### Схема таблицы с данными в pocketbase
База данных pocketbase позволяет импортировать коллекцию (схему данных) в формате json.

<details> <summary>**Скопировать пример коллекции**</summary>

```json
[
    {
        "id": "djal98a7q4a4nnq",
        "listRule": "@request.auth.id != \"\"",
        "viewRule": "@request.auth.id != \"\"",
        "createRule": "@request.auth.id != \"\" && @request.auth.role = \"editor\"",
        "updateRule": "@request.auth.id != \"\" && @request.auth.role = \"editor\"",
        "deleteRule": null,
        "name": "genealogy",
        "type": "base",
        "fields": [
            {
                "autogeneratePattern": "[a-z0-9]{15}",
                "hidden": false,
                "id": "text3208210256",
                "max": 15,
                "min": 15,
                "name": "id",
                "pattern": "^[a-z0-9]+$",
                "presentable": false,
                "primaryKey": true,
                "required": true,
                "system": true,
                "type": "text"
            },
            {
                "autogeneratePattern": "",
                "hidden": false,
                "id": "1cpdgevn",
                "max": 0,
                "min": 0,
                "name": "name",
                "pattern": "",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "text"
            },
            {
                "hidden": false,
                "id": "3oxskp1c",
                "maxSelect": 1,
                "name": "gender",
                "presentable": false,
                "required": true,
                "system": false,
                "type": "select",
                "values": [
                    "M",
                    "F"
                ]
            },
            {
                "hidden": false,
                "id": "y7f7i70j",
                "maxSelect": 1,
                "maxSize": 5242880,
                "mimeTypes": [
                    "image/jpeg",
                    "image/vnd.mozilla.apng",
                    "image/png"
                ],
                "name": "portret",
                "presentable": false,
                "protected": false,
                "required": false,
                "system": false,
                "thumbs": [
                    "200x200f"
                ],
                "type": "file"
            },
            {
                "autogeneratePattern": "",
                "hidden": false,
                "id": "rjs05tyj",
                "max": 20,
                "min": 0,
                "name": "date_of_birth",
                "pattern": "",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "text"
            },
            {
                "autogeneratePattern": "",
                "hidden": false,
                "id": "wh80oml2",
                "max": 20,
                "min": 0,
                "name": "date_of_death",
                "pattern": "",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text"
            },
            {
                "autogeneratePattern": "",
                "hidden": false,
                "id": "hj19lfca",
                "max": 50,
                "min": 0,
                "name": "place_of_birth",
                "pattern": "",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text"
            },
            {
                "autogeneratePattern": "",
                "hidden": false,
                "id": "12xua8gn",
                "max": 0,
                "min": 0,
                "name": "place_of_birth_coordinates",
                "pattern": "",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text"
            },
            {
                "autogeneratePattern": "",
                "hidden": false,
                "id": "qfatge8n",
                "max": 50,
                "min": 0,
                "name": "place_of_death",
                "pattern": "",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text"
            },
            {
                "convertURLs": false,
                "hidden": false,
                "id": "n3tnaasl",
                "maxSize": 0,
                "name": "information",
                "presentable": false,
                "required": false,
                "system": false,
                "type": "editor"
            },
            {
                "hidden": false,
                "id": "t5b1guf8",
                "maxSize": 2000000,
                "name": "parents",
                "presentable": false,
                "required": false,
                "system": false,
                "type": "json"
            },
            {
                "hidden": false,
                "id": "uanxbdqu",
                "maxSize": 2000000,
                "name": "children",
                "presentable": false,
                "required": false,
                "system": false,
                "type": "json"
            },
            {
                "hidden": false,
                "id": "vgdxarjd",
                "maxSize": 2000000,
                "name": "partner",
                "presentable": false,
                "required": false,
                "system": false,
                "type": "json"
            },
            {
                "hidden": false,
                "id": "2tmbacn5",
                "name": "key_node",
                "presentable": false,
                "required": false,
                "system": false,
                "type": "bool"
            },
            {
                "hidden": false,
                "id": "5xbc2aun",
                "name": "isLivingPerson",
                "presentable": false,
                "required": false,
                "system": false,
                "type": "bool"
            },
            {
                "hidden": false,
                "id": "hpittoif",
                "name": "isMainTree",
                "presentable": false,
                "required": false,
                "system": false,
                "type": "bool"
            },
            {
                "hidden": false,
                "id": "autodate2990389176",
                "name": "created",
                "onCreate": true,
                "onUpdate": false,
                "presentable": false,
                "system": false,
                "type": "autodate"
            },
            {
                "hidden": false,
                "id": "autodate3332085495",
                "name": "updated",
                "onCreate": true,
                "onUpdate": true,
                "presentable": false,
                "system": false,
                "type": "autodate"
            }
        ],
        "indexes": [],
        "system": false
    }
]
```
</details>

Поле "isMainTree" принимает true для отображения ноды в основном дереве.

Поле "isLivingPerson" принимает true отображения информации о живом человеке, скрывает дату и место смерти.

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

<details> <summary>**Скопировать пример коллекции users**</summary>

```json
[
    {
        "id": "_pb_users_auth_",
        "listRule": null,
        "viewRule": null,
        "createRule": null,
        "updateRule": null,
        "deleteRule": null,
        "name": "users",
        "type": "auth",
        "fields": [
            {
                "autogeneratePattern": "[a-z0-9]{15}",
                "hidden": false,
                "id": "text3208210256",
                "max": 15,
                "min": 15,
                "name": "id",
                "pattern": "^[a-z0-9]+$",
                "presentable": false,
                "primaryKey": true,
                "required": true,
                "system": true,
                "type": "text"
            },
            {
                "cost": 10,
                "hidden": true,
                "id": "password901924565",
                "max": 0,
                "min": 8,
                "name": "password",
                "pattern": "",
                "presentable": false,
                "required": true,
                "system": true,
                "type": "password"
            },
            {
                "autogeneratePattern": "[a-zA-Z0-9_]{50}",
                "hidden": true,
                "id": "text2504183744",
                "max": 60,
                "min": 30,
                "name": "tokenKey",
                "pattern": "",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": true,
                "type": "text"
            },
            {
                "exceptDomains": null,
                "hidden": false,
                "id": "email3885137012",
                "name": "email",
                "onlyDomains": null,
                "presentable": false,
                "required": true,
                "system": true,
                "type": "email"
            },
            {
                "hidden": false,
                "id": "bool1547992806",
                "name": "emailVisibility",
                "presentable": false,
                "required": false,
                "system": true,
                "type": "bool"
            },
            {
                "hidden": false,
                "id": "bool256245529",
                "name": "verified",
                "presentable": false,
                "required": false,
                "system": true,
                "type": "bool"
            },
            {
                "autogeneratePattern": "users[0-9]{6}",
                "hidden": false,
                "id": "text4166911607",
                "max": 150,
                "min": 3,
                "name": "username",
                "pattern": "^[\\w][\\w\\.\\-]*$",
                "presentable": false,
                "primaryKey": false,
                "required": true,
                "system": false,
                "type": "text"
            },
            {
                "hidden": false,
                "id": "users_avatar",
                "maxSelect": 1,
                "maxSize": 5242880,
                "mimeTypes": [
                    "image/jpeg",
                    "image/png",
                    "image/svg+xml",
                    "image/gif",
                    "image/webp"
                ],
                "name": "avatar",
                "presentable": false,
                "protected": false,
                "required": false,
                "system": false,
                "thumbs": null,
                "type": "file"
            },
            {
                "hidden": false,
                "id": "tqrvqkyv",
                "maxSelect": 1,
                "name": "role",
                "presentable": false,
                "required": true,
                "system": false,
                "type": "select",
                "values": [
                    "viewer",
                    "editor"
                ]
            },
            {
                "autogeneratePattern": "",
                "hidden": false,
                "id": "u822yrfz",
                "max": 0,
                "min": 0,
                "name": "name",
                "pattern": "",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "text"
            },
            {
                "hidden": false,
                "id": "autodate2990389176",
                "name": "created",
                "onCreate": true,
                "onUpdate": false,
                "presentable": false,
                "system": false,
                "type": "autodate"
            },
            {
                "hidden": false,
                "id": "autodate3332085495",
                "name": "updated",
                "onCreate": true,
                "onUpdate": true,
                "presentable": false,
                "system": false,
                "type": "autodate"
            }
        ],
        "indexes": [
            "CREATE UNIQUE INDEX `__pb_users_auth__username_idx` ON `users` (username COLLATE NOCASE)",
            "CREATE UNIQUE INDEX `__pb_users_auth__email_idx` ON `users` (`email`) WHERE `email` != ''",
            "CREATE UNIQUE INDEX `__pb_users_auth__tokenKey_idx` ON `users` (`tokenKey`)"
        ],
        "system": false,
        "authRule": "",
        "manageRule": null,
        "authAlert": {
            "enabled": true,
            "emailTemplate": {
                "subject": "Login from a new location",
                "body": "<p>Hello,</p>\n<p>We noticed a login to your {APP_NAME} account from a new location.</p>\n<p>If this was you, you may disregard this email.</p>\n<p><strong>If this wasn't you, you should immediately change your {APP_NAME} account password to revoke access from all other locations.</strong></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
            }
        },
        "oauth2": {
            "mappedFields": {
                "id": "",
                "name": "",
                "username": "username",
                "avatarURL": ""
            },
            "enabled": false
        },
        "passwordAuth": {
            "enabled": true,
            "identityFields": [
                "email"
            ]
        },
        "mfa": {
            "enabled": false,
            "duration": 1800,
            "rule": ""
        },
        "otp": {
            "enabled": false,
            "duration": 180,
            "length": 8,
            "emailTemplate": {
                "subject": "OTP for {APP_NAME}",
                "body": "<p>Hello,</p>\n<p>Your one-time password is: <strong>{OTP}</strong></p>\n<p><i>If you didn't ask for the one-time password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
            }
        },
        "authToken": {
            "duration": 1209600
        },
        "passwordResetToken": {
            "duration": 1800
        },
        "emailChangeToken": {
            "duration": 1800
        },
        "verificationToken": {
            "duration": 604800
        },
        "fileToken": {
            "duration": 120
        },
        "verificationTemplate": {
            "subject": "Verify your {APP_NAME} email",
            "body": "<p>Hello,</p>\n<p>Thank you for joining us at {APP_NAME}.</p>\n<p>Click on the button below to verify your email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verify</a>\n</p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
        },
        "resetPasswordTemplate": {
            "subject": "Reset your {APP_NAME} password",
            "body": "<p>Hello,</p>\n<p>Click on the button below to reset your password.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Reset password</a>\n</p>\n<p><i>If you didn't ask to reset your password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
        },
        "confirmEmailChangeTemplate": {
            "subject": "Confirm your {APP_NAME} new email address",
            "body": "<p>Hello,</p>\n<p>Click on the button below to confirm your new email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Confirm new email</a>\n</p>\n<p><i>If you didn't ask to change your email address, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
        }
    }
]
```
</details>

### Запуск приложения на локальном компьютере

<details> <summary>**Посмотреть пошаговую инструкцию**</summary>

1. **Скачать исходный код проекта**

   **Способ 1 (простой, без установки дополнительных программ):**
   - В репозитории нажать кнопку "Code" → "Download ZIP"
   - Распаковать скачанный архив в удобное место на компьютере

   **Способ 2 (через Git):**
   - Сначала установить Git:
     - **Windows**: скачать с https://git-scm.com/download/windows и установить
     - **Mac**: Git обычно уже установлен, если нет - установить через https://git-scm.com/download/mac
   - Открыть терминал редактора VS Сode (или другую командную строку) в папке, где хотите сохранить проект
   - Выполнить команду:
   ```bash
   git clone https://github.com/Efim-Maisak/family-tree-dTree.git
   ```

2. **Скачать PocketBase**
   - Перейти на официальный сайт: https://pocketbase.io/ и скачать версию базы данных для вашей операционной системы
   - Распаковать скачанный архив **в папку проекта** (там где находится файл `index.html`)

3. **Запуск PocketBase**
   - **Windows**:
	 - Запустить файл pocketbase.exe в папке проекта
     - Открыть терминал в редакторе кода и в папке проекта выполнить команду: `./pocketbase serve`
   - После запуска в консоли появится сообщение о том, что сервер запущен на адресе: http://127.0.0.1:8090

   > ⚠️ **Важно**: Не закрывайте терминал - PocketBase должен работать постоянно, пока вы используете приложение

4. **Создание административного аккаунта**
   - Перейти в браузере по адресу: http://127.0.0.1:8090/_/
   - Создать административный аккаунт суперпользователя (email и пароль)

5. **Импорт коллекции с данными для древа**
   - В админ-панели PocketBase перейти в раздел "Collections"
   - Нажать "Import collections"
   - Вставить JSON-схему коллекции `genealogy` из описания проекта:
   ```json
   [
     {
       "id": "djal98a7q4a4nnq",
       "name": "genealogy",
       "type": "base",
       "system": false,
       "schema": [
         // ... полная схема из описания
       ]
     }
   ]
   ```
   - При импорте выбрать опцию "Merge with existing collection"

6. **Импорт коллекции users**
   - Аналогично импортировать коллекцию `users` используя JSON-схему из описания
   - Эта коллекция управляет правами доступа пользователей
   - При импорте также выбрать опцию "Merge with existing collection"

7. **Включить BatchAPI**
	- В админ-панели PocketBase перейти в раздел "Application"
	- BatchAPI переведите в режим "enabled"

8. **Создание пользователя для входа в приложение**
   - В разделе "Collections" выбрать коллекцию "users"
   - Создать нового пользователя с полями:
     - email: ваш email
     - password: ваш пароль
     - role: "editor" (для возможности редактирования)
     - name: ваше имя
	 - verified: true

9. **Настройка конфигурации API**
   - В папке проекта найти папку `config`
   - Найти файл `apiConfig.example`и переименовать его в `apiConfig.js`
   - Открыть файл `apiConfig.js` и убедиться, что параметры соответствуют настройкам локального запуска (обычно менять ничего не нужно):
   ```javascript
   // Базовый адрес БД
   export const baseUrl = "http://127.0.0.1:8090";
   // Адрес для запроса к БД
   export const baseDBpath = "http://127.0.0.1:8090/api/collections";
   // Название таблицы с данными (переименуйте если у вас другое название)
   export const dataTable = "genealogy";
   // Максимальное количество записей возвращаемое из базы
   export const maxItems = "200";
   // Адрес для получения изображений из БД
   export const baseImagePath = "http://127.0.0.1:8090/api/files";
   // Первая буква фамилии для логотипа (можете изменить на свою)
   export const letterOnShield = "A";
   ```
   - Сохранить файл

10. **Открытие приложения**
	- Если используете редактор VS Сode - установите расширение "Live Server"
    - Перейтите в браузере по адресу: http://localhost:8000 (или запустите Live Server нажав кнопку в правом нижнем углу)
    - Готово! Войдите в приложение используя созданный ранее аккаунт пользователя

</details>