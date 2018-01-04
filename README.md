# OCR-Pro
OCR pro is a Free web application written in Google Apps Script, to Convert PDF and photo files to text. OCR pro use Google Drive's OCR technology Website:  http://ocrpro.blogspot.in/



## About

![OCR Pro](https://1.bp.blogspot.com/-05BZrvdXI-A/WkZs5LhHndI/AAAAAAAAAB8/YNwjoE5aS5U60yKJrfc867KRsFiRvCQbwCLcBGAs/s252/OCR-Pro.png "OCR Pro logo")

Optical Character Recognition (OCR), a tool that lets you easily copy text from picture, scanned documents, printed books, etc. We can convert hardcopy document into editable digital document and avoid the retyping of a document.

You can simply capture a picture of the printed text with your mobile phone, use CamScanner App for impressive results and then upload a scanned image file. Once the OCR process is done, you will be able to copy-paste or edit the text content of that image.



## How does it work?

The script use [Google OCR Technology](https://support.google.com/drive/answer/176692), as you know you can convert image files to text with Google Drive, uploade file to Google Drive and then Open file with Google Docs. It does use same concept and automate the whole process.

Collect image or PDF file from the user, Upload file to my Google Drive and then Create .doc file using Input-Image-File with enabling OCR option. Once the DOC file creates, the script will copy all text inside doc file and provide it as an output. At last, it will delete both image and DOC file, all tasks will be done by Google App Script.

It also performs some other tasks like calculate processing time, count no of file converted, Sets a specific OCR language, which helps you to get the best results.
