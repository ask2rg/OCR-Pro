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



function render(file, argsObject) {
  var tmp = HtmlService.createTemplateFromFile(file);  
  if(argsObject) {
    var keys = Object.keys(argsObject);    
    keys.forEach(function(key){
      tmp[key] = argsObject[key];
    });
  } 
  return tmp.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);    
}


    
