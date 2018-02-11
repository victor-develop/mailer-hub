import * as sendgrid from '../../mailers/sendgrid';
import * as sendGridConfig from '../data/secret/sendgrid.secret';
import { simpleEmail } from '../data/emails';
import { assert } from 'chai';
import { testSendMail } from '../send-mail.spec';


describe('mailers/sendgrid', () => {
  const className = sendgrid.SendGridMailer.name;
  describe(`function ${sendgrid.build.name}`, () => {

    it(`can build a instance of ${className}`, (done) => {
      const mailer = sendgrid.build(sendGridConfig.default);
      assert.instanceOf(mailer, sendgrid.SendGridMailer);
      done();
    });
  });

  describe(`${className} class`, () => {
    describe('try send email with SendGrid sdk', () => {
      testSendMail(sendgrid.build(sendGridConfig.default));
    });
  });
});
