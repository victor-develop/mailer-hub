import { IHubMail } from '../../interfaces';

export const mailA = 'mailerhub.a@mailinator.com';
export const mailB = 'mailerhub.b@mailinator.com';
export const mailC = 'mailerhub.c@mailinator.com';
export const mailD = 'mailerhub.d@mailinator.com';

const text = 'This is a the text content of an email';

export const simpleEmail: IHubMail = {
  to: mailA,
  cc: undefined,
  bcc: undefined,
  subject: 'Sub: Simple Email',
  text,
};

export const mailCcBcc: IHubMail = {
  to: mailA,
  cc: mailB,
  bcc: mailC,
  subject: 'Sub: Simple Email',
  text,
};

export const mailMultipleCc: IHubMail = {
  to: mailA,
  cc: [mailD, mailB, mailC],
  bcc: undefined,
  subject: 'Sub: An email with multiple cc',
  text,
};

export const mailMultipleBcc: IHubMail = {
  to: mailA,
  cc: undefined,
  bcc: [mailD, mailB, mailC],
  subject: 'Sub: An email with multiple bcc',
  text,
};

export const mailWithoutRecipient = {
  subject: 'Sub: An email with no receipient',
  text,
};

