/**
 * Google Apps Script for AI Portfolio Database Synchronization
 * 
 * Instructions:
 * 1. Open Google Sheets (create a new blank sheet or use your existing sheet).
 * 2. In Google Sheets, click Extensions > Apps Script.
 * 3. Replace all code in the script editor with this file's contents.
 * 4. Click Save (disk icon).
 * 5. Click "Deploy" > "New deployment".
 * 6. Under "Select type", choose "Web app".
 * 7. Set:
 *    - Description: "AI Portfolio Sync Webhook"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (crucial for webhook to connect from local backend)
 * 8. Click "Deploy", review permissions, and copy the Web App URL (ends with /exec).
 * 9. Paste this URL into the application's "Google Sheets Sync Center" in the UI.
 */

function doPost(e) {
  try {
    var rawData = e.postData.contents;
    var parsed = JSON.parse(rawData);
    var portfolioData = parsed.portfolioData;

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Iterate over each category in portfolioData
    for (var sheetName in portfolioData) {
      if (portfolioData.hasOwnProperty(sheetName)) {
        var rows = portfolioData[sheetName];
        updateSheet(ss, sheetName, rows);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Portfolio successfully synchronized with Google Sheets!",
      timestamp: new Date().toISOString(),
      sheetsUpdated: Object.keys(portfolioData)
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var result = {};

    sheets.forEach(function(sheet) {
      var sheetName = sheet.getName();
      var data = sheet.getDataRange().getValues();
      if (data.length > 1) {
        var headers = data[0];
        var rows = [];
        for (var i = 1; i < data.length; i++) {
          var rowObj = {};
          for (var j = 0; j < headers.length; j++) {
            rowObj[headers[j]] = data[i][j];
          }
          rows.push(rowObj);
        }
        result[sheetName] = rows;
      }
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      data: result,
      sheetUrl: ss.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function updateSheet(ss, sheetName, rows) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  if (!rows || rows.length === 0) {
    sheet.appendRow(["No records"]);
    return;
  }

  // Extract headers
  var headers = Object.keys(rows[0]);
  sheet.appendRow(headers);

  // Style Header
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#1E293B"); // Slate dark
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  sheet.setFrozenRows(1);

  // Append data rows
  var dataMatrix = [];
  for (var i = 0; i < rows.length; i++) {
    var rowValues = [];
    for (var j = 0; j < headers.length; j++) {
      var val = rows[i][headers[j]];
      rowValues.push(val !== undefined && val !== null ? val : "");
    }
    dataMatrix.push(rowValues);
  }

  if (dataMatrix.length > 0) {
    sheet.getRange(2, 1, dataMatrix.length, headers.length).setValues(dataMatrix);
  }

  // Auto-resize columns
  for (var c = 1; c <= headers.length; c++) {
    sheet.autoResizeColumn(c);
  }
}
