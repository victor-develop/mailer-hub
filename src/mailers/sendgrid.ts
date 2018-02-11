import * as sendGrid from '@sendgrid/mail';
import { IMailer, IHubMail, ISendGridConfig, sendMail } from '../interfaces';
import { BadMailError } from '../errors';


export function build(config: ISendGridConfig): IMailer {
  sendGrid.setApiKey(config.apiKey);
  const sender = `${config.senderAcc}@${config.domain}`;
  const mailer: IMailer = new SendGridMailer((mail: IHubMail) => {
    const data = {
      from: sender,
      to: mail.to,
      cc: mail.cc,
      bcc: mail.bcc,
      subject: mail.subject,
      text: mail.text,
    };
    return sendGrid.send(data)
      .catch((err) => {
        return Promise.reject(err);
      });
  });
  return mailer;
}

export class SendGridMailer implements IMailer {
  constructor(public readonly send: sendMail) {

  }
}
