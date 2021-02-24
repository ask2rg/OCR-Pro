
//     ************    Function for URL File   ***************************

function ocrByURL(e){
  var Action, setFileas;  
    
  try {         
    var fileURL = e.imageFileUrl;  
    var OCRlang = e.languagelistURL;  
    var isSecretFile = e.isSecretFileURL;
    
    var file = UrlFetchApp.fetch(fileURL, {muteHttpExceptions: true});    
    var UploadStatus = "File Fetch Successfully!";
     
    Logger.log( fileURL + " OCR Language: " + OCRlang);    
     
  } catch (m) {
    UploadStatus = m.toString();
    Logger.log( m.toString());
  }
  
 
  
  if(UploadStatus == "File Fetch Successfully!"){
    
    var blob = file.getBlob();
    
    var resource = {
      title: blob.getName(),
      mimeType: blob.getContentType()
    };
          
     
    // If OCR language Selected
    // Enable the Advanced Drive API Service
    if(OCRlang == "DefaultLang" || OCRlang == "MultiLang"){       
      var fileId = Drive.Files.insert(resource, blob, {ocr: true}).id;      
    } else {      
      var fileId = Drive.Files.insert(resource, blob, {ocr: true, ocrLanguage: OCRlang}).id;      
    }
       

    try{
      var doc = DocumentApp.openById(fileId);
    } catch (er) {
      return ["Error : " 
        + er.toString() 
        + "\r\n" + "\r\n" +"Try :- "
        +"\r\n" + "1. Sign-in your Google Account in Browser."
        +"\r\n" + "2. Do not use Guest mode, Incognito mode or Private mode."
        +"\r\n" + "3. If you are logged into multiple Google accounts, Sign-out all your Google accounts and back into just one.", fileId, 'Error', 'Error'];
    }
  
      
    var docName = doc.getName();
    var text = doc.getBody().getText();
    
    var OCRtext = text;  
  
    if (!OCRtext.replace(/\s/g, '').length) {
      Action = "Sorry! Image OCR are unable to extract text from the file.";
    } else {
      Action = OCRtext;
    }
       
    
    if(isSecretFile == "on"){
      Drive.Files.remove(fileId);     
      setFileas = 'SecretFile';
    }else{
      DriveApp.getFileById(fileId).setTrashed(true);
      setFileas = 'Normal';
    }
        
    
  }else{
    Action = UploadStatus;
  }

  return [Action, fileId, docName, setFileas];

}








//     ************    Function for Upload File   ***************************



function uploadFile(fileData) { 

  var Action, FileId; 

  var findFolder = getFolder('OCR Pro - Desktop');  
  if(findFolder == "null"){
    var folder = DriveApp.createFolder('OCR Pro - Desktop');
  }else{
    folder = findFolder;
  }
    
  
  try {         
    //var img = form.imageFile;  
    var OCRlang = fileData.ocrLang;
    var isSecretFile = fileData.ocrSecret;

    var fileBlob = Utilities.newBlob(fileData.bytes, fileData.mimeType, fileData.filename);
    var OCRimage = DriveApp.createFile(fileBlob);
    //var OCRimage = folder.createFile(img);

    var UploadStatus = "File Uploaded Successfully!";
    Action = 'success';
    FileId = OCRimage.getId();
    
  } catch (m) {
    UploadStatus = m.toString();
    Logger.log( m.toString());
    Action = 'error';
  }
    
  return [Action, FileId, OCRlang, isSecretFile];
}







function getOCRtext(imgFileId,OCRlang,isSecretFile){
   
  var Action, setFileas;
  var ImageID = imgFileId;
  
  var blob = DriveApp.getFileById(ImageID).getBlob();
  var resource = {
    title: blob.getName(),
    mimeType: blob.getContentType()
  };
          
    
  // If OCR language Selected
  // Enable the Advanced Drive API Service
  if(OCRlang == "DefaultLang" || OCRlang == "MultiLang"){       
    var fileId = Drive.Files.insert(resource, blob, {ocr: true}).id;
    //var fileId = Drive.Files.copy({mimeType: MimeType.GOOGLE_DOCS}, ImageID).id;   
  } else {      
    var fileId = Drive.Files.insert(resource, blob, {ocr: true, ocrLanguage: OCRlang}).id;      
  }
        
 
 
 try{
    var doc = DocumentApp.openById(fileId);
 } catch (er) {
    return ["Error : " 
      + er.toString() 
      + "\r\n" + "\r\n" +"Try :- "
      +"\r\n" + "1. Sign-in your Google Account in Browser."
      +"\r\n" + "2. Do not use Guest mode, Incognito mode or Private mode."
      +"\r\n" + "3. If you are logged into multiple Google accounts, Sign-out all your Google accounts and back into just one.", fileId, 'Error', 'Error'];    
 }  


  var docName = doc.getName();
  var OCRtext = doc.getBody().getText();  

  if (!OCRtext.replace(/\s/g, '').length) {
    Action = "Sorry! Image OCR are unable to extract text from the file.";
  } else {
    Action = OCRtext;
  }
    
       
      
  if(isSecretFile == "on"){
    // Permanently deleted Image file
    Drive.Files.remove(fileId); 
    Drive.Files.remove(ImageID);     
    setFileas = 'SecretFile';
  }else{
    // Move to Trashed Image file
    DriveApp.getFileById(fileId).setTrashed(true); 
    DriveApp.getFileById(ImageID).setTrashed(true); 
    setFileas = 'Normal';
  }
        
  return [Action, fileId, docName, setFileas];
     
  
}









