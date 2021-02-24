
function UpdateJSON(device, isSecretFile, fileSize) {
  var mc = 0;
  var dc = 0;
  var urlc = 0;
  var sc = 0;
  var sizeMB = parseFloat(fileSize.split('MB')[0]);
  var date = Utilities.formatDate(new Date(), "GMT+0530", "dd/MM/yyyy");

   if(device == 'Mobile'){  mc = 1; }
   if(device == 'Desktop'){  dc = 1; }
   if(device == 'Desktop-URL'){  dc = 1; urlc = 1; }
   if(isSecretFile == 'SecretFile'){  sc = 1; }

  var record = {       
     "date": date,         
     "TotalConvert": 1,         
     "MobileConvert": mc,         
     "DesktopConvert": dc,
     "ConvertByLink": urlc,
     "SecretFile": sc,
     "FileSizeMB": sizeMB
  };

  var addRec = JSON.stringify(record) + ',';
  updateTxtReport(addRec);
}


function updateTxtReport(newRec){
  var file = DriveApp.getFileById('1IWrKXNOg9vUWHD3GTQjgMFg61EupG7uj');
  var combinedContent = file.getBlob().getDataAsString() +"\r\n"+ newRec;
  file.setContent(combinedContent);  
}







