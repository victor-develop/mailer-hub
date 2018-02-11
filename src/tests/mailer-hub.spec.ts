import { MailerHubBuilder, sendOnce } from '../mailer-hub';
import { AllMailerFailError } from '../errors';
import { assert } from 'chai';
import { simpleEmail } from './data/emails';
import { IMailer, IMailerHub } from '../interfaces';
import { MailGunMailer } from '../mailers/mailgun';
import * as mailgunConfig from './data/secret/mailgun.secret';
import * as sendgridConfig from './data/secret/sendgrid.secret';
import { SendGridMailer } from '../mailers/sendgrid';

const assertAllMailerFail = (mailers: IMailer[]) => sendOnce(mailers)(0, simpleEmail)
  .then(() => {
    throw new Error('this Promise should NOT be resolved.');
  })
  .catch(err => assert.instanceOf(err, AllMailerFailError));

describe('mailer-hub', () => {

  describe('sendOnce()', () => {

    const allMailerFail = 'reject with a AllMailerFailError';

    // mock mailers
    const badMailer: IMailer = {
      send: mail => Promise.reject(new Error()),
    };

    const goodMailer: IMailer = {
      send: mail => Promise.resolve(),
    };

    const logConsume = (mailer: IMailer) => {
      let consumeCount = 0;
      const loggedMailer = {
        send: (mail) => {
          consumeCount++;
          return mailer.send(mail);
        },
        count: () => consumeCount,
      };
      return loggedMailer;
    };

    describe('Case empty list of mailers', () => {
      const mailers = [];
      it(allMailerFail, () => assertAllMailerFail(mailers));
    });

    describe('A list of 2 mailers, none of which sends succesfully', () => {
      const mailers = [badMailer, badMailer];
      it(allMailerFail, () => assertAllMailerFail(mailers));
    });

    describe('First mailer successfully sends, in a list of three mailers', () => {
      const good = logConsume(goodMailer);
      const badA = logConsume(badMailer);
      const badB = logConsume(badMailer);
      const mailers = [good, badA , badB];
      it('consumes the first one and resolve promise', () => {
        return sendOnce(mailers)(0, simpleEmail)
          .then(() => assert.equal(good.count(), 1))
          .then(() => assert.equal(badA.count(), 0))
          .then(() => assert.equal(badB.count(), 0));
      });
    });

    describe('Only the third mailer works in a list of 4 mailers', () => {
      const badA = logConsume(badMailer);
      const badB = logConsume(badMailer);
      const badD = logConsume(badMailer);
      const goodC = logConsume(goodMailer);
      const mailers = [badA, badB, goodC, badD];
      const consumedOnce = mailer => assert.equal(mailer.count(), 1);
      const notConsumed = mailer => assert.equal(mailer.count(), 0);
      it('resolve promise without consuming the 4th mailer, but 1-3 mailer was consumed', () => {
        return sendOnce(mailers)(0, simpleEmail)
          .then(() => consumedOnce(badA))
          .then(() => consumedOnce(badB))
          .then(() => consumedOnce(goodC))
          .then(() => notConsumed(badD));
      });
    });
  });
});

describe(MailerHubBuilder.name, () => {
  describe('create IMailerHub with different list of mailers', () => {

    const mockMailerHub: IMailerHub = {
      send: mail => Promise.resolve(),
    };

    const mockCreate = condition => done => (mailers: IMailer[]) => {
      const has = mailers.filter(condition);
      assert.ok(has);
      done();
      return mockMailerHub;
    };

    describe(MailerHubBuilder.prototype.addMailGun.name, () => {
      it('has mailgun in its mailer list for creating MailerHub instance', (done) => {
        const createHub = mockCreate(mailer => mailer instanceof MailGunMailer)(done);
        new MailerHubBuilder(createHub).addMailGun(mailgunConfig.default).create();
      });
    });

    describe(MailerHubBuilder.prototype.addSendGrid.name, () => {
      it('has sendgrid in its mailer list for creating MailerHub instance', (done) => {
        const createHub = mockCreate(mailer => mailer instanceof SendGridMailer)(done);
        new MailerHubBuilder(createHub).addSendGrid(sendgridConfig.default).create();
      });
    });

    describe(MailerHubBuilder.prototype.addCustomMailer.name, () => {
      it('has the customer mailer in its mailer list for creating MailerHub instance', (done) => {
        const custom: IMailer = { send: mail => Promise.resolve() };
        const createHub = mockCreate(mailer => mailer === custom)(done);
        new MailerHubBuilder(createHub).addCustomMailer(custom).create();
      });
    });

  });
});
