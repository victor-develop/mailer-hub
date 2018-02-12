# MailerHub
This package integrates multiple email service providers e.g. MailGun, SendGrid, when you use this package to send an email, it will try to send an email with each of its integrated services until success. That means, as long as you have at least one email service provider up and running, the email will be sent successfully.

As this package is still at its unstable version, you are not encourage to use at the moment.

Currently MailGun and SendGrid are supported, more email services might be added in later.

## Getting Started

 - install the package
  ```sh
    npm install --save vicdotdev-mailer-hub
  ```
 - set up mailer hub with your own api keys (you can sign up at MailGun and SendGrid's site)
 - then try to send an email
  ```javascript
      const mailerHubLib = require('vicdotdev-mailer-hub');
      const makeMailerHubBuilder = mailerHubLib.makeMailerHubBuilder;
      const ErrorTypes = mailerHubLib.ErrorTypes;

      // set up mailers, i.e. email service provider
      const builder = makeMailerHubBuilder();
      const mailHub = builder
      .addMailGun({
          apiKey: 'key-xxxxxxxxxxxxxxxxxxxxxxxxxxx',
          domain: 'sandboxxxxxxxxxxxxxxxxxxxxxxxxx.mailgun.org',
          senderAcc: 'postmaster',
      })
      .addSendGrid({
          apiKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          domain: 'sendgrid.sandbox',
          senderAcc: 'postmaster',
      })
      .create();

      // send an email
      mailHub.send({
          to: 'someone@example.org',
          cc: 'someonecc@example.org',
          bcc: 'someonebcc@example.org',
          subject: 'Sample code: how to send email with this package',
          text: `And more information in paragrahs`,
      })
      .then(() => {
        console.log('email was sent sucessfully');
      })
      .catch((err) => {
        if (err instanceof ErrorTypes.IncompleteMailError) {
          // this means you did not provide enough fields: to, subject, text
        } else if (err instanceof ErrorTypes.BadMailError) {
          // not sure what's wrong, but the mistake is in the email itself, not server side
        }
        if (err instanceof ErrorTypes.AllMailerFailError) {
          // this means all of your email services provider failed to send this email,
        }
      })
  ```
Note that you can also pass an array of email addresses for `to`, `cc`, `bcc`.


## TypeScript support
This project was written in typescript. You can look for function signatures from the .d.ts.

## Development

If you want to further develop this package by your own:

```sh
  git clone <this repo github clone address>
  cd <this repo>
  npm intall
```

### Run the tests
Note that you have to to rename `./src/tests/data/secret/xxxxx.secret.exmaple.ts` back to `./src/tests/data/secret/xxxxx.secret.ts`. Then fill in your own api keys and domain settings in the files. Then you can run

```sh
  npm test
  # you should see the following output
  try send email with MailerHub
    ✓ reject an email which has not enough attributes
    ✓ sends a simple email. Promise resolved. (1364ms)
    mailer function send
      ✓ sends a simple email. Promise resolved. (874ms)
      ✓ sends an email with multiple cc. Promise resolved. (898ms)
      ✓ sends an email with cc and bcc. Promise resolved. (912ms)
      ✓ sends an email with multiple bcc. Promise resolved. (912ms)
      ✓ sends an email without receipient. Promise rejected

  mailer-hub
    sendOnce()
      Case empty list of mailers
        ✓ reject with a AllMailerFailError
      A list of 2 mailers, none of which sends succesfully
        ✓ reject with a AllMailerFailError
      First mailer successfully sends, in a list of three mailers
        ✓ consumes the first one and resolve promise
      Only the third mailer works in a list of 4 mailers
        ✓ resolve promise without consuming the 4th mailer, but 1-3 mailer was consumed

  MailerHubBuilder
    create IMailerHub with different list of mailers
      addMailGun
        ✓ has mailgun in its mailer list for creating MailerHub instance
      addSendGrid
        ✓ has sendgrid in its mailer list for creating MailerHub instance
      addCustomMailer
        ✓ has the customer mailer in its mailer list for creating MailerHub instance

  mailers/mailgun
    function build
      ✓ can build a instance of MailGunMailer
    MailGunMailer class
      try send email with MailGun sdk
        mailer function 
          ✓ sends a simple email. Promise resolved. (826ms)
          ✓ sends an email with multiple cc. Promise resolved. (911ms)
          ✓ sends an email with cc and bcc. Promise resolved. (897ms)
          ✓ sends an email with multiple bcc. Promise resolved. (1068ms)
          ✓ sends an email without receipient. Promise rejected (902ms)

  mailers/sendgrid
    function build
      ✓ can build a instance of SendGridMailer
    SendGridMailer class
      try send email with SendGrid sdk
        mailer function 
          ✓ sends a simple email. Promise resolved. (329ms)
          ✓ sends an email with multiple cc. Promise resolved. (343ms)
          ✓ sends an email with cc and bcc. Promise resolved. (292ms)
          ✓ sends an email with multiple bcc. Promise resolved. (341ms)
          ✓ sends an email without receipient. Promise rejected
  26 passing (11s)  
```

__Caution__: If you are using MailGun's sandbox domain, running these tests will use up your sandbox message limit pretty quickly, by that time your tests against MailGun service will __fail__, and you will see console error messages  __Error: message limit reached__. You might see timeout failure due to network latency, then try re-run it or just increase the timeout.

### Build 
```sh
  npm run build
```
### Directory Structure

Below shows a glance of the source code folder

```sh
  src                                       
  ├── errors.ts                               # publicly exposed error types
  ├── index.ts                                # lib entrance
  ├── interfaces.ts                           # interfaces (data model)
  ├── mailer-hub.ts                           # main component, the abstraction layer of multiple email services
  ├── mailers                                 # specific email service providers
  │   ├── mailgun.ts
  │   └── sendgrid.ts
  └── tests                                   # test files and data
      ├── data
      │   ├── emails.ts
      │   └── secret
      │       ├── mailgun.secret.exmaple.ts
      │       ├── mailgun.secret.ts           # this is not committed to git repo. you have to fill in your own.
      │       ├── sendgrid.secret.example.ts
      │       └── sendgrid.secret.ts          # this is not committed to git repo. you have to fill in your own.
      ├── index.spec.ts
      ├── mailer-hub.spec.ts
      ├── mailers
      │   ├── mailgun.spec.ts
      │   └── sendgrid.spec.ts
      └── send-mail.spec.ts
```

### Major Components

Below shows the major components in this package, and they were carefully tested.

![major components](./doc/major-components.png)

 - __IMailerHub__: This is the object to be used by other parties to send an email
 - __MailerHubBuilder__: Users are supposed to input their configuration of different email service provider(i.e. ___mailer__) and build a __IMailerHub__ object
 - __IMailer__: one __IMailer__ represents exatly __one specific email service provider__.
 - __sendOnce__: a core function responsible for sending ONE successful email among many email servicer providers(they are called __mailers__ in code). This function plays the logic of __fail over__.

### Challenges and Limitations

#### Error cause hints
Because this package hides the email service providers from users' sight, it becomes a bit hard to tell the user what's going wrong when a failure happens. There should be a very robust logic to identify the different type of errors, e.g. when a user fail to send a email with all email service providers, it's probably that user input the wrong information, but it can also because of incorrect apikeys. I already implemented some checks and try to disdinguish the types of errors, as exposed in __index.ts__. 

#### Inevitable feature: Logging
Due to time limitation I have not implemented this but this is incredibly important if this package is for production. Altought it hides different email service providers from users, I do believe that it should enable users to investigate and monitor what's happening in case of unexpected issues. I guess a possible way is to expose subscribable log stream or events.

## TODOs
 - Validate credentials of different email service providers upon the creation of 
 - Log each time of send email and how many services were tried. Expose the log for package users to retrive. E.g. via events;
 

## Acknowledgements

https://www.twilio.com/blog/2017/06/writing-a-node-module-in-typescript.html