function CountFileConverted() {
 var ss = SpreadsheetApp.openById("1avo77F4KrxNM8qiX1_XQYCHwR6HdIt4wlvwcSEBRxM8");
  var sheet = ss.getSheetByName("OCR Pro");
  var data = sheet.getDataRange().getValues();
  
    var TodayConvert = data[3][2];
    var TotalConvert = data[6][2];
  
  sheet.getRange("C4").setValue(TodayConvert+1);
  sheet.getRange("C7").setValue(TotalConvert+1);
  return TodayConvert + 1;
}




function getAppRate() {
 var ss = SpreadsheetApp.openById("1avo77F4KrxNM8qiX1_XQYCHwR6HdIt4wlvwcSEBRxM8");
  var sheet = ss.getSheetByName("OCR Pro");
  var data = sheet.getDataRange().getValues();
  
    var AppRating = data[17][2];  

  return AppRating;
}



function updateRatingSheet(star){
  var ss = SpreadsheetApp.openById("1avo77F4KrxNM8qiX1_XQYCHwR6HdIt4wlvwcSEBRxM8");
  var sheet = ss.getSheetByName("OCR Pro");
  var data = sheet.getDataRange().getValues();
  
    var Star5 = data[11][2];
    var Star4 = data[12][2];
    var Star3 = data[13][2];
    var Star2 = data[14][2];
    var Star1 = data[15][2];
    var Star0 = data[16][2];
   
   if(star == 5){sheet.getRange("C12").setValue(Star5+1);}
   if(star == 4){sheet.getRange("C13").setValue(Star4+1);}
   if(star == 3){sheet.getRange("C14").setValue(Star3+1);}
   if(star == 2){sheet.getRange("C15").setValue(Star2+1);}
   if(star == 1){sheet.getRange("C16").setValue(Star1+1);}
   if(star == 0){sheet.getRange("C17").setValue(Star0+1);}

}



function SaveUserReview( star, review, convertFile, PageID){

  updateRatingSheet(star);
    
  try {
    // do stuff, including send email
      var recipientsTO = "myocreader@gmail.com" + "," + "abonzer2@gmail.com";
      
    MailApp.sendEmail({
      to: recipientsTO,
      subject: "GoOCR (desktop) User Review",
     htmlBody: "<b>Star Rating: </b> "+star+" <br><br> <b>Review: </b> "+review+" <br><br> <b>User-convert-File: </b>"+convertFile +" <br><br> convert : "+PageID,    
    });
    
     var json = {  'action':'Success',  'msg':'Thanks for your feedback!'  };  
      
  } catch(e) {
    Logger.log("Error with email (" + email + "). " + e);
    var json = {  'action':'Error',  'msg':e  }; 
  }
      
  return json; 
}




// ___________________________________________________


// ----------------------------------------------------
// ###############   Connect to Web   #################
// ----------------------------------------------------


// ___________________________________________________









//     ************    Function for URL File   ***************************

function ConnectionCode(formObj) {
    var Action;
    
    var validCaptcha = verifyCaptcha(formObj);
    
    if(!validCaptcha){
      return 'Invalid captcha please try again.';
    } else {
           
    
        var Code = formObj.ConnectionCode;
        var ConnectionCode = Code.toUpperCase();
        var fileTime = new Date().getTime();
        var OTP = "";
    
        var possible = "0123456789";
    
        for (var i = 0; i < 5; i++)
            OTP += possible.charAt(Math.floor(Math.random() * possible.length));
    
        var findFolder = getFolder('OCR Pro - Web Connect');
        if (findFolder == "null") {
            var folder = DriveApp.createFolder('OCR Pro - Web Connect');
        } else {
            folder = findFolder;
        }
    
        var myFileName = "OCR Web Connect - " + ConnectionCode;
    
        var FindFile = FindFiles(myFileName, folder);
        if (FindFile == "null") {
            var document = DocumentApp.create(myFileName);
            var paragraph = document.appendParagraph("#tags#-LogFile_-GetFileTime:" + fileTime + "#EndGetFileTime_-GetOTP:" + OTP + "#EndGetOTP_-GetConnectionStatus:null" + "__#end#split__");
    
            document.saveAndClose();
    
            var file = DriveApp.getFileById(document.getId());
            // Get root directory
            var parents = file.getParents();
            // Remove file from root folder
            parents.next().removeFile(file);
            // Add file to the specified folder
            folder.addFile(file);
    
            var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, document.getId(), Utilities.Charset.US_ASCII);
    
            return digest;
    
        } else {
            return "Oops! Something went wrong. Please try again later.";
        }
    }
}





