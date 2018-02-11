import { IMailer, IHubMail, IMailGunConfig, sendMail, MailReceipients } from '../interfaces';
import * as MailGun from 'mailgun-js';
import { BadMailError } from '../errors';

const arrayToComma = (people: MailReceipients) => {
  if (people instanceof Array) {
    return people.join(',');
  }
  return people;
};

export function build(config: IMailGunConfig): IMailer {

  const mailGun = MailGun({ apiKey: config.apiKey, domain: config.domain });

  const sender = `${config.senderAcc}@${config.domain}`;

  const mailer = new MailGunMailer((mail: IHubMail) => {
    const data: any = {
      from: sender,
      subject: mail.subject,
      text: mail.text,
    };

    const copyReceipients = (key) => {
      if (mail[key] !== undefined) {
        data[key] = arrayToComma(mail[key]);
      }
    };

    copyReceipients('cc');
    copyReceipients('bcc');
    copyReceipients('to');

    return new Promise((resolve, reject) => {
      (<any>mailGun).messages().send(data, (err: any, body: any) => {
        if (err) {
          reject(err);
        }
        resolve(body);
      });
    });
  });
  return mailer;
}

export class MailGunMailer implements IMailer {
  constructor(public readonly send: sendMail) {

  }
}
