export default class CustomError extends Error {
  public httpCode: number;
  public muted: boolean;

  constructor(httpCode: number, message: string, muted: boolean = true) {
    super(message);
    this.httpCode = httpCode;
    this.muted = muted;
  }
}
