# NtSparkSearch back-end

[![N|Solid](https://cdn-images-1.medium.com/max/1600/0*kJRU-y-GlI_z0i7o.jpg)](https://nodejs.org/es/)

This project is the back-end of my alignment and sequence search platform. using Node + Express + MongoDB. It includes Webpack as module bundler + Mocha for tests and hot reloading using nodemon.


### Installation

Install the dependencies and devDependencies and start the Nodemon dev server.

```sh
$ npm install
$ npm start
```

For production environments...

```sh
$ npm build
```
For testing...

```sh
$ npm test
```
Hot reloading of tests (on build)

```sh
$ npm test:watch
```


### Development

You can start building your app by creating .ts classes inside the dao + bs + domain modules. You have available a connection factory builder for mongoDB but you could implement your own.

License
----

MIT

**Free Software, Hell Yeah!**