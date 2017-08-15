function doTask() {
  const remote = require('electron').remote;

  let indexWindow = remote.BrowserWindow.getAllWindows()[0];

  indexWindow.webContents.executeJavaScript('console.log("In portalScript_2.js")');
  indexWindow.webContents.executeJavaScript('if(lib.timer) lib.timer.refresh();');

  let table;
  let data;

  (function dataCollector() {
    table = document.getElementsByClassName('xmu_table_class')[0];
    data = [];
    let tableRows = table.rows;
    let tableLength = tableRows.length;
    if(tableLength < 3) return false;

    let term = {
      name: '',
      subjects: []
    };
    for(let i = 2; i < tableLength; i++) {
      let currentRow = tableRows[i];
      if(currentRow.children.length == 1) { // Header detected
        if(term.name != '') {
          data.push(term);
          // Reinitialize
          term = {
            name: '',
            subjects: []
          };
        }
        term.name = currentRow.children[0].children[0].innerText;
      } else { // Body detected
        let j = 0;
        let subject = {
          name: '',
          credit: '',
          courseType: '',
          takingType: '',
          grade: '',
          specialReason: '',
          ranking: ''
        }
        // subject.name = currentRow.children[0].innerText.replace(/\s/g, '');
        // subject.credit = currentRow.children[1].innerText.replace(/\s/g, '');
        // subject.courseType = currentRow.children[2].innerText.replace(/\s/g, '');
        // subject.takingType = currentRow.children[3].innerText.replace(/\s/g, '');
        // subject.grade = currentRow.children[4].innerText.replace(/\s/g, '');
        // subject.specialReason = currentRow.children[5].innerText.replace(/\s/g, '');
        // subject.ranking = currentRow.children[6].innerText.replace(/\s/g, '');
        for(let field in subject) {
          subject[field] = currentRow.children[j++].innerText.replace(/\s/g, '');
        }
        term.subjects.push(subject);
      }
    }
    if(term.name != '') {
      data.push(term);
    }

    indexWindow.webContents.executeJavaScript('console.log(' + JSON.stringify(data) + ');');
    indexWindow.webContents.executeJavaScript('lib.setRawData(\'' + JSON.stringify(data) + '\'); showResult(); lib.onSuccess();');
  })();

  // if(document.readyState) {
  //   dataCollector();
  // } else {
  //   window.onload = dataCollector;
  // }
}

if(document.readyState) {
  doTask();
}

window.onload = doTask;