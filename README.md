# QL-db

QL-db is a library apart of the QL-dev framework. This library is designed to help beginner coders get started with storing persistent data using the in browser local storage. This library allows for beginner developers to create databases, collections and documents with an ORM syntax similar to other tools. By using QL-db, beginner developers can focus on creating simple, yet functional applications and storing persistent data while only needing to learn browser based JS and no complex array or object mapping.

## How to use

This git repo contains the README documenting the functionality of this library as well as the library file itself. You can easily use QL-db in your project by requiring the script in your HTML file and instantiating the QL-db object.

```index.html```

```html
<script charset="utf-8" src="QLdb.js" type="text/javascript"></script>
<script defer charset="utf-8" src="app.js" type="text/javascript"></script>
```

```app.js```

```javascript
const DB = new QLdb('database');
```

Alternatively you can download the full [QL-dev starter project](https://github.com/jwoodrow99/QL-dev/archive/refs/heads/main.zip). All you have to do is unzip it and start coding!
