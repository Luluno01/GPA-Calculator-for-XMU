function doTask() {
  const remote = require('electron').remote;
  let indexWindow = remote.BrowserWindow.getAllWindows()[0];

  indexWindow.webContents.executeJavaScript('console.log("In portalScript_1.js")');
  indexWindow.webContents.executeJavaScript('lib.startTime = ' + (new Date()).getTime());

  document.location = "?.pn=p1201_p3535";
}

if(document.readyState) {
  doTask();
}

window.onload = doTask;