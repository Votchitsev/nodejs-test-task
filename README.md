# Тествое задание для разработчика Node.js

> Необходимо разработать API для блога на Node.js

## Требования к заданию:

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

## Можно использовать:
* База данных может быть PostgreSQL или MongoDB
* Возможность express
* Библиотеки для работы с ORM
* TypeScript (будет плюсом)

## Нельзя использовать:
* Nuxt.js / Next.js
