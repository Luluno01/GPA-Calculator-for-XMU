function doTask() {
  const remote = require('electron').remote;
  let indexWindow = remote.BrowserWindow.getAllWindows()[0];

  indexWindow.webContents.executeJavaScript('console.log("In portalScript_0.js")');
  indexWindow.webContents.executeJavaScript('if(lib.timer) lib.timer.refresh();');

  document.getElementById('username').value = USERNAME;
  document.getElementById('password').value = PASSWORD;

  document.getElementsByTagName('input')[4].checked = true;
  document.getElementsByTagName('input')[5].click();

  let int = setInterval(() => {
    // if still alive, something must went wrong
    if(!document.getElementById('loginMsg')) {
      indexWindow.webContents.executeJavaScript('console.log("portalScript_0.js: page error.")');
      indexWindow.webContents.executeJavaScript('onError();');
      clearInterval(int);
      return;
    }
    if(document.getElementById('loginMsg').innerText != '') {
      indexWindow.webContents.executeJavaScript('console.log("portalScript_0.js: login error.")');
      indexWindow.webContents.executeJavaScript('console.log("portalScript_0.js: ' + document.getElementById('loginMsg').innerText.replace(/\\/g, '\\\\').replace(/\'/g, "\\'").replace(/\"/g, '\\"') + '")');
      indexWindow.webContents.executeJavaScript('onError("' + document.getElementById('loginMsg').innerText.replace(/\\/g, '\\\\').replace(/\'/g, "\\'").replace(/\"/g, '\\"') + '")');
      clearInterval(int);
      return;
    }
  }, 100);
  USERNAME = null;
  PASSWORD = null;
}

if(document.readyState) {
  doTask();
}

window.onload = doTask;