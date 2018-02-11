
export type sendMail = (email: IHubMail) => Promise<any>;

export interface IMailerHub {
  send: sendMail;
}

// Email Service Provider
export interface IMailer {
  send: sendMail;
}

export type MailAddr = string;

export type MailReceipients = MailAddr | MailAddr[];

export const requiredMailAttr = ['to', 'subject', 'text'];

export interface IHubMail {
  to: MailReceipients;
  cc: MailReceipients | undefined;
  bcc: MailReceipients | undefined;
  subject: string;
  text: string;
}

export interface IMailGunConfig {
  apiKey: string;
  domain: string;
  senderAcc: string;
}

export interface ISendGridConfig {
  apiKey: string;
  domain: string;
  senderAcc: string;
}
