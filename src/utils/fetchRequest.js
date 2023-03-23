const axios = require('axios');
const logger = require('../config/logger');

const getDataFromNSE = async (dataURL) => {
  return axios
    .get(dataURL)
    .then(async (response) => {
      // handle success
      const { records } = response.data;
      // console.log(records)
      return records;
    })
    .catch((error) => {
      // handle error
      logger.error(error);
      throw error;
    });
};

module.exports = { getDataFromNSE };
