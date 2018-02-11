import * as mailgun from '../../mailers/mailgun';
import * as mailgunConfig from '../data/secret/mailgun.secret';
import { testSendMail } from '../send-mail.spec';
import { simpleEmail } from '../data/emails';
import { assert } from 'chai';

describe('mailers/mailgun', () => {

  describe(`function ${mailgun.build.name}`, () => {
    it(`can build a instance of ${mailgun.MailGunMailer.name}`, (done) => {
      const mailer = mailgun.build(mailgunConfig.default);
      assert.instanceOf(mailer, mailgun.MailGunMailer);
      done();
    });
  });

  describe(`${mailgun.MailGunMailer.name} class`, () => {
    describe('try send email with MailGun sdk', () => {
      testSendMail(mailgun.build(mailgunConfig.default));
    });
  });

});
