// =====================================================
// TrendVault — Google Apps Script for Email Collection
// =====================================================
//
// SETUP INSTRUCTIONS:
//
// 1. Go to Google Sheets (sheets.google.com) and create a new spreadsheet
//    - Name it "TrendVault Subscribers" (or whatever you like)
//    - Create two sheets (tabs) at the bottom:
//      - "Subscribers" (for email signups)
//      - "Contacts" (for contact form messages)
//
// 2. In the "Subscribers" sheet, add these headers in Row 1:
//    A1: Email | B1: Date | C1: Source Page
//
// 3. In the "Contacts" sheet, add these headers in Row 1:
//    A1: Name | B1: Email | C1: Topic | D1: Message | E1: Date
//
// 4. Go to Extensions > Apps Script
//
// 5. Delete everything in the editor and paste ALL the code below
//
// 6. Click the floppy disk icon (Save) or Ctrl+S
//
// 7. Click Deploy > New deployment
//    - Click the gear icon next to "Select type" > choose "Web app"
//    - Description: "TrendVault Email Collector"
//    - Execute as: "Me"
//    - Who has access: "Anyone"
//    - Click "Deploy"
//
// 8. Authorize the app when prompted (click through the "unsafe" warning)
//
// 9. Copy the Web app URL (looks like: https://script.google.com/macros/s/xxxxx/exec)
//
// 10. Open script.js in your TrendVault project
//     - Find the line: const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
//     - Replace YOUR_GOOGLE_APPS_SCRIPT_URL_HERE with your copied URL
//
// That's it! Emails will now flow into your Google Sheet automatically.
// =====================================================

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);

    if (data.type === 'contact') {
      // Contact form submission -> "Contacts" sheet
      var contactSheet = ss.getSheetByName('Contacts');
      if (!contactSheet) {
        contactSheet = ss.insertSheet('Contacts');
        contactSheet.appendRow(['Name', 'Email', 'Topic', 'Message', 'Date']);
      }
      contactSheet.appendRow([
        data.name,
        data.email,
        data.topic,
        data.message,
        data.date
      ]);
    } else {
      // Email subscription -> "Subscribers" sheet
      var subSheet = ss.getSheetByName('Subscribers');
      if (!subSheet) {
        subSheet = ss.insertSheet('Subscribers');
        subSheet.appendRow(['Email', 'Date', 'Source Page']);
      }

      // Check for duplicate emails
      var emails = subSheet.getRange('A:A').getValues().flat();
      if (emails.indexOf(data.email) !== -1) {
        return ContentService.createTextOutput(
          JSON.stringify({ status: 'duplicate', message: 'Email already subscribed' })
        ).setMimeType(ContentService.MimeType.JSON);
      }

      subSheet.appendRow([
        data.email,
        data.date,
        data.source || 'unknown'
      ]);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success' })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', message: 'TrendVault Email Collector is running' })
  ).setMimeType(ContentService.MimeType.JSON);
}
