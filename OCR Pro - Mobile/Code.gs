//*******************************************
// Must Enable Advance Google API for This App
//*******************************************

function doGet() {
    return HtmlService.createHtmlOutputFromFile('index.html')
        .setTitle('OCR Pro - Mobile');
}

function upload(e) {
    var Action;

    var findFolder = getFolders('OCR Pro - Mobile');
    if (findFolder == "null") {
        var folder = DriveApp.createFolder('OCR Pro - Mobile');
    } else {
        folder = findFolder;
    }

    try {
        var img = e.imageFile;
        var OCRlang = e.languagelist;
        var OCRimage = folder.createFile(img);
        var UploadStatus = "File Uploaded Successfully!";

    } catch (m) {
        UploadStatus = m.toString();
    }

    if (UploadStatus == "File Uploaded Successfully!") {

        var ImageID = OCRimage.getId();

        var blob = OCRimage.getBlob();
        var resource = {
            title: blob.getName(),
            mimeType: blob.getContentType()
        };

        // If OCR language Selected
        if (OCRlang == "DefaultLang" || OCRlang == "MultiLang") {

            // Enable the Advanced Drive API Service
            var myfile = Drive.Files.insert(resource, blob, {
                ocr: true
            });

        } else {

            var myfile = Drive.Files.insert(resource, blob, {
                ocr: true,
                ocrLanguage: OCRlang
            });

        }

        // Extract Text from PDF file
        var doc = DocumentApp.openById(myfile.id);
        var text = doc.getBody().getText();

        var OCRtext = text;

        if (OCRtext !== "") {
            Action = OCRtext;
        } else {
            Action = "Sorry! Image OCR are unable to extract text from the file.";
        }

        var docID = doc.getId()
        DriveApp.getFileById(docID).setTrashed(true);

        DriveApp.getFileById(ImageID).setTrashed(true); // Delete Image file

    } else {
        Action = UploadStatus;
    }

    return Action;
}

function CountFileConverted() {
    var ss = SpreadsheetApp.openById("1avo77F4KrxNM8qiX1_XQYCHwR6HdIt4wlvwcSEBRxM8");
    var sheet = ss.getSheetByName("OCR Pro");
    var data = sheet.getDataRange().getValues();

    var TodayConvert = data[3][2];
    var TotalConvert = data[6][2];

    sheet.getRange("C4").setValue(TodayConvert + 1);
    sheet.getRange("C7").setValue(TotalConvert + 1);
    return TodayConvert + 1;
}

function getFolders(folderName) {
    var folders = DriveApp.getFolders();
    while (folders.hasNext()) {
        var folder = folders.next();
        if (folderName == folder.getName()) {
            return folder;
        }
    }
    return "null";
}