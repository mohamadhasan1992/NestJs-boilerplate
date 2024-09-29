پیاده سازی پروژه todo list با استفاده از فریمورک NestJS و دیتابیس MongoDB
ساختار مدل ها
TodoList: 
UserId
Title
TodoItems[]

TodoItem:
TodoList
Title
Description
Priority

User:
Id
Username
Password
TodoLists[]

پروژه باید با استفاده از معماری Clean Architecture و با استفاده از پترن های Saga, Event Driven, CQRS , Reposiroty و دیزاین DDD پیاده سازی شود. حداقل برای یکی از سرویس ها unit , e2e تست نوشته شود. 

نیازمندی ها:
کاربر بتواند ثبتنام کنم
کاربر بتواند به تعداد دلخواه Todo List ایجاد حذف یا ویرایش کند
کاربر بتواند به تعداد دخلواه Todo Item به یک Todo Listاضافه حذف یا ویرایش کند
ترتیب Todo Item ها در یک Todo List باید براساس Priority آنها باشد
کاربر باید بتواند Priority یک Todo Item را ویرایش کند