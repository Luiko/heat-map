const express = require('express');
const webpack = require('webpack');
const options = require('./webpack.config');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

const devices = [];

app.get('/', function handleRoute(req, res) {
  const time = Date.now();
  devices.push(time);
  res.cookie('device', time, { maxAge: 10 * 60 * 1000 });
  res.sendFile('index.html', { root: __dirname + '/docs/' });
});
app.use(express.static('./docs'));

const listen = () => app.listen(8000, () => console.log('server listening in port ' + 8000));

if (process.env.NODE_ENV === 'development') {

  app.get('/reload',
          (req, res) => res.send(!devices.includes(Number(req.cookies.device)))
  );
  webpack(options).run(function (err, stats) {
    if(err) {
      console.error(err);
      return;
    }
    console.log(stats.toString());
    listen();
  });
} else listen();
