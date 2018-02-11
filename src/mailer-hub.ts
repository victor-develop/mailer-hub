import { IMailerHub, IMailer, IHubMail, IMailGunConfig, ISendGridConfig } from './interfaces';
import * as mailgun from './mailers/mailgun';
import * as sendgrid from './mailers/sendgrid';
import { AllMailerFailError } from './errors';


export type sendOnceFunc = (mailers: IMailerHub[]) =>
  (ith: number, mail: IHubMail) => Promise<any>;

export const sendOnce:sendOnceFunc = mailers =>
  (ith, mail) =>
      mailers[ith].send(mail)
        .catch((err) => {
          if (ith !== mailers.length) {
            return sendOnce(mailers)(ith + 1, mail);
          }
          return Promise.reject(new AllMailerFailError());
        });


const buildMailerHub = (mailers: IMailerHub[]) => {

  const hub: IMailerHub = {
    send: (mail: IHubMail) => sendOnce(mailers)(0, mail),
  };

  return hub;
};

export class MailerHubBuilder {

  private mailers: IMailer[] = [];

  constructor(private createHub: (mailers: IMailer[]) => IMailerHub) {

  }

  public addMailGun(config: IMailGunConfig) {
    this.mailers.push(mailgun.build(config));
    return this;
  }

  public addSendGrid(config: ISendGridConfig) {
    this.mailers.push(sendgrid.build(config));
    return this;
  }

  public addCustomMailer(mailer: IMailer) {
    this.mailers.push(mailer);
    return this;
  }

  public create(): IMailerHub {
    return this.createHub(this.mailers);
  }

}

export const makeMailerHubBuilder = () => new MailerHubBuilder(buildMailerHub);
