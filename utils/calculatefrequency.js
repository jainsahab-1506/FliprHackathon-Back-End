const calculatefrequency = (freq) => {
  if (freq.period === "Recuuring") {
    var freq = "*/" + freq.seconds + "* * * * *";
    return freq;
  } else if (freq.period === "Weekly") {
    var freq = freq.minutes + " " + freq.hours + " * * " + freq.day;
    return freq;
  } else if (freq.period === "Monthly") {
    var freq = freq.minutes + " " + freq.hours + " * * " + freq.dayOfMonth;
    return freq;
  } else {
    var freq =
      freq.minutes +
      " " +
      freq.hours +
      " " +
      freq.dayOfMonth +
      " " +
      freq.month +
      " *";
    return freq;
  }
};
