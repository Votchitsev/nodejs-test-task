# Тестовое задание для разработчика Node.js

> Необходимо разработать API для блога на Node.js

### Требования к заданию:

Приложение представляет собой страницу, на которой могут делать записи любые авторизованные пользователи.

1.  Необходимо реализовать регистрацию и авторизацию пользователя, а также проверку JWT-токена при внесении записей на страницу

2.  Запись блога содержит:

    + Дата записи

    + Сообщение: может содержать как текст, так и медиа

    + Автор сообщения

3.  На странице с записями должна быть реализована пагинация, на каждой странице (пагинации) должно отображаться по 20 записей

4.  Автор записи может редактировать или удалять запись

5.  Базу данных необходимо заполнить стартовыми записями

6.  Необходимо выполнить деплой сервера для публичного доступа

7.  Необходимо написать документацию к эндпоинтам (вручную или сгенерировать из кода)

### Можно использовать:
* База данных может быть PostgreSQL или MongoDB
* Возможность express
* Библиотеки для работы с ORM
* TypeScript (будет плюсом)

### Нельзя использовать:
* Nuxt.js / Next.js


## Решение

### Описание

Приложение представляет собой API-сервис для создания блога. В нём реализованы функции регистрации и авторизации пользователя, создания постов, которые могут включать текст и медиафайлы
(изображения, аудио, видео). Информация по работе с запросами приведена ниже.

> Используемые технологии: Node.js, Express.js, PostgreSQL

> Сервер запущен на http://80.78.240.158


### Документация к конечным точкам

#### Регистрация пользователя 

```
/*REQUEST*/

{
    url: 'auth/registr'
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
    body: {
        email: string,
        password: string,
        firstName: string,
        lastName: string,
    }
}

/*RESPONSE*/

{
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    token: string,
}
```

#### Авторизация пользователя

```
/*REQUEST*/

{
    url: 'auth/login'
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
    body: {
        email: string,
        password: string,
    },
}

/*RESPONSE*/

{
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    token: string,
}
```

#### Выход из аккаунта

```
/*REQUEST*/

{
    url: 'auth/logout'
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'access-token': string,
    },
}

/*RESPONSE*/

User logout
```

#### Создание поста
Пост можно создать как с прикреплённым файлом, так и без него. 
Если создавать пост с файлом, то сначала нужно загрузить файл на сервер как описано в разделе "Загрузка файла", а потом полученный ID файла указать в поле ```fileId```. 

```
/*REQUEST*/

{
    url: 'post/create'
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'access-token: string,
    },
    body: {
        message: string,
        fileId: number (not required),
    },
}

/*RESPONSE*/

{
    id: number,
    message: string,
    UserId: number,
    updatedAt: string,
    createdAt: string,
}
```

#### Изменение поста

Если в посте нужно изменить прикреплённый файл, то необходимо в теле запроса передать ID удаляемого и загружаемого файлов (```prevFileId``` и ```newFileId``` соответственно).

```
/*REQUEST*/

{
    url: 'post/update'
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'access-token: string,
    },
    body: {
        postId: number,
        message: string,
        prevFileId: number,
        newFileId: number,
    },
}

/*RESPONSE*/

{
    id: number,
    message: string,
    UserId: number,
    updatedAt: string,
    createdAt: string,
}
```

#### Получение списка постов

Список постов выводится с пагинацией (20 постов в одном запросе). Необходимо передать аргумент `page` - номер страницы.

```
/*REQUEST*/

{
    url: 'post/list?page={number}'
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
}

/*RESPONSE*/

{
    count: number,
    rows: [
        {
            id: 5,
            message: string,
            createdAt: string,
            updatedAt: string,
            "UserId": number,
            "Files": [
                {
                    id: number,
                    name: string,
                    path: string,
                    createdAt: string,
                    updatedAt: string,
                    PostId: number,
                }
            ]
        }
        ...
    ]
}
```

#### Удаление поста

```
/*REQUEST*/

{
    url: 'post/delete'
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'access-token: string,
    },
    body: {
        postId: number,
    }
}

/*RESPONSE*/

Removed
```

#### Загрузка файла

Поддерживаемые типы файлов:
*   Изображения (jpg, jpeg, png)
*   Видео (mp4)
*   Аудио (mp3)
```
/*REQUEST*/

{
    url: 'file/upload'
    method: 'POST',
    headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
        'access-token': string,
    },
    body: {
        file: FileInput,
    }
}

/*RESPONSE*/

{
    id: number,
    name: string,
    path: string,
    PostId: null
}
```

