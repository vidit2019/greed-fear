const cron = require('node-cron');
const logger = require('../config/logger');
const { runScript } = require('../nifty/script');

logger.info('reached niftyOI Controller');
let isNiftyJobRunning = false;

const niftyJob = cron.schedule(
  '* * * * *',
  () => {
    logger.info('Running a job at every minute');
    isNiftyJobRunning = true;
    runScript();
  },
  {
    scheduled: false,
  }
);

cron.schedule(
  '59 11 * * 1-5',
  () => {
    logger.info('Running a job at 09:00 at Asia/Kolkata timezone');
    niftyJob.start();
  },
  {
    scheduled: true,
    timezone: 'Asia/Kolkata',
  }
);

cron.schedule(
  '40 15 * * 1-5',
  () => {
    logger.info('Stopping Job at 3:30 P.M.');
    niftyJob.stop();
  },
  {
    scheduled: true,
    timezone: 'Asia/Kolkata',
  }
);

setInterval(() => {
  /** if currentime is greater then 3:40 IST then stop niftyJob */
  const now = new Date();
  const options = { timeZone: 'Asia/Kolkata' };
  const indianTime = now.toLocaleTimeString('en-IN', options);

  console.log(indianTime); // output: 11:30:00 AM

  if (indianTime > '9:10:00 AM' && indianTime < '3:40:00 PM' && !isNiftyJobRunning) {
    niftyJob.start();
  }
  if (indianTime > '3:40:00 PM' && isNiftyJobRunning) {
    niftyJob.stop();
    isNiftyJobRunning = false;
  }
}, 2 * 60 * 1000);

// module.exports = { niftyJobInit };
