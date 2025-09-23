import moment from "moment-jalaali";

export default class datetime {
  static getDiff = () => {};

  static toLocaleString(date) {
    return moment(date).format("YYYY-MM-DD HH:mm");
  }

  static gregorianToJalali(gregorianDate) {
    const jalaliDate = moment(gregorianDate).format("jYYYY/jMM/jDD HH:mm");
    return jalaliDate;
  }
  static jalaliDateToGregorian(jalaliDate) {
    if (!jalaliDate) return null;

    const gregorianDate = moment(jalaliDate, "jYYYY-jMM-jDD").format(
      "YYYY-MM-DD"
    );
    return gregorianDate;
  }
  static separateDateAndTime(date) {
    let dateArray = date.split(" ");
    return {
      date: dateArray[0],
      time: dateArray[1],
    };
  }
}
