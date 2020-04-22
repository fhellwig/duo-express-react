# duo-express-react

A React context to work with the duo-express package

## Purpose

This module works with the [duo-express](https://www.npmjs.com/package/duo-express) package. It provides a React context to manage the interactions with that express middleware.

## Installation

```
npm install --save duo-express-react
```

## Usage

In your top-level App.js (or equivalent):

```javascript
import { DuoAuthProvider } from 'duo-express-react';

<DuoAuthProvider>...</DuoAuthProvider>;
```

The `DuoAuthProvider` accepts the following properties:

- `duoEndpoint` {string (path)}: The mount point for the `duo-express` middleware. The default is `/duo`.

- `redirectUri` {string (path)}: Where to go after successful authentication. You should specify this as described in the `duo-express` documentation. There is no default value.

- `checkInterval` {number (milliseconds)}: If specified, periodically performs a `GET` request to the `duo-express` middleware so the user is not signed out if they remain on the page. This will only work if the `rolling` session property is set to `true`. There is no default value.

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
