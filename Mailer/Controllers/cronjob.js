const cron = require("node-cron");
// const manager = require("./../../App");
const { Chain } = require("./../../chains/model");
const setcronjob = async (req, res) => {
  const chainid = req.params.id;

  var task = cron.schedule(
    "*/20 * * * * *",
    async () => {
      const chain = await Chain.findOne({ _id: chainid });
      console.log(chain);
    },
    {
      scheduled: false,
    }
  );
  //   map["ntask"] = task;
  // for some condition in some code

  //   console.log(url_taskMap);
  //   const chain = await Chain.findOneAndUpdate(
  //     { _id: chainid },
  //     { cronjobname: "ntask" }
  //   );
  //   const chain = await Chain.findOne({ _id: chainid });
  //   console.log(chain);
  //   let my_job = url_taskMap[chain.cronjobname];
  //   my_job.start();
  res.send("Done");
  //   console.log(chain.cronjobname);
  //   var newt = task;
  //   console.log(newt);
  //   newt.start();

  //  console.log(cron.validate("5 * * * * *"));
};
module.exports = setcronjob;
