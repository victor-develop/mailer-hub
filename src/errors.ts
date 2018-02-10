import { BaseError } from 'make-error-cause';

export class SendMailError extends BaseError { }

export class AllMailerFailError extends SendMailError {
  constructor() {
    super('None of the mailers send the mail successfully.');
  }
}
