    
function uploadFile(fileData) { 

  var Action, FileId; 
  var findFolder = getFolder('OCR Pro - Mobile'); 
  
      if(findFolder == "null"){
        var folder = DriveApp.createFolder('OCR Pro - Mobile');
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







function getOCRtext(imgFileId,OCRlang, isSecretFile){
   
     var Action, setFileas;
     var ImageID = imgFileId;
     var OCRimage = DriveApp.getFileById(ImageID);
     
    
     var blob = OCRimage.getBlob();
      var resource = {
        title: blob.getName(),
        mimeType: blob.getContentType()
      };
          
    
    // If OCR language Selected
    if(OCRlang == "DefaultLang" || OCRlang == "MultiLang"){      
      // Enable the Advanced Drive API Service
      var fileID = Drive.Files.insert(resource, blob, {ocr: true}).id;      
    } else {      
      var fileID = Drive.Files.insert(resource, blob, {ocr: true, ocrLanguage: OCRlang}).id;      
    }
            
      
    try{
      var doc = DocumentApp.openById(fileID);
    } catch (er) {    
       return ["Error : " 
              + er.toString() 
              + "\r\n" + "\r\n" +"Try :- "
              +"\r\n" + "1. Sign-in your Google Account in Browser."
              +"\r\n" + "2. Do not use Guest mode, Incognito mode or Private mode."
              +"\r\n" + "3. If you are logged into multiple Google accounts, Sign-out all your Google accounts and back into just one.", fileID, 'Error', 'Error'];    
  }
    
      
      var docName = doc.getName();
      var text = doc.getBody().getText();
     
      var OCRtext = text;  
    
      if (!OCRtext.replace(/\s/g, '').length) {
        Action = "Sorry! Image OCR are unable to extract text from the file.";
      } else {
        Action = OCRtext;
      }
    
         
      
      var docID = doc.getId(); 
      
      if(isSecretFile == "on"){
         // permanently deleted Image file
         Drive.Files.remove(docID); 
         Drive.Files.remove(ImageID);          
           setFileas = 'SecretFile';
      }else{
         // Move to Trashed Image file
          DriveApp.getFileById(docID).setTrashed(true); 
          DriveApp.getFileById(ImageID).setTrashed(true); 
           setFileas = 'Normal';
      }
           
     return [Action, fileID, docName, setFileas];
          
}






function updateTextOnWeb(magicConnection, OCRtext){
  
  try {
    var FileID = FileIDfromHASH(magicConnection);
    DocumentApp.openById(FileID).appendParagraph(OCRtext);
    return("Success");
  }
  catch(e){
    Logger.log(e);
       return e;
  }
  
 
}





function FatchOTP(myConnectionID, OCRtext){
  
   var findFolder = getFolder('OCR Pro - Web Connect'); 
  
  
      if(findFolder != "null"){   var folder = findFolder; }
      else{ 
        var respR = {
          'type': "Failed",
          'msg':"Oops! Something went wrong. Please try again later.",
          'log': "Folder Not Found"
        };
      return respR;  
      }  
  
  
    var myFileName = "OCR Web Connect - " + myConnectionID;  
    var FindFile = FindFiles(myFileName, folder); 
  
  if(FindFile == "null"){ 
     var respR = {
          'type': "Failed",
          'msg':"Oops! Something went wrong. Please try again later.",
          'log': "File Not Found"
        };
      return respR;    
  } 
   
     var docText = DocumentApp.openById(FindFile).getBody().getText();
     var OTP =  docText.split(/-GetOTP:|#EndGetOTP_/)[1];
     var FileTime =  docText.split(/-GetFileTime:|#EndGetFileTime_/)[1];
     var duration = new Date().getTime() - FileTime ;
 
  if(duration > 300000 ){ 
     var respR = {
          'type': "Failed",
          'msg': "OTP has expired. Please try again to connecting the device.",
          'log': "File OTP Expire"
        };
      return respR;  
  } 
                            
     var tags =  docText.split("__#end#split__")[0];          
     var reset = tags.replace("-GetConnectionStatus:null", "-GetConnectionStatus:null-Ready");           
     DocumentApp.openById(FindFile).setText(reset + "__#end#split__");            
     DocumentApp.openById(FindFile).appendParagraph(OCRtext);           
      DriveApp.getFileById(FindFile).setName(FileTime + " - " + myConnectionID);     
            
      var digest = getSHA256Enc(FindFile);
      var respR = {
          'type': "Success",
          'msg': OTP,
          'log': digest
        };
     return respR;  
      
    var respR = {
          'type': "Failed",
          'msg': "Oops! Something went wrong. Please try again later.",
          'log': "Other"
        };
     return respR;  
  
    
}






function FindFiles(fileName, folder){ 
  Logger.log(fileName);
  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next(); 
    var fatchFileName = file.getName();  Logger.log(fatchFileName);
    if(fileName == fatchFileName) {        
       return file.getId();       
    }
 }
  return "null";
}



function CountFileConverted() {
 var ss = SpreadsheetApp.openById("1avo77F4KrxNM8qiX1_XQYCHwR6HdIt4wlvwcSEBRxM8");
  var sheet = ss.getSheetByName("OCR Pro");
  var data = sheet.getDataRange().getValues();
  
    var TodayConvert = data[3][2];
    var TotalConvert = data[6][2];   
  
  sheet.getRange("C4").setValue(TodayConvert+1);
  sheet.getRange("C7").setValue(TotalConvert+1);  
  return TodayConvert+1;
}




function getAppRate() {
 var ss = SpreadsheetApp.openById("1avo77F4KrxNM8qiX1_XQYCHwR6HdIt4wlvwcSEBRxM8");
  var sheet = ss.getSheetByName("OCR Pro");
  var data = sheet.getDataRange().getValues();
  
    var AppRating = data[17][2];  

  return AppRating;
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



function SaveUserReview( star, review, convertFile, isWebConnect){

  updateRatingSheet(star);
    
  try {
    // do stuff, including send email
      var recipientsTO = "myocreader@gmail.com" + "," + "abonzer2@gmail.com";
      
    MailApp.sendEmail({
      to: recipientsTO,
      subject: "GoOCR (mobile) User Review",
     htmlBody: "<b>Star Rating: </b> "+star+" <br><br> <b>Review: </b> "+review+" <br><br> <b>User-convert-File: </b>"+convertFile+"<br><br>Connect to Web : "+isWebConnect,    
    });
    
     var json = {  'action':'Success',  'msg':'Thanks for your feedback!'  };  
      
  } catch(e) {
    Logger.log("Error with email (" + email + "). " + e);
    var json = {  'action':'Error',  'msg':e  }; 
  }
      
  return json; 
}








function chkConnectionStatus(ConnectionLog) {

  try{
    var fileID = FileIDfromHASH(ConnectionLog);
    if (fileID != "null") {
        var docText = DocumentApp.openById(fileID).getBody().getText();
        var tags = docText.split("__#end#split__")[0];
        var n = docText.indexOf('-GetConnectionStatus:Active');
        
        if(n > -1){
            return ["Success", "Device connected"];
        }else{
          return ["Failed", "Oops! Device not connected."];
        }               

    } else {
        return ["Failed", "Oops! Connection Interrupted."];
    }
    return ["Failed", "Oops!"];
    
  }catch(er){
    return ["error", er];
  }     
   
}




function LogOut(ConnectionLog) {
    var fileID = FileIDfromHASH(ConnectionLog);
    if (fileID != "null") {
        Drive.Files.remove(fileID);
    }

}


function FileIDfromHASH(ConnectionLog) {
    var myFolder = getFolder('OCR Pro - Web Connect');
    var files = myFolder.getFiles();

    while (files.hasNext()) {
        var file = files.next();
        var FileID = file.getId();
        var digest = getSHA256Enc(FileID);
        
        if (ConnectionLog == digest) {
            return FileID;
        }

    }
    return "null";

}





function getSHA256Enc(value){
var signature = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value);

/** @type String */
var hexString = signature
    .map(function(byte) {
        // Convert from 2's compliment
        var v = (byte < 0) ? 256 + byte : byte;

        // Convert byte to hexadecimal
        return ("0" + v.toString(16)).slice(-2);
    })
    .join("");
    
   return hexString;
}


