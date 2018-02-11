import { BaseError } from 'make-error-cause';
import { requiredMailAttr } from './interfaces';

export class SendMailError extends BaseError { }

export class BadMailError extends SendMailError {
  constructor(cause = null, msg = null) {
    const errMsg = msg || 'Somehing wrong with the email. Check the email addresses you provided.';
    super(errMsg, cause);
  }
}

export class IncompleteMailError extends BadMailError {
  constructor(cause = null) {
    super(null, `Pleaes complete all fileds: ${requiredMailAttr.join(',')}`);
  }
}

export class AllMailerFailError extends SendMailError {
  constructor(cause = null) {
    super('All email services failed to send this email', cause);
  }
}
