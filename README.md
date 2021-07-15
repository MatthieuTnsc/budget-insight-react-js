# Budget Insight API example using React JS + React-Bootstrap + Axios

React JS example to consume the [Budget Insight API](http://budget-insight.com) endpoints.

### What's inside

- React JS
- React Bootstrap
- Axios (for API call)

### Prerequisites

     $ node --version
     v14.15.4

     $ npm --version
     6.14.10

## Installation

#### Clone project

    $ cd PROJECT
    # install dependencies
    $ npm install

#### Configure app

Create .env file at the root and add Budget Insight base URL & client ID to it:

     REACT_APP_API_BASE_URL = 'https://{your-app}.biapi.pro/2.0'
     REACT_APP_API_CLIENT_ID = '{your-client-id}'$ npm install

#### Start & watch

    # serve with hot reload at localhost:3000
    $ npm start

#### Simple build for production

    # build for production with minification
    $ npm run build

#### Functionalities:

- User registration
- User login
- Create a new connection with webview
- Listing all connections and associated accounts
- Managing all connections and associated accounts (Change status, Force sync, Update credentials, Delete connection)
- Listing all accounts and associated balances
