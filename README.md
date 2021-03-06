# duo-express-react

A React context to work with the duo-express package

## Purpose

This module works with the [duo-express](https://www.npmjs.com/package/duo-express) package. It provides a React context to manage the interactions with that express middleware.

## Installation

```
npm install --save duo-express-react
```

## DuoAuthProvider

In your top-level App.js (or equivalent):

```javascript
import { DuoAuthProvider } from 'duo-express-react';
const TEN_MINUTES = 600000;

<DuoAuthProvider redirectUri="/home" checkInterval={TEN_MINUTES}>
  <AppContent />
</DuoAuthProvider>;
```

The `DuoAuthProvider` accepts the following properties:

- `duoEndpoint` {string (path)}: The mount point for the `duo-express` middleware. The default is `/duo`.

- `redirectUri` {string (path)}: Where to go after successful authentication. You should specify this as described in the `duo-express` documentation. There is no default value.

- `checkInterval` {number (milliseconds)}: If specified, periodically performs a `GET` request to the `duo-express` middleware so the user is not signed out if they remain on the page. This will only work if the `rolling` session property is set to `true`. There is no default value.

Note: The provider always performs an intial `GET` request to determine if the user is signed in or not regardless of the `checkInterval` property.

## DuoAuthContext

In your JSX files, you can use the `DuoAuthContext` provided by the `DuoAuthProvider` by calling the `useDuoAuth()` function.

```javascript
import { useDuoAuth } from 'duo-express-react';

function MyComponent() {
  const auth = useDuoAuth();
  console.log(auth.state.username);
  ...
}
```

The `useDuoAuth()` function returns an object having the following properties:

- `state`: An object having one property, the `username`. Initially, this is `undefined` until the `DuoAuthProvider` receives a response to the initial `GET` request. After that, the username is either `null` (user authentication required) or a string (user is signed in).

- `login(username [, nopreauth])`: A function taking one or two parameters. This will perform the required Duo interactions and redirect to the value of the `redirectUri` parameter of the `DuoAuthProvider`. Unless `nopreauth` is true, this function performs a [preauthorization](https://duo.com/docs/authapi#/preauth) of the user and will throw an exception if the user is denied access. The error message will indicate the reason.

- `logout()`: A function that deletes the `duo` session object using the `duo-express` middleware and sets the `username` property in the state to `null`.

## DuoAuthLogin

Add the `DuoAuthLogin` component to your login page. Duo will create an iFrame in this component after you call the `auth.login(username)` function.

```javascript
import { DuoAuthLogin } from 'duo-express-react';

function Login() {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
      <DuoAuthLogin />
    </div>
  );
}
```

This is a contrived example. In reality, the `LoginForm` is a form you must create to get the user's username that is passed to the `auth.login(username)` function. The various `useState` and other related form constructs are not shown in this example.

## Development

The `DuoAuth.js` source code is in the `src` directory. Executing `npm run build` will run this file through `babel` and put the output into the `lib` directory where it is checked in as part of the distribution.

## License

MIT License

Copyright (c) 2020 Frank Hellwig

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
