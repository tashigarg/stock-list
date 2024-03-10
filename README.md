## Stock List Application

This page fetches and let user review the stocks watch list and perform basic operation of deleting the stock entry from it.
It also provides basic support on filtering on tag .

## Install
### `cd <project_root>`
###`npm install` 
Needed for testing in development environment. It also ensures json-server is installed and available for use. 

## Usage

### `npm run start-server`
json server should start at PORT 3000


### Production environment UI Launch
`cd dist`

Launch index.html in browser \
`open ./index.html`


### Development environment UI Launch
 `cd <project_root>`\
`npm start`
 Runs the app in the development mode.\
 Open [http://localhost:8080](http://localhost:8080) to view it in the browser.



## Available Scripts


### `npm run build`

1. Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.

### `npm start`
2. In the project directory, you can run this script to run the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.


### `npm start-server`
3. In the project directory, running this script with start the json server and serve the data from db.json inside data directory.


## Project Libraries

[AntD](https://ant.design/) library was used as presentation layer on this React + Typescript based project. \
[JSON-Server](https://www.npmjs.com/package/json-server) was used to build the mock backend server


## Limitation
The Stock list page handles fetch of list. On top of it, it also has support of filtering on tag that server side. This can further be enhanced to support server side pagination and sorting.

## Assumption
Port 3000 is free and kept for json-server as it is currently hardcoded. The code can also further enhanced to read the port from a file that contains the json server port in case default 3000 port is not available.
