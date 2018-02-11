import { IMailer, IMailerHub } from './../interfaces';
import * as emails from './data/emails';
import { assert } from 'chai';
import { BadMailError } from '../errors';

export function testSendMail(mailer: IMailer | IMailerHub) {
  describe(`mailer function ${mailer.send.name}`, () => {
    it('sends a simple email. Promise resolved.', () => mailer.send(emails.simpleEmail));
    it('sends an email with multiple cc. Promise resolved.', () => mailer.send(emails.mailMultipleCc));
    it('sends an email with cc and bcc. Promise resolved.', () => mailer.send(emails.mailCcBcc));
    it('sends an email with multiple bcc. Promise resolved.', () => mailer.send(emails.mailMultipleBcc));

    it('sends an email without receipient. Promise rejected', () => {
      return mailer.send(<any>emails.mailWithoutRecipient)
        .then((whatever) => {
          throw new Error('a email without receipient. Promise should NOT be resolved');
        })
        .catch((err) => {
          return assert.ok(true);
        });
    });
  });
}
