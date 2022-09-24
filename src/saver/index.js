const dotenv = require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { GoogleSpreadsheet } = require('google-spreadsheet');

// the file saved above
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

(async function () {
  // configure credential
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  });
}());

const INFO_SHEET = 'Info Data';
const IMAGE_SHEET = 'Image Data';

async function addToGoogleSheet(data) {
  // load info
  await doc.loadInfo();

  // info data sheet
  const infoSheet = doc.sheetsByTitle[INFO_SHEET];
  // image data sheet
  const imageSheet = doc.sheetsByTitle[IMAGE_SHEET];

  const infoArr = [];
  const imageArr = [];

  // convert data format
  data.forEach((val) => {
    const uuid = uuidv4();
    infoArr.push({
      uuid,
      Title: val.title,
      Author: val.author,
      Like: val.like,
      Date: val.date,
      Link: val.link,
    });

    imageArr.push([uuid, val.title, ...val.contentImages]);
  });

  // write to target sheet
  await infoSheet.addRows(infoArr);
  await imageSheet.addRows(imageArr);
}

module.exports = {
  addToGoogleSheet,
};
