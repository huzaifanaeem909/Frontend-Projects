"use strict";

window.ACCESS_POINT = "https://api.edamam.com/api/recipes/v2";
const API_ID = "e5c70757";
const API_KEY = "7cf1f0c344a3f8757cd5e8967260b1c8";
const TYPE = "public";

/*
 * @param {Array} queries (Query Array)
 * @param {Function} successCallback
 */

export const fetchData = async function (queries, successCallback) {
  const query = queries?.join("&")
    .replace(/,/g, "=")
    .replace(/ /g, "%20")
    .replace(/\+/g, "%2B");

  const url = `${ACCESS_POINT}?app_id=${API_ID}&app_key=${API_KEY}&type=${TYPE}${query ? `&${query}` : ""}`;

  const response = await fetch(url);

  if (response.ok){
    const data = await response.json()
    successCallback(data);
  }
};

