export type sendMail = (msg: IHubMail) => Promise<any>;

export interface IMailerHub {
  send: sendMail;
}

// Email Service Provider
export interface IMailer {
  send: sendMail;
}

export type MailAddr = string;

export type MailReceipients = MailAddr | MailAddr[];

export interface IHubMail {
  to: MailReceipients;
  cc: MailReceipients;
  bcc: MailReceipients;
  subject: string;
  text: string;
}

export interface IMailGunConfig {
  apikey: string;
  domain: string;
  senderAcc: string;
}

export interface ISendGridConfig {
  apiKey: string;
  domain: string;
  senderAcc: string;
}
