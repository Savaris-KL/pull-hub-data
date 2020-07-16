/*
 * @Descripttion:
 * @version: v1
 * @Author: Edison Mo
 * @Date: 2020-07-12 14:27:24
 * @LastEditors: Edison Mo
 * @LastEditTime: 2020-07-12 15:31:17
 */

const https = require("https");
const unirest = require("unirest");

module.exports.getWebStores = async function getWebStores(
  countryCode,
  institutionId
) {
  return await new Promise((resolve, reject) => {
    https
      .get(
        `https://e5webservices.onthehub.com/data/v3/institutions/${institutionId}/webstores?countryCode=${countryCode}&ProgramCode=&callback=angular.callbacks._f`,
        (res) => {
          let provinces = "";
          res.on("data", (d) => {
            provinces += d.toString();
          });

          res.on("end", () => {
            const reg = /angular\.callbacks\._f\((\[[^\n\f\r]*\])\)/;
            const ret = reg.test(provinces);
            if (ret) {
              const $1 = RegExp.$1;
              resolve(JSON.parse($1));
            }
          });
        }
      )
      .on("error", (e) => {
        console.error(e);
        reject(e);
      });
  });
};

/**
 * 教育机构
 * @param {*} countryCode
 * @param {*} provinceCode
 */
module.exports.getInstitutions = async function getInstitutions(
  countryCode,
  provinceCode
) {
  return await new Promise((resolve, reject) => {
    https
      .get(
        `https://e5webservices.onthehub.com/data/v3/institutions?countryCode=${countryCode}&provinceCode=${provinceCode}&callback=angular.callbacks._7`,
        (res) => {
          let provinces = "";
          res.on("data", (d) => {
            provinces += d.toString();
          });

          res.on("end", () => {
            const reg = /angular\.callbacks\._7\((\[[^\n\f\r]*\])\)/;
            const ret = reg.test(provinces);
            if (ret) {
              const $1 = RegExp.$1;
              resolve(JSON.parse($1));
            }
          });
        }
      )
      .on("error", (e) => {
        console.error(e);
        reject(e);
      });
  });
};

/**
 * 省份
 * @param {*} countryCode
 */
module.exports.getProvinces = async function getProvinces(countryCode) {
  return await new Promise((resolve, reject) => {
    https
      .get(
        `https://e5webservices.onthehub.com/data/v3/provinces?countryCode=${countryCode}&callback=angular.callbacks._1`,
        (res) => {
          let provinces = "";
          res.on("data", (d) => {
            provinces += d.toString();
          });

          res.on("end", () => {
            const reg = /angular\.callbacks\._1\((\[[^\n\f\r]*\])\)/;
            const ret = reg.test(provinces);
            if (ret) {
              const $1 = RegExp.$1;
              resolve(JSON.parse($1));
            }
          });
        }
      )
      .on("error", (e) => {
        console.error(e);
        reject(e);
      });
  });
};

/**
 * 国家
 */
module.exports.getCountries = async function getCountries() {
  return await new Promise((resolve, reject) => {
    https
      .get(
        "https://e5webservices.onthehub.com/data/v3/countries?callback=angular.callbacks._0",
        (res) => {
          let countries = "";
          res.on("data", (d) => {
            countries += d.toString();
          });

          res.on("end", () => {
            const reg = /angular\.callbacks\._0\((\[[^\n\f\r]*\])\)/;
            const ret = reg.test(countries);
            if (ret) {
              const $1 = RegExp.$1;
              resolve(JSON.parse($1));
            }
          });
        }
      )
      .on("error", (e) => {
        console.error(e);
        reject(e);
      });
  });
};
