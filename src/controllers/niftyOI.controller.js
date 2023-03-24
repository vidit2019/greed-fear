const cron = require('node-cron');
const logger = require('../config/logger');
const { runScript } = require('../nifty/script');

logger.info('reached niftyOI Controller');
global.isNiftyJobRunning = false;

const niftyJob = cron.schedule(
  '* * * * *',
  () => {
    logger.info('Running a job at every minute');
    global.isNiftyJobRunning = true;
    runScript();
  },
  {
    scheduled: false,
  }
);

cron.schedule(
  '5 9 * * 1-5',
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
  const currentTime = new Date();

  const desiredStartTime = new Date();
  desiredStartTime.setHours(9, 5, 0, 0); // Set desired time to 9:05 AM

  const desiredEndTime = new Date();
  desiredEndTime.setHours(15, 40, 0, 0); // Set desired time to 3:40 PM

  if (
    currentTime.getTime() > desiredStartTime.getTime() &&
    currentTime.getTime() < desiredEndTime.getTime() &&
    !global.isNiftyJobRunning
  ) {
    logger.info('some how the scripts was not started , starting it now');
    niftyJob.start();
  }

  if (currentTime.getTime() > desiredEndTime.getTime() && global.isNiftyJobRunning) {
    logger.info('some how the scripts was not stopped , stopping it now');
    niftyJob.stop();
  }
}, 1 * 30 * 1000);

// module.exports = { niftyJobInit };