var secret_key = "6LcAL2cUAAAAAKH7vPqeAMnbzf3E7ImwjMJ2lQeV";  

        
function verifyCaptcha(response){
  var url = 'https://www.google.com/recaptcha/api/siteverify';  
  var payload = {
    'secret' : secret_key,
    'response': response['g-recaptcha-response']
  } 
  var resp = UrlFetchApp.fetch(url, {
    payload : payload,
    method : 'POST'
  }).getContentText();
  return JSON.parse(resp).success;
} 





//    ******************    Function Validate OTP     *******************

function validateOTP(userOTP, ConnectionLog) {

    var fileID = FileIDfromHASH(ConnectionLog);

    if (fileID != "null") {

        var docText = DocumentApp.openById(fileID).getBody().getText();
        var n = docText.indexOf("-GetConnectionStatus:null-Ready");
        var OTP = docText.split(/-GetOTP:|#EndGetOTP_/)[1];
        var FileTime = docText.split(/-GetFileTime:|#EndGetFileTime_/)[1];
        var duration = new Date().getTime() - FileTime; // millisecounds

        if (OTP !== userOTP) {
            return ["Failed", "Invalid OTP entered."];
        }

        if (duration > 300000 || n < 0) {
            return ["Failed", "OTP has expired. Please try again to connecting the device."];
        }

        if (OTP == userOTP) {
            var tags = docText.split("__#end#split__")[0];
            var OCRtext = docText.split("__#end#split__")[1];
            var reset = tags.replace("-GetConnectionStatus:null-Ready", "-GetConnectionStatus:Active");
            DocumentApp.openById(fileID).setText(reset + "__#end#split__");

            return ["Success", OCRtext];

        }

        return ["Failed", "Oops!"];

    } else {
        return ["Failed", "Oops! Connection Interrupted. Please try to reconnecting the device."];

    }

}







//    ******************    Function Reload     *******************

function Reload(ConnectionLog) {

    var fileID = FileIDfromHASH(ConnectionLog);

    if (fileID != "null") {

        var docText = DocumentApp.openById(fileID).getBody().getText();
        var tags = docText.split("__#end#split__")[0];
        var OCRtext = docText.split("__#end#split__")[1];

        return ["Success", OCRtext];

        return ["Failed", "Oops! Device not connected."];

    } else {
        return ["Failed", "Oops! Connection Interrupted."];

    }
    return ["Failed", "Oops!"];
}








//    ******************    Function ClearTxt     *******************

function ClearText(ConnectionLog) {

   var fileID = FileIDfromHASH(ConnectionLog);

    if (fileID != "null") {

        var docText = DocumentApp.openById(fileID).getBody().getText();
        var tags = docText.split("__#end#split__")[0];
        DocumentApp.openById(fileID).getBody().setText(tags + "__#end#split__");

        var OCRtext = docText.split("__#end#split__")[1];

      if(OCRtext == "") {return ["Success", "All Text has Cleared."];}

        return ["Failed", "Oops! Device not connected."];

    } else {
        return ["Failed", "Oops! Connection Interrupted."];

    }
    return ["Failed", "Oops!"];
}






//    ******************    Function LogOut     *******************

function LogOut(ConnectionLog) {
    var fileID = FileIDfromHASH(ConnectionLog);
    if (fileID != "null") {
        Drive.Files.remove(fileID);
    }
}







function getFolder(folderName) {
  var parentFolder = DriveApp.getFolderById('18cm0NfzFo3jqoZgD5R9DNbRxYipv5oEV'); 
  var folders = parentFolder.getFolders(); 
    while (folders.hasNext()) {
        var folder = folders.next();
        if (folderName == folder.getName()) {
            return folder;
        }
    }
    return "null";
}





function FindFiles(fileName, folder) {

    var files = folder.getFiles();
    while (files.hasNext()) {
        var file = files.next();
        if (fileName == file.getName()) {

            var docText = DocumentApp.openById(file.getId()).getBody().getText();
            var n = docText.indexOf("-GetConnectionStatus:null");

            if (n > 0) {
                var rtrnFromDLET = Drive.Files.remove(file.getId());
            } else {
                return file.getId();
            }

        }
    }
    return "null";
}





function FileIDfromHASH(ConnectionLog) {
    var myFolder = getFolder('OCR Pro - Web Connect');
    var files = myFolder.getFiles();

    while (files.hasNext()) {
        var file = files.next();

        var FileID = file.getId();
        var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, FileID, Utilities.Charset.US_ASCII);

        var checkFile = compareArrays(ConnectionLog, digest);

        if (checkFile == true) {
            return FileID;
        }

    }
    return "null";

}






function CleanFolder() {
    var myFolder = getFolder('OCR Pro - Web Connect');
    var files = myFolder.getFiles();

    while (files.hasNext()) {
        var file = files.next();
        Drive.Files.remove(file.getId());

    }
}





function compareArrays(ConnectionLog, digestHash) {

    var A = ConnectionLog;
    var B = digestHash;
    // compare lengths 
    if (A.length != B.length)
        return false;

    for (var i = 0; i < A.length; i++) {

        if (A[i] != B[i]) {
            return false;
        }
    }
    return true;
}


