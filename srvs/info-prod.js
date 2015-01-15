'use strict';

var redisIP = process.env.REDIS_IP || 'localhost';
var beanstakIP = process.env.BEANSTALK_IP || 'localhost';
var influxIP = process.env.INFLUX_IP || 'localhost';

require('seneca')()
  .use('redis-transport')
  .use('beanstalk-transport')
  .use('collector', { host: influxIP, database: 'stats', seriesName: 'actions' })
  .use('../info.js')
  .client({host: redisIP, type:'redis',pin:'role:info,req:part'})
  .listen({host: redisIP, type:'redis',pin:'role:info,res:part'})
  .listen({host: beanstakIP, port: 1130, type: 'beanstalk', pin: 'role:info,cmd:*'});

