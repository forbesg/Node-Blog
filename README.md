# A Simple Node Express Site

## TODO

* Edit process - Still to complete update image

> **Note To Self**

> ***Using http://node-blog.192.168.0.101.nip.io:3000 to access from other local devices***

#### Node Blog

The application is built using Node JS, Express and Mongo DB so will require these to be installed locally. 

```bash
  git clone https://github.com/forbesg/Node-Blog.git Node-Blog && cd Node-Blog
  npm install
```

#### Requires server/config/config.js to be added

```javascript
  module.exports = {
    google: {
      clientID: '********************',
      clientSecret: '********************',
      callbackURL: "your-domain/auth/google/callback"
    },
    facebook: {
      clientID: '********************',
      clientSecret: '********************',
      callbackURL: "your-domain/auth/facebook/callback"
      profileFields: ['displayName', 'email', 'name', 'photos']
    },
    twitter: {
      consumerKey: '********************',
      consumerSecret: '********************',
      callbackURL: "http://192.168.0.100:3000/auth/twitter/callback"
    }
  }
```

To start the dev server

```bash
  npm start
```

To access the application open [http://127.0.0.1:3000](http://127.0.0.1:3000)
