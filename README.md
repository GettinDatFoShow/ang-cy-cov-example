As a front end developer its very easy to get wrapped up in the fine tuning of that perfect web application. If you have multiple people working together, its can sometimes be annoying when someone else's change tends to skew the looks or functionality of your component. There haven't really been any great testing frameworks that test applications visually the way a user does. Not until now at least. 
Cypress.io is an amazing framework designed for complete top down testing of your application. Written by front end developers, for front end developers. For those of us working in companies though, we may need to still provide a report to show that the coverage of our tests still reach a percentage of the code base. Although, krama/jasmin has this built in, cypress leaves that to us to implement. Here I'll walk you through the easy set up.

**Note: This walk-through is meant for Angular version 8 and above.** 

First we will start off by generating a fresh new Angular application 
```
  ng new ang-cy-cov-example
```
It does not matter if you add routing or which type of style you use for the purpose of this walk-through

Install cypress-schematic to switch from protractor to cypress e2e framework 
```
  npm i -D  @briebug/cypress-schematic
```
Add the schematic as a dependency to your project.
```
  ng add @briebug/cypress-schematic
```
This will prompt you to remove protractor, answer y

Open up **cypress/integration/spec.ts** and change 
```javascript
it("loads examples", () => {
  cy.visit("http://localhost:4200");
  cy.contains("Replace me with something relevant");
});

```
to 
```javascript
it("loads examples", () => {
  cy.visit("http://localhost:4200");
  cy.contains("we are doing big things!");
});
```
Open up **src/app/app.component.html** and change the following:
```html
<span>Learn Angular</span>
```
to 
```html
<span>we are doing big things!</span>
```
now we can check to see if our schematic set up correctly by running
```
ng e2e
```
After your angular server begins, cypress will open showing your test.
![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/xg6ck9db1vzymxb4370u.png)
click on spec.ts and watch your first successful test!
![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/vjeni9pra9ltcozkgot3.png)

Now this is all very fun and exciting, but now on to the professional stuff. That good old coverage report.

Next we will add a few files.
First you will need to add **coverage.webpack.js** to your **cypress/** folder
```
touch cypress/coverage.webpack.js
```
inside the file, paste this code.
```javascript
module.exports = {
    module: {
      rules: [
        {
          test: /\.(js|ts)$/,
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true },
          enforce: 'post',
          include: require('path').join(__dirname, '..', 'src'),
          exclude: [
            /\.(e2e|spec)\.ts$/,
            /node_modules/,
            /(ngfactory|ngstyle)\.js/
          ]
        }
      ]
    }
  };
```

next we will add **cy-ts-preprocessor.js** to your **cypress/plugins/** folder
```
touch cypress/plugins/cy-ts-preprocessor.js
```
inside the file, paste this code.
```javascript
const wp = require('@cypress/webpack-preprocessor')

const webpackOptions = {
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  }
}

const options = {
  webpackOptions
}

module.exports = wp(options)
```
Then we will add a new builder
```
npm i -D ngx-build-plus
```
proceed to your **angular.json** file and alter your serve configuration to look like this, to use the ngx-build with extra config.
```javascript
{
"serve": {
          "builder": "ngx-build-plus:dev-server",
          "options": {
            "browserTarget": "cypress-angular-coverage-example:build",
            "extraWebpackConfig": "./cypress/coverage.webpack.js"
          }
}
```
Add to Instrument JS files with istanbul-lib-instrument for subsequent code coverage reporting
```
npm i -D istanbul-instrumenter-loader
```
Make Istanbul understand your Typescript source file
```
npm i -D @istanbuljs/nyc-config-typescript source-map-support ts-node
```
proceed to your **package.json** and include the following configuration 
```javascript
{
 "nyc": {
    "extends": "@istanbuljs/nyc-config-typescript",
    "all": true
  }
}
```
If you are still following great! I realize its a little tedious but we are almost there.
Next, install the cypress code coverage plugin
```
npm install -D @cypress/code-coverage nyc istanbul-lib-coverage
```
Then we need to add a few lines to some cypress files.
first open **cypress/support/index.js** and add the following.
```javascript
import './commands';

// Import cypress code-coverage collector plugin
import '@cypress/code-coverage/support';
```

next open **cypress/plugins/index.js** and replace
```javascript
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
}
```
with 
```javascript
const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor')

module.exports = on => {
  on('file:preprocessor', cypressTypeScriptPreprocessor);

  // enable code coverage collection
  on('task', require('@cypress/code-coverage/task'));
}
```
now, we should have arrived, we can now run the following 
```
ng run ang-cy-cov-example:cypress-run
```
this should open cypress and run your tests then close. you will then be able to see the newly generated **.nyc-output** and **coverge** folders in your project tree.
![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/g3g6eble9k7jmvo33p7k.png)

This will also generate an html page for you that looks like this.
![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/le67u435oww34rd7xdoi.png)

Thanks and I really hope this helps you all. 
Also, check out my npm package for those who are trying to generate reports using mocha/mochawesome report generator here [cy-report-setup-helper](https://www.npmjs.com/package/cy-report-setup-helper)
Please feel free to connect on linked in for any questions or just to link up. 
[Robert Morris on Linked in](https://www.linkedin.com/in/robert-morris-desu-vet/) 
follow me on twitter 
[Robert Morris on Twitter](https://twitter.com/CSsoldierVOIF)
Github
[Gettindatfoshow](https://github.com/gettindatfoshow)
Blogspot
[CsSoldier](https://cssoldier.blogspot.com/)
