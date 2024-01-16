
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
  var tx = db.transaction(TABLE_NOTE, 'readonly');
  var objectStore = tx.objectStore(TABLE_NOTE);
  var data = [];

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
          elmnt.innerHTML += '<div class="item bg-light radius-10 v-center" onclick="ShowTasks('+data[item].NoteId
          +')"><div class="w-100 p-2  m-1"><h4 class="moraba-xb m-0 text-white ">'+data[item].Name
          +'</h4></div></div>';
        }
        resolve(data);
      }
    };
    objectStore.openCursor().onerror = function (event) {
      reject(event);
    };
  });
  
}


function AddNote(noteName) {
  var note = {
    "Name": noteName
  }
  var tx = db.transaction(TABLE_NOTE, 'readwrite');
  var store = tx.objectStore(TABLE_NOTE);
  var request = store.add(note);

  request.onsuccess = function (event) {
    console.log('Note added to the database', event);
  };

  request.onerror = function (event) {
    console.log('Error adding Note to the database', event);
  };
}
function UpdateNote(noteId, noteName) {
  var note = {
    "NoteId": noteId,
    "Name": noteName
  }
  var tx = db.transaction(TABLE_NOTE, 'readwrite');
  var store = tx.objectStore(TABLE_NOTE);
  var request = store.put(note);

  request.onsuccess = function (event) {
    console.log('Note Updated');
  };

  request.onerror = function (event) {
    console.log('Error Updating Note', event);
  };
}
function DeleteNote(noteId) {
  var transaction = db.transaction(TABLE_NOTE, 'readwrite');
  var objectStore = transaction.objectStore(TABLE_NOTE);

  var deleteRequest = objectStore.delete(noteId);
  deleteRequest.onsuccess = function (event) {
    console.log('Note deleted successfully with key' + noteId);
  };
}


//Task Repository
//TaskId,NoteId,DateCreate,Checked,Name
function getTask(Noteid) {
  var transaction = db.transaction(TABLE_TASK, 'readonly');
  var objectStore = transaction.objectStore(TABLE_TASK);
  var data = [];

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

function UpdateTask(taskId, TaskName) {
  var transaction = db.transaction(TABLE_TASK, 'readwrite');
  var objectStore = transaction.objectStore(TABLE_TASK);

  var getRequest = objectStore.get(taskId);
  getRequest.onsuccess = function (event) {
    var data = getRequest.result;
    data.Name = TaskName;
    data.DateCreate = new Date();


    var updateRequest = objectStore.put(data, taskId);
    updateRequest.onsuccess = function (event) {
      console.log('Task updated successfully');
    };
    updateRequest.onerror = function (event) {
      console.log('Error Updating Task', event);
    };
  };

}

function CheckTask(taskId) {
  var transaction = db.transaction(TABLE_TASK, 'readwrite');
  var objectStore = transaction.objectStore(TABLE_TASK);

  var getRequest = objectStore.get(taskId);
  getRequest.onsuccess = function (event) {
    var data = getRequest.result;
    data.Checked = !data.Checked;
    data.DateCreate = new Date();

    var updateRequest = objectStore.put(data, taskId);
    updateRequest.onsuccess = function (event) {
      console.log('Task updated successfully');
    };
    updateRequest.onerror = function (event) {
      console.log('Error Updating Task', event);
    };
  };

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
    if(data.length === 0){
      elmnt.innerHTML = 'فعلا چیزی برای نمایش وجود ندارد';
      document.getElementById('TaskHeader').innerHTML = 'این لیست خالی است';
      return;
    }
    data.map(function (item){
      let Checked = '';
      let checkedText = '';
      if(item.checked){
        Checked = 'checked';
        checkedText = 'h6 text-muted text-decoration-line-through';
      }
      elmnt.innerHTML += '<li class="w-100  p-1 top-20"><div class="row"><div class="col-8 v-center"><div class="checkbox-wrapper-39"><label><input type="checkbox" '+Checked
    +' onclick="CheckTask('+item.TaskId+')"/><span class="checkbox"></span></label></div><h5 class="moraba-b right-5 bottom-0 '+checkedText+'">'+item.Name
    +'</h5></div><div class="col-4 v-center flex-row-reverse d-flex"><button onclick="EditTask('+item.TaskId+')" class="p-0 bg-transparent border-0 shadow-not left" onclick><i class="bi bi-pen-fill '+
    'font-22 right-10"></i></button><button onclick="DeleteTask('+item.TaskId+')" class="p-0 bg-transparent border-0 shadow-not left"><i class="bi bi-trash-fill font-22 "></i></button></div></div></li>';
    });
    
  });
}