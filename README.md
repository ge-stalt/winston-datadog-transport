A logging and alerting transport for winston, using the Datadog https transport. See https://www.datadoghq.com/ and https://github.com/winstonjs/winston

## Github

https://github.com/outwithreality/winston-datadog-transport

## Installation

### Installing winston-datadog-transport via npm

``` sh
  $ npm install winston
  $ npm install winston-datadog-transport
```
(or add it to your package.json)

## Usage


And in your code...

``` js
  var winston = require('winston');
  
  //
  // Requiring `winston-datadog-transport` will expose
  // `winston.transports.datadog`
  //
  require('winston-datadog-transport').datadog;
var winstontransportdatadog = require('winston-datadog-transport');
  options = {
  app_key:'<Your Datsdog API key>',
  api_key:'<Your Datadog APP key>',
  name:''
  }
  
  winston.add(winston.transports.datadog, options);
```
Logs with "error' or 'warning' severity are passed up as Datadog events.

Logs with 'info' severity are passed up as metrics - the "meta" data is in the standard Datadog format. No event is logged.

## Unsupported
This transport does not support :

* **streaming**
* **querying**


[0]: https://github.com/flatiron/winston
