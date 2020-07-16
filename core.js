/*
 * @Descripttion:
 * @version: v1
 * @Author: Edison Mo
 * @Date: 2020-07-13 01:31:16
 * @LastEditors: Edison Mo
 * @LastEditTime: 2020-07-16 20:09:50
 */
const fs = require("fs");

const {
  getCountries,
  getProvinces,
  getInstitutions,
  getWebStores,
} = require("./apis");
const {
  promiseForEach,
  findFileRecursively,
  readDirRecursively,
  deleteDirRecursively,
} = require("./util");

const originDir = `./export/origin`;
const institutionsDir = `./export/institutions`;
const provincesDir = `./export/provinces`;

module.exports.buildExpectedData = function (orginDir, scanDir, targetDir) {
  if (!fs.existsSync(orginDir)) {
    fs.mkdirSync(orginDir, { recursive: true });
  }
  if (!fs.existsSync(scanDir)) {
    fs.mkdirSync(scanDir, { recursive: true });
  }
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const originalFiles = readDirRecursively(orginDir);
  originalFiles.forEach((oriFile) => {
    const data = require(oriFile);
    if (data.length) {
      const file = oriFile.split("/").pop();
      const ret = findFileRecursively(scanDir, file);
      if (!ret) {
        exportData(`${targetDir}/${file}`, data);
      }
    }
  });

  function exportData(path, data) {
    // const reg = /.*\/(([^\/]*)-(.*)-(.*)-(.*)-(.*)\.json)$/;
    fs.writeFileSync(path, JSON.stringify(data, null, "\t"), {
      encoding: "utf-8",
    });
  }
};

module.exports.buildPointedRegionData = function buildPointedRegionData(
  options
) {
  const {
    CountryIsoAlpha2Code,
    CountryIsoAlpha3Code,
    CountryName,
  } = options.country;
  const provinces = require(`./export/provinces/${CountryName}.json`);

  const expectedDataDir = `./export/expected/${CountryName}/${new Date().toDateString()}`;

  if (!fs.existsSync(expectedDataDir)) {
    fs.mkdirSync(expectedDataDir, { recursive: true });
  }

  if (options.province) {
    const { CountryName } = options.country;
    const { ProvinceName, ProvinceCode } = options.province;
    const institutions = require(`${institutionsDir}/${CountryName}/${ProvinceName}.json`);
    promiseForEach(
      institutions,
      ({ InstitutionID, OrganizationName, SubsectorCode }) => {
        return new Promise(async (resolve, reject) => {
          if (!fs.existsSync(`${originDir}/${InstitutionID}.json`)) {
            const webstoreCheckRets = await getWebStores(
              CountryIsoAlpha3Code,
              InstitutionID
            );
            fs.writeFileSync(
              `${originDir}/${InstitutionID}.json`,
              JSON.stringify(
                webstoreCheckRets.map((ret) => ({
                  ...options.country,
                  ...options.province,
                  ProvinceName,
                  CountryIsoAlpha3Code,
                  InstitutionID,
                  OrganizationName,
                  SubsectorCode,
                  ProvinceCode,
                  ...ret,
                })),
                null,
                "\t"
              ),
              { encoding: "utf-8" }
            );
            console.log(`${InstitutionID}.json is done`);
          } else {
            console.log(`File ${InstitutionID}.json exists...next`);
          }
          resolve();
        });
      }
    )
      .then((ret) => {
        // done
      })
      .catch((err) => {
        // fail
      });

    return;
  }

  if (provinces.length) {
    promiseForEach(
      provinces,
      ({ CountryIsoAlpha3Code, ProvinceCode, ProvinceName }) => {
        return new Promise((resolve, reject) => {
          const institutions = require(`${institutionsDir}/${CountryName}/${ProvinceName}.json`);
          promiseForEach(
            institutions,
            ({ InstitutionID, OrganizationName, SubsectorCode }) => {
              return new Promise(async (resolve, reject) => {
                if (!fs.existsSync(`${originDir}/${InstitutionID}.json`)) {
                  const webstoreCheckRets = await getWebStores(
                    CountryIsoAlpha3Code,
                    InstitutionID
                  );
                  fs.writeFileSync(
                    `${originDir}/${InstitutionID}.json`,
                    JSON.stringify(
                      webstoreCheckRets.map((ret) => ({
                        ...options.country,
                        ProvinceName,
                        CountryIsoAlpha3Code,
                        InstitutionID,
                        OrganizationName,
                        SubsectorCode,
                        ProvinceCode,
                        ...ret,
                      })),
                      null,
                      "\t"
                    ),
                    { encoding: "utf-8" }
                  );
                  console.log(`${InstitutionID}.json is done`);
                } else {
                  console.log(`File ${InstitutionID}.json exists...next`);
                }
                resolve();
              });
            }
          )
            .then((ret) => {
              // done
              resolve();
            })
            .catch((err) => {
              // fail
              reject();
            });
        });
      }
    )
      .then((ret) => {
        // done
      })
      .catch((err) => {
        // fail
      });
  } else {
  }
};

module.exports.buildExportDirs = function () {
  if (!fs.existsSync(institutionsDir)) {
    fs.mkdirSync(institutionsDir, {
      recursive: true,
    });
  }

  if (!fs.existsSync(provincesDir)) {
    fs.mkdirSync(provincesDir, {
      recursive: true,
    });
  }

  if (!fs.existsSync(originDir)) {
    fs.mkdirSync(originDir, {
      recursive: true,
    });
  }
};

module.exports.buildCountriesData = function () {};

module.exports.buildProvincesData = function () {};

module.exports.buildInstitutionsData = function () {};

module.exports.buildWebstoreCheckRetsData = function () {
  const list = readDirRecursively("./export/institutions");
  const countries = require("./export/countries.json");
  promiseForEach(list, (path) => {
    return new Promise((resolve, reject) => {
      const institutions = require(path);
      promiseForEach(
        institutions,
        ({
          CountryIsoAlpha3Code,
          InstitutionID,
          OrganizationName,
          SubsectorCode,
          ProvinceCode,
        }) => {
          const country = countries
            .filter(
              (country) => country.CountryIsoAlpha3Code === CountryIsoAlpha3Code
            )
            .pop();
          const { CountryName } = country;
          const provinces = require(`./export/provinces/${CountryName}.json`);
          const province = provinces
            .filter((province) => province.ProvinceCode === ProvinceCode)
            .pop();

          return new Promise(async (resolve, reject) => {
            if (!fs.existsSync(`${originDir}/${InstitutionID}.json`)) {
              const webstoreCheckRets = await getWebStores(
                CountryIsoAlpha3Code,
                InstitutionID
              );

              fs.writeFileSync(
                `${originDir}/${InstitutionID}.json`,
                JSON.stringify(
                  webstoreCheckRets.map((ret) => ({
                    ...country,
                    ...province,
                    CountryIsoAlpha3Code,
                    InstitutionID,
                    OrganizationName,
                    SubsectorCode,
                    ProvinceCode,
                    ...ret,
                  })),
                  null,
                  "\t"
                ),
                { encoding: "utf-8" }
              );
              console.log(`build ${InstitutionID} json data`);
            }
            resolve();
          });
        }
      )
        .then((ret) => {
          // done
          resolve();
        })
        .catch((err) => {
          // fail
          reject();
        });
    })
      .then((ret) => {
        // done
      })
      .catch((err) => {
        // fail
      });
  });
};
