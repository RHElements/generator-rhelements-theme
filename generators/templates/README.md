# RHElements <%= readmeName %> Theme

Styles RHElements

## Usage

`<%= themeName %>` requires...

### RequireJS / UMD
```html
<script>require(['/path/to/themes/<%= themeName %>/<%= themeName %>.umd.js'])</script>
```

### W3C Spec
```html
<link rel="stylesheet" href="/path/to/themes/<%= themeName %>/<%= themeName %>.css" />
```

## Dependencies

Make sure you have [Polyserve][polyserve] and [Web Component Tester][web-component-tester] installed.

    npm install -g polyserve web-component-tester

## Dev

    npm start

## Test

    npm run test

## Build

    npm run build

## Demo

Run `npm start` and Polyserve will start a server and open your default browser to the demo page of the element.

## Code style

<%= readmeName %> (and all RHElements) use [Prettier][prettier] to auto-format JS and JSON.  The style rules get applied when you commit a change.  If you choose to, you can [integrate your editor][prettier-ed] with Prettier to have the style rules applied on every save.

[prettier]: https://github.com/prettier/prettier/
[prettier-ed]: https://github.com/prettier/prettier/#editor-integration
[polyserve]: https://github.com/Polymer/polyserve
[web-component-tester]: https://github.com/Polymer/web-component-tester
