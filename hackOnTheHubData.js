/*
 * @Descripttion:
 * @version: v1
 * @Author: Edison Mo
 * @Date: 2020-07-12 11:09:40
 * @LastEditors: Edison Mo
 * @LastEditTime: 2020-07-16 20:10:20
 */

const { findFileRecursively } = require("./util");
const {
  buildWebstoreCheckRetsData,
  buildExpectedData,
  buildExportDirs,
  buildPointedRegionData,
} = require("./core");

// buildExportDirs();

// buildWebstoreCheckRetsData();

// buildPointedRegionData({
//   country: {
//     CountryIsoAlpha2Code: "US",
//     CountryIsoAlpha3Code: "USA",
//     CountryName: "United States",
//   },
//   province: {
//     CountryIsoAlpha3Code: "USA",
//     ProvinceCode: "CA",
//     ProvinceName: "California",
//   },
// });

buildExpectedData(
  "./export/origin",
  "./export/expected",
  `./export/expected/United States/California/${new Date().toDateString()}`
);
