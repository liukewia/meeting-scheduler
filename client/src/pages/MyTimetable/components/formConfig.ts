export const formRules = {
  titleRules: [
    {
      required: true,
      message: "请输入约会的标题。",
    },
  ],
  eventTimeRules: [
    {
      type: "array",
      required: true,
      message: "请注明约会的开始和结束。",
    },
    {
      validator: async (_, eventTime) => {
        const now = new Date();
        const minutesDelay = 5;
        const dateAfterDelay = now;
        //console.log(`Initial values: Now: ${now}\n minutesDelay: ${minutesDelay}\n dateAfterDelay: ${dateAfterDelay}\n`);
        dateAfterDelay.setMinutes(now.getMinutes() - minutesDelay);
        //console.log(`End values: Now: ${now}\n minutesDelay: ${minutesDelay}\n dateAfterDelay: ${dateAfterDelay}\n`);
        if (eventTime && eventTime[0].toDate() < dateAfterDelay) {
          return Promise.reject(new Error("开始时间早于当前时间"));
        }
      },
    },
    {
      validator: async (_, eventTime) => {
        if (eventTime && eventTime[0].toDate() > eventTime[1].toDate()) {
          return Promise.reject(new Error("结束日期/时间不能在初始日期之后"));
        }
      },
    },
  ],
  patientNameRules: [
    {
      required: true,
      message: "请输入患者姓名.",
    },
  ],
};
