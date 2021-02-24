//Go OCR v5.0
//*******************************************
// Must Add Drive API(Services) for This App
//*******************************************

// enable V8 runtime 

function doGet() {
  return render('home');  
}


function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}