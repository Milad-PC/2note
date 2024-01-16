
// PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/sw.js')
      .then(function () {
        console.log('SW Registered');
      })
      .catch(function (err) {
        console.log('SW Error', err);
      });
  });
}

//Install promp when not installed
if (document.location.pathname != '/install.html') {
  if (!document.cookie.startsWith('ShowedInstall=true')) {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      var d = new Date();
      d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = "ShowedInstall=true;" + expires + ";path=/";
      window.location = 'install.html';
    });
  }
}

const DB_NAME = '2NOTE';
const TABLE_TASK = 'Task';//TaskId,NoteId,DateCreate,Checked,Name
const TABLE_NOTE = 'Note';//NoteId,Name

var dbReq = indexedDB.open(DB_NAME, 1);
var db = null;
dbReq.onerror = function (event) {
  console.log('Error opening database', event);
};

dbReq.onsuccess = function (event) {
  db = event.target.result;
  getNote();
  ShowTasks(null);

  console.log('Database opened successfully');
};

dbReq.onupgradeneeded = function (event) {
  var db = event.target.result;
  var objectStoreNote = db.createObjectStore(TABLE_NOTE, { keyPath: 'NoteId', autoIncrement: true });
  console.log(objectStoreNote);
  var objectStoreTask = db.createObjectStore(TABLE_TASK, { keyPath: 'TaskId', autoIncrement: true });
  console.log(objectStoreTask);
};


async function getNote() {
  let tx = db.transaction(TABLE_NOTE, 'readonly');
  let objectStore = tx.objectStore(TABLE_NOTE);
  let data = [];

  return new Promise((resolve, reject) => {
    objectStore.openCursor().onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        data.push(cursor.value);
        cursor.continue();
      } else {
        console.log('All data read:', data);
        let elmnt = document.getElementById('NoteLists');
        for (let item in data) {
          elmnt.innerHTML += '<div class="item bg-light radius-10 v-center" onclick="ShowTasks(' + data[item].NoteId
            + ')"><div class="w-100 p-2  m-1"><h4 class="moraba-xb m-0 text-white ">' + data[item].Name
            + '</h4></div></div>';
        }
        resolve(data);
        $('.owl-carousel').owlCarousel({
          rtl: true,
          loop: false,
          margin: 5,
          nav: false,
          dots: 0,
          items: 2
        });
      }
    };
    objectStore.openCursor().onerror = function (event) {
      reject(event);
    };
  });

}


function AddNote(noteName) {
  let note = {
    "Name": noteName
  }
  let tx = db.transaction(TABLE_NOTE, 'readwrite');
  let store = tx.objectStore(TABLE_NOTE);
  let request = store.add(note);

  request.onsuccess = function (event) {
    console.log('Note added to the database', event);
  };

  request.onerror = function (event) {
    console.log('Error adding Note to the database', event);
  };
}
function UpdateNote(noteId, noteName) {
  let note = {
    "NoteId": noteId,
    "Name": noteName
  }
  let tx = db.transaction(TABLE_NOTE, 'readwrite');
  let store = tx.objectStore(TABLE_NOTE);
  let request = store.put(note);

  request.onsuccess = function (event) {
    console.log('Note Updated');
  };

  request.onerror = function (event) {
    console.log('Error Updating Note', event);
  };
}
function DeleteNote(noteId) {
  let transaction = db.transaction(TABLE_NOTE, 'readwrite');
  let objectStore = transaction.objectStore(TABLE_NOTE);

  let deleteRequest = objectStore.delete(noteId);
  deleteRequest.onsuccess = function (event) {
    console.log('Note deleted successfully with key' + noteId);
  };
}


