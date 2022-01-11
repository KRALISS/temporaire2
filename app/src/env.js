module.exports = {
    version: 410,
    testMenuEnabled: true,
    dayLabel(num) {
      const days = { 1: "Tue 4/18", 2: "Wed 4/19" };
      return days[num] || `Day ${num}`;
    }
  };