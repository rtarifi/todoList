# todoList

CRUD operations for a to do list application (Status: **work in progress**)

## Couchdb
Install Couchdb version 1.x. For reference on how to install check: https://docs.couchdb.org/en/stable/install/index.html

Then start couchedb on port 5984 (default)

## Backend
Navigate to the backend directory

Install dependencies
```
npm install
```

Run the following command to set up the database with the required design documents & sample data that include a profile & its tasks.
```
npm run setUpDb.js
```
And then run server
```
node index.js
```
## Frontend
Navigate to the frontend directory 

Install dependencies
```
npm install
```

Run the dev server
```
npm run start
```


## Login
Login credentials for an existing profile to test login
```
username: rtarifi
password: testing123
```
