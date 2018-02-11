import { IMailerHub, IMailer, IHubMail, IMailGunConfig, ISendGridConfig, requiredMailAttr } from './interfaces';
import * as mailgun from './mailers/mailgun';
import * as sendgrid from './mailers/sendgrid';
import { AllMailerFailError, IncompleteMailError, BadMailError } from './errors';


export type sendOnceFunc = (mailers: IMailerHub[]) =>
  (ith: number, mail: IHubMail) => Promise<any>;

export const validateMailRequirement = (mail: IHubMail): Promise<any> => {
  const hasRequired = requiredMailAttr.map(attr => attr in mail)
    .filter(res => res !== true)
    .length === 0;
  if (!hasRequired) {
    return Promise.reject(new IncompleteMailError());
  }
  return Promise.resolve(true);
};

export const sendOnce:sendOnceFunc = mailers =>
  (ith, mail) => {
    if (ith < 0 || ith > mailers.length) {
      return Promise.reject(new Error('index argument out of bound'));
    }
    if (ith === mailers.length) {
      return Promise.reject(new AllMailerFailError());
    }
    return mailers[ith].send(mail)
      .catch((err) => {
        if (err instanceof BadMailError) {
          throw err;
        }
        // else, failover to another service
        return sendOnce(mailers)(ith + 1, mail);
      });
  };

const buildMailerHub = (mailers: IMailerHub[]) => {

  const hub: IMailerHub = {
    send: (mail: IHubMail) => validateMailRequirement(mail)
      .then(() => sendOnce(mailers)(0, mail)),
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
