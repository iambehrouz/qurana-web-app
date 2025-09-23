import config from "./../config.json";

export default class {
  static apiUrl = config.apiUrl;
  static storageUrl = "";
  static cookieDomain = "";
  static requestTimeout = 20000;
  static successMessage = "عملیات مورد نظر با موفقیت انجام شد.";
  static errorMessage = "خطایی در سیستم رخ داده است مجدد تلاش کنید.";
  static notificationTimeout = 5;
}
