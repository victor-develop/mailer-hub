import { MailerHubBuilder } from '../mailer-hub';

describe('MailerHub', () => {
  describe('sendOnce()', () => {
    const allMailerFail = 'reject with a AllMailerFailError';
    describe('Case empty list of mailers', () => {
      it(allMailerFail);
    });
    describe('A list of 2 mailers, none of which sends succesfully', () => {
      it(allMailerFail);
    });
    describe('First mailer successfully sends, in a list of two mailers', () => {
      it('resolve promise without consuming the remaining mailers');
    });
    describe('Only the third mailer works in a list of 4 mailers', () => {
      it('resolve promise without consuming the 4th mailer, but 1-3 mailer was consumed');
    });
  });
});

describe(MailerHubBuilder.name, () => {
  describe('create IMailerHub with different list of mailers', () => {
    describe(MailerHubBuilder.prototype.addMailGun.name, () => {
      it('has mailgun in its mailer list for creating MailerHub instance');
    });
    describe(MailerHubBuilder.prototype.addSendGrid.name, () => {
      it('has sendgrid in its mailer list for creating MailerHub instance');
    });
    describe(MailerHubBuilder.prototype.addCustomMailer.name, () => {
      it('has the customer mailer in its mailer list for creating MailerHub instance');
    });
  });
});

