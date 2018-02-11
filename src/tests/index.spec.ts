import * as MailerHub from '../index';
import { makeMailerHubBuilder, Interfaces, ErrorTypes } from '../index';
import * as mailgunConfig from './data/secret/mailgun.secret';
import * as sendgridConfig from './data/secret/sendgrid.secret';
import { mailWithoutRecipient, mailA, mailB, mailC } from './data/emails';
import { assert } from 'chai';
import { IncompleteMailError } from '../errors';
import { testSendMail } from './send-mail.spec';

describe('try send email with MailerHub', () => {
  const builder = makeMailerHubBuilder();
  const mailHub = builder
  .addMailGun(mailgunConfig.default)
  .addSendGrid(sendgridConfig.default)
  .create();

  it('reject an email which has not enough attributes', () => {
    return mailHub.send(<any>mailWithoutRecipient)
      .catch(err => assert.instanceOf(err, IncompleteMailError));
  });

  it('sends a simple email. Promise resolved.', () => mailHub.send({
    to: mailA,
    cc: mailB,
    bcc: mailC,
    subject: 'Sample code: how to send email with this package',
    text: `Look into ${testSendMail.name}() for more information`,
  }));

  testSendMail(mailHub);
});

