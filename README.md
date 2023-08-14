# NodeJS-RabbitMQ

## Installation

`npm i`

### Usage

Сначала запустить

docker run -d -p 5672:5672 rabbitmq

Настройки в файле .env

Возможные варианты для настройки LOG_LEVEL :

-TRACE
-VERBOSE
-DEBUG
-INFO
-WARN
-ERROR
-CRITICAL


Для запуска проекта нужно запустить 2-а скрипта :

-npm run start-m1
-npm run start-m2


Проверка работы программы :
открыть в браузере http://localhost:8080/status