//Task Repository
//TaskId,NoteId,DateCreate,Checked,Name
function getTask(Noteid) {
  let transaction = db.transaction(TABLE_TASK, 'readonly');
  let objectStore = transaction.objectStore(TABLE_TASK);
  let data = [];

  return new Promise((resolve, reject) => {
    objectStore.openCursor().onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        if (cursor.value.NoteId == Noteid) {
          data.push(cursor.value);
        }
        cursor.continue();
      } else {
        console.log('All data read:', data);
        resolve(data);
      }
    };
    objectStore.openCursor().onerror = function (event) {
      console.log('Error reading database', event);
      reject(event);
    };

  });
}

function AddTask(TaskName, noteid) {
  let Task = {
    "NoteId": noteid,
    "DateCreate": new Date(),
    "Checked": false,
    "Name": TaskName
  }
  let tx = db.transaction(TABLE_TASK, 'readwrite');
  let store = tx.objectStore(TABLE_TASK);
  let request = store.add(Task);

  request.onsuccess = function (event) {
    console.log('Task added to the database');
  };

  request.onerror = function (event) {
    console.log('Error adding Task to the database', event);
  };
}

function GetTaskById(taskId) {
  let transaction = db.transaction(TABLE_TASK, 'readwrite');
  let objectStore = transaction.objectStore(TABLE_TASK);
  let data = objectStore.get(taskId);
  return new Promise((resolve, reject) => {
    data.onsuccess = function (event) {
      console.log(event.target.result);
      resolve(event.target.result);
    };
    data.onerror = function (event) {
      console.log('Error reading database', event);
      reject(event);
    };
  });
}

function UpdateTask(taskId, TaskName) {
  let transaction = db.transaction(TABLE_TASK, 'readwrite');
  let objectStore = transaction.objectStore(TABLE_TASK);
  let data = objectStore.get(parseInt(taskId));
  let rslt = new Promise((resolve, reject) => {
    data.onsuccess = function (event) {
      console.log(event.target.result);
      resolve(event.target.result);
      return event.target.result;
    };
    data.onerror = function (event) {
      console.log('Error reading database', event);
      reject(event);
    };
  });

  return new Promise((resolve, reject) => {
    rslt.then(function (data) {
      console.log('Data : ', data);
      data.Name = TaskName;
      data.DateCreate = new Date();
      var updateRequest = objectStore.put(data);
      updateRequest.onsuccess = function (event) {
        console.log('Task updated successfully');
        resolve(data);
      };
      updateRequest.onerror = function (event) {
        console.log('Error Updating Task', event);
        reject(event);
      };
    });
    rslt.catch(function (err) {
      console.log('Error in UpdateTask', err);
      reject(err);
    });
  });
}

function CheckTask(taskId) {
  let transaction = db.transaction(TABLE_TASK, 'readwrite');
  let objectStore = transaction.objectStore(TABLE_TASK);
  let data = objectStore.get(parseInt(taskId));
  let rslt = new Promise((resolve, reject) => {
    data.onsuccess = function (event) {
      console.log(event.target.result);
      resolve(event.target.result);
      return event.target.result;
    };
    data.onerror = function (event) {
      console.log('Error reading database', event);
      reject(event);
    };
  });

  return new Promise((resolve, reject) => {
    rslt.then(function (data) {
      console.log('Data : ', data);
      data.Checked = !data.Checked;
      var updateRequest = objectStore.put(data);
      updateRequest.onsuccess = function (event) {
        console.log('Task updated successfully');
        resolve(data);
      };
      updateRequest.onerror = function (event) {
        console.log('Error Updating Task', event);
        reject(event);
      };
    });
    rslt.catch(function (err) {
      console.log('Error in UpdateTask', err);
      reject(err);
    });
  });
}

function DeleteTask(taskId) {
  var transaction = db.transaction(TABLE_TASK, 'readwrite');
  var objectStore = transaction.objectStore(TABLE_TASK);

  var deleteRequest = objectStore.delete(taskId);
  deleteRequest.onsuccess = function (event) {
    console.log('Task deleted successfully with key' + taskId);
  };
  location.reload();
}

