const remote = require('electron').remote;

let allWindows = remote.BrowserWindow.getAllWindows();

const Lib = require('Lib');
let lib = new Lib(allWindows[0], allWindows[1]);

function toggleLoad() {
  let loader = document.getElementById('loader');
  if (Lib.hasClass(loader, 'fade-in')) {
    Lib.removeClass(loader, 'fade-in');
    setTimeout(() => {
      if(!Lib.hasClass(loader, 'fade-in')) loader.style.display = 'none';
    }, 300);
  } else {
    loader.style.display = '';
    setTimeout(() => {
      Lib.addClass(loader, 'fade-in');
    }, 50);
  }
}

let index;
let result;

function init() {
  index = document.getElementById('index');
  result = document.getElementById('result');
  lib.onTimeout = function() {
    document.getElementById('loginMsg').innerText = '操作超时！与服务器的通信可能出现问题，请尝试重启应用';
    Lib.hide(result);
    Lib.show(index);
    if(Lib.hasClass(document.getElementById('loader'), 'fade-in')) toggleLoad();
  };
}

if(document.readyState) {
  init();
}

window.onload = init;

function getRow(subject) {
  return '<tr> \
            <td>' + subject.name + '</td> \
            <td>' + subject.credit + '</td> \
            <td>' + subject.courseType + '</td> \
            <td>' + subject.takingType + '</td> \
            <td>' + subject.grade + '</td> \
            <td>' + subject.specialReason + '</td> \
            <td>' + subject.ranking + '</td> \
            <td>' + (subject.GPA || '') + '</td> \
          </tr>';
}

let currentTermIndex = 0;
let termNum = 0;

function showResult() {
  Lib.hide(index);

  let totalGPA = document.getElementById('gpa-total');
  let gpa = lib.res[lib.res.length - 1];
  totalGPA.innerText = '' + gpa + ((3.0 <= gpa && gpa < 3.7) ? '（大佬）' : (3.7 <= gpa && gpa < 3.9 ? '（巨佬）' : (3.9 <= gpa && gpa <= 4.0 ? '（溢出佬）' : (4.0 < gpa ? '（真·溢出佬 请反馈）' : ''))));
  showTermResult(lib.res[currentTermIndex = 0]);
  termNum = lib.res.length - 1;

  Lib.show(result);
  toggleLoad();
}

function pre() {
  showTermResult(lib.res[currentTermIndex - 1 < 0 ? 0 : --currentTermIndex]);
}

function next() {
  showTermResult(lib.res[currentTermIndex + 1 > termNum - 1 ? termNum - 1 : ++currentTermIndex]);
}

function showTermResult(term) {
  Lib.hide(index);

  let termName = document.getElementById('term-name');
  let subjectList = document.getElementById('subjects');
  let termGPA = document.getElementById('gpa-term');

  let subjectListStr = "";

  termName.innerText = term.name;
  for(let i in term.subjects) {
    subjectListStr += getRow(term.subjects[i]);
  }
  termGPA.innerText = term.GPA;

  document.getElementById('subjects').innerHTML = subjectListStr;

  Lib.show(result);
}

function onError(message) {
  lib.injector.state = 'error'; // Stop the injector
  if(lib.timer) lib.timer.stop(); // Stop timer
  document.getElementById('loginMsg').innerText = message || '页面错误！与服务器的通信可能出现问题，请尝试重启应用';
  lib.onError();
  Lib.hide(result);
  Lib.show(index);
  if(Lib.hasClass(document.getElementById('loader'), 'fade-in')) toggleLoad();
}