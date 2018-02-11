import { IMailer, IHubMail, IMailGunConfig, sendMail } from '../interfaces';
import * as MailGun from 'mailgun-js';

export function build(config: IMailGunConfig): IMailer {

  const mailGun = MailGun({ apikey: config.apiKey, domain: config.domain });

  const sender = `${config.senderAcc}@${config.domain}`;

  const mailer = new MailGunMailer((mail: IHubMail) => {
    const data = {
      from: sender,
      to: mail.to,
      cc: mail.cc,
      bcc: mail.bcc,
      subject: mail.subject,
      text: mail.text,
    };
    return new Promise((resolve, reject) => {
      (<any>mailGun).messages().send(data, (err: any, body: any) => {
        if (err) {
          // TODO: log error
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