function AddToNote() {
  var x = document.getElementById('NoteAdder').value;
  document.getElementById('NoteAdder').value = '';

}

function AddToTasks(noteId, TaskName) {
  var x = document.getElementById('NoteAdder').value;
  document.getElementById('NoteAdder').value = '';

}


function ShowTasks(Noteid) {
  let elmnt = document.querySelector('.job-list ul');
  if (Noteid == null) {
    elmnt.innerHTML = 'فعلا چیزی برای نمایش وجود ندارد';
    document.getElementById('TaskHeader').innerHTML = 'ابتدا لیست را انتخاب کنید';
    return;
  }
  document.getElementById('NoteCatIdInput').value = Noteid;
  getTask(Noteid).then((data) => {
    if (data.length === 0) {
      elmnt.innerHTML = 'فعلا چیزی برای نمایش وجود ندارد';
      document.getElementById('TaskHeader').innerHTML = 'این لیست خالی است';
      return;
    }
    elmnt.innerHTML = '';
    data.map(function (item) {
      let Checked = '';
      let checkedText = '';
      if (item.Checked) {
        Checked = 'checked';
        checkedText = 'h6 text-muted text-decoration-line-through';
      }
      elmnt.innerHTML += '<li class="w-100  p-1 top-20"><div class="row"><div class="col-8 v-center"><div class="checkbox-wrapper-39"><label><input type="checkbox" ' + Checked
        + ' onclick="CheckTask(' + item.TaskId + ')"/><span class="checkbox"></span></label></div><h5 class="moraba-b right-5 bottom-0 ' + checkedText + '">' + item.Name
        + '</h5></div><div class="col-4 v-center flex-row-reverse d-flex"><button onclick="showUpdateTaskModal(' + item.TaskId + ')" class="p-0 bg-transparent border-0 shadow-not left" onclick><i class="bi bi-pen-fill ' +
        'font-22 right-10"></i></button><button onclick="DeleteTask(' + item.TaskId + ')" class="p-0 bg-transparent border-0 shadow-not left"><i class="bi bi-trash-fill font-22 "></i></button></div></div></li>';
    });

  });
}


//Front End JS
function showNoteModal() {
  $('#NoteModal').modal('show');
}
function HideNoteModal() {
  $('#NoteModal').modal('hide');
}
function AddNewNoteModal() {
  let src = document.getElementById('AddNoteInput').value;
  if (src == "") {
    alert("لطفا متن خود را وارد کنید");
    return;
  }
  AddNote(src);
  HideNoteModal();
  location.reload();
}
function showTaskModal() {
  $('#TaskModal').modal('show');
}
function HideTaskModal() {
  $('#TaskModal').modal('hide');
}
function AddNewTaskModal() {
  let src = document.getElementById('AddTaskInput').value;
  let nId = document.getElementById('NoteCatIdInput').value;
  if (src == "") {
    alert("لطفا متن خود را وارد کنید");
    return;
  }
  if (nId == "0") {
    alert("دسته انتخاب نشده است");
    return;
  }
  AddTask(src, nId);
  HideTaskModal();
  location.reload();
}

function showUpdateTaskModal(taskId) {
  document.getElementById('UpdateTaskIdInput').value = taskId;
  $('#UpdateTaskModal').modal('show');
}
function HideUpdateTaskModal() {
  document.getElementById('UpdateTaskIdInput').value = '0';
  $('#UpdateTaskModal').modal('hide');
}
function UpdateTaskModal() {
  let src = document.getElementById('UpdateTaskInput').value;
  let nId = document.getElementById('UpdateTaskIdInput').value;
  if (src == "") {
    alert("لطفا متن خود را وارد کنید");
    return;
  }
  if (nId == "0") {
    alert("تسک انتخاب نشده است");
    return;
  }
  UpdateTask(nId, src)
    .then((evnt) => {
      HideUpdateTaskModal();
      location.reload();
    })
    .catch((evnt) => {
      console.log(event);
    });
}
