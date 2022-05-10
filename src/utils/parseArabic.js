const parseArabic = number => {
  // PERSIAN (فارسی), ARABIC (عربي) , URDU (اُردُو)
  number = number
    .replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
      return d.charCodeAt(0) - 1632;
    })
    .replace(/[۰۱۲۳۴۵۶۷۸۹]/g, function (d) {
      return d.charCodeAt(0) - 1776;
    });
  return number;
};

export default parseArabic;
