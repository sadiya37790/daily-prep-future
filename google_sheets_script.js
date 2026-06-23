// =========================================================================================
// GOOGLE SHEETS APPS SCRIPT BACKEND PROXY (v3.5.0)
// =========================================================================================
// Instructions:
// 1. Create a Google Sheet and name it (e.g., "DailyPrep Database").
// 2. Click "Extensions" > "Apps Script" in the top menu.
// 3. Delete any default code in the editor, and paste the code below.
// 4. Click the Save icon (floppy disk).
// 5. Click "Deploy" > "New deployment".
// 6. Select type "Web app".
// 7. Configure:
//    - Description: DailyPrep Backend
//    - Execute as: Me (your-email@gmail.com)
//    - Who has access: Anyone
// 8. Click "Deploy", authorize permissions, and copy the "Web app URL".
// 9. Paste this URL into LEADERBOARD_DB_URL at the top of your app.js file.
// =========================================================================================

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var users = [];
  
  // Skip header row (row 0)
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0]) { // If username is present
      users.push({
        username: row[0].toString(),
        email: row[1] ? row[1].toString() : "",
        xp: parseInt(row[3]) || 0,
        level: parseInt(row[4]) || 1,
        streak: parseInt(row[5]) || 0,
        completedTodayCount: parseInt(row[6]) || 0
      });
    }
  }
  
  // Sort users by XP descending for the leaderboard
  users.sort(function(a, b) { return b.xp - a.xp; });
  
  return ContentService.createTextOutput(JSON.stringify(users))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var response = { status: "error", message: "Invalid request" };
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    var action = data.action;
    
    // Check if sheet is empty, insert header row if it is
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Username", "Email", "Password", "XP", "Level", "Streak", "CompletedTodayCount", "LastUpdated"]);
      rows = sheet.getDataRange().getValues(); // Refresh rows
    }
    
    // CASE 1: SIGNUP
    if (action === "signup") {
      var username = data.username.trim();
      var email = data.email.trim();
      var password = data.password.trim();
      
      var exists = false;
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][0] && rows[i][0].toString().trim().toLowerCase() === username.toLowerCase()) {
          exists = true;
          response = { status: "error", message: "Username is already taken." };
          break;
        }
        if (rows[i][1] && rows[i][1].toString().trim().toLowerCase() === email.toLowerCase()) {
          exists = true;
          response = { status: "error", message: "An account with this email already exists." };
          break;
        }
      }
      
      if (!exists) {
        sheet.appendRow([username, email, password, 0, 1, 0, 0, new Date()]);
        response = { status: "success", username: username, email: email };
      }
    }
    
    // CASE 2: LOGIN
    else if (action === "login") {
      var identifier = data.identifier.trim();
      var password = data.password.trim();
      var found = false;
      
      for (var i = 1; i < rows.length; i++) {
        var rowUsername = rows[i][0] ? rows[i][0].toString() : "";
        var rowEmail = rows[i][1] ? rows[i][1].toString() : "";
        var rowPassword = rows[i][2] ? rows[i][2].toString() : "";
        
        if (rowUsername.trim().toLowerCase() === identifier.toLowerCase() || rowEmail.trim().toLowerCase() === identifier.toLowerCase()) {
          found = true;
          
          // Legacy Account Migration: If password cell is empty/blank in the sheet, claim/save the typed password
          if (rowPassword === "") {
            sheet.getRange(i + 1, 3).setValue(password);
            rowPassword = password;
          }
          
          // Allow login if password matches, or if it is a google-linked account
          if (rowPassword === password || rowPassword === "google-linked-account") {
            response = {
              status: "success",
              username: rowUsername,
              email: rowEmail,
              xp: parseInt(rows[i][3]) || 0,
              level: parseInt(rows[i][4]) || 1,
              streak: parseInt(rows[i][5]) || 0,
              lastUpdated: rows[i][7] ? rows[i][7].toString() : ""
            };
          } else {
            response = { status: "error", message: "Invalid email, username, or password." };
          }
          break;
        }
      }
      
      if (!found) {
        response = { status: "error", message: "Invalid email, username, or password." };
      }
    }
    
    // CASE 3: FORGOT PASSWORD (VERIFY EMAIL)
    else if (action === "forgot") {
      var email = data.email.trim();
      var found = false;
      
      for (var i = 1; i < rows.length; i++) {
        var rowUsername = rows[i][0] ? rows[i][0].toString() : "";
        var rowEmail = rows[i][1] ? rows[i][1].toString() : "";
        var rowPassword = rows[i][2] ? rows[i][2].toString() : "";
        
        if (rowEmail.trim().toLowerCase() === email.toLowerCase() || rowUsername.trim().toLowerCase() === email.toLowerCase()) {
          found = true;
          response = {
            status: "success",
            username: rowUsername,
            email: rowEmail,
            password: rowPassword // Send old password (useful for migration/checks)
          };
          break;
        }
      }
      
      if (!found) {
        response = { status: "error", message: "No account found with this email address." };
      }
    }
    
    // CASE 4: RESET PASSWORD (UPDATE TO NEW PASSWORD)
    else if (action === "reset_password") {
      var email = data.email.trim();
      var newPassword = data.password.trim();
      var found = false;
      
      for (var i = 1; i < rows.length; i++) {
        var rowUsername = rows[i][0] ? rows[i][0].toString() : "";
        var rowEmail = rows[i][1] ? rows[i][1].toString() : "";
        
        if (rowEmail.trim().toLowerCase() === email.toLowerCase()) {
          found = true;
          // Update the Password cell in the sheet (Column 3, which is Column C)
          sheet.getRange(i + 1, 3).setValue(newPassword);
          response = {
            status: "success",
            username: rowUsername,
            email: rowEmail
          };
          break;
        }
      }
      
      if (!found) {
        response = { status: "error", message: "No account found with this email address." };
      }
    }
    
    // CASE 5: STATS SYNCHRONIZATION (DEFAULT FALLBACK)
    else {
      var username = data.username;
      var email = data.email;
      var xp = data.xp;
      var level = data.level;
      var streak = data.streak;
      var completedTodayCount = data.completedTodayCount;
      var password = data.password;
      var found = false;
      
      for (var i = 1; i < rows.length; i++) {
        var rowUsername = rows[i][0] ? rows[i][0].toString() : "";
        var rowEmail = rows[i][1] ? rows[i][1].toString() : "";
        
        if (rowUsername.trim().toLowerCase() === username.trim().toLowerCase() || (email && rowEmail.trim().toLowerCase() === email.trim().toLowerCase())) {
          found = true;
          var rowIndex = i + 1;
          sheet.getRange(rowIndex, 1).setValue(username);
          if (email) sheet.getRange(rowIndex, 2).setValue(email);
          
          // Save password if not empty and it's a standard password upgrade
          if (password && password !== "google-linked-account") {
            var oldPass = sheet.getRange(rowIndex, 3).getValue();
            if (oldPass === "" || oldPass === "google-linked-account") {
              sheet.getRange(rowIndex, 3).setValue(password);
            }
          }
          sheet.getRange(rowIndex, 4).setValue(xp);
          sheet.getRange(rowIndex, 5).setValue(level);
          sheet.getRange(rowIndex, 6).setValue(streak);
          sheet.getRange(rowIndex, 7).setValue(completedTodayCount);
          sheet.getRange(rowIndex, 8).setValue(new Date());
          response = { status: "success", message: "Stats synced successfully." };
          break;
        }
      }
      
      if (!found) {
        sheet.appendRow([username, email, password, xp, level, streak, completedTodayCount, new Date()]);
        response = { status: "success", message: "User registered and stats synced successfully." };
      }
    }
  } catch(e) {
    response = { status: "error", message: e.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
