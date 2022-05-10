export const engNumbers = str => {
  const arabicNumbers = [
    /٠/g,
    /١/g,
    /٢/g,
    /٣/g,
    /٤/g,
    /٥/g,
    /٦/g,
    /٧/g,
    /٨/g,
    /٩/g,
  ];

  if (typeof str === 'string') {
    for (var i = 0; i < 10; i++) {
      str = str.replace(arabicNumbers[i], i);
    }
  }
  return str;
};
