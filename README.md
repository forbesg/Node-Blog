# A Simple Node Express Site

## TODO

* Add post ID to user.author.posts hwn post is added
* Option to Update Account Details
* Ability to delete user - should also delete all users posts and relating images

> **Note To Self**

> ***Using http://node-blog.192.168.0.101.nip.io:3000 to access from other local devices***

> NIP.io - [http://nip.io/](http://nip.io/)

#### Node Blog

The application is built using Node JS, Express and Mongo DB so will require these to be installed locally.

```bash
  git clone https://github.com/forbesg/Node-Blog.git Node-Blog && cd Node-Blog
  npm install
```

#### Requires server/config/config.js to be added

Add your application to Google, Facebook & Twitter to obtain the keys/secret to include below.

The callback URL will also need to be set up with these services.

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
