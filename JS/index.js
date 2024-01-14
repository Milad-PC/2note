var jobs=document.querySelector(".jobs");
var headingheight=(document.querySelector(".heading").offsetHeight/window.innerHeight)*100;
var mainheight=(document.querySelector(".jobs-carousel").offsetHeight/window.innerHeight)*100;
var pluss=100 -(mainheight + headingheight) - 10;
jobs.style.height=pluss+"vh";

function heightchange(){
    jobs.classList.toggle("active");
    if(jobs.classList.contains("active")){
        document.querySelector(".jobs ul").style.maxHeight=(90 -(mainheight))+"vh";
    }
    else{
      document.querySelector(".jobs ul").style.maxHeight=(pluss - 10)+"vh";
    }
}

  // PWA
  if('serviceWorker' in navigator){
    window.addEventListener('load',function(){
      navigator.serviceWorker
    .register('/sw.js')
    .then(function(){
      console.log('SW Registered');
    })
    .catch(function(err){
      console.log('SW Error',err);
    });
    });
  }

  //Install promp when not installed
  if(document.location.pathname != '/install.html'){
    if(!document.cookie.startsWith('ShowedInstall=true')){
      window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        var d = new Date();
        d.setTime(d.getTime() + (30*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = "ShowedInstall=true;" + expires + ";path=/";
        window.location = 'install.html';
      });
    }
  }

  const DB_NAME = '2NOTE';
  const TABLE_TASK = 'Task';//TaskId,NoteId,DateCreate,Checked,Name
  const TABLE_NOTE = 'Note';//NoteId,Name
 
  var dbReq = indexedDB.open(DB_NAME,1);
  dbReq.onerror = function(event) {
    console.log('Error opening database');
  };
  
  dbReq.onsuccess = function(event) {
    db = event.target.result;
    console.log('Database opened successfully');
  };
  
  dbReq.onupgradeneeded = function(event) {
    var db = event.target.result;
    var objectStoreNote = db.createObjectStore(TABLE_NOTE, { keyPath: 'NoteId' , autoIncrement: true });
    console.log(objectStoreNote);
    var objectStoreTask = db.createObjectStore(TABLE_TASK, { keyPath: 'TaskId' , autoIncrement: true});
    console.log(objectStoreTask);
  };


  function getNote() {
    var transaction = db.transaction(TABLE_NOTE, 'readonly');
    var objectStore  = transaction.objectStore(TABLE_NOTE);
    var data = [];

    objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
      data.push(cursor.value);
      cursor.continue();
    } else {
      console.log('All data read:', data);
      return data;
    }
  };
  }


  function AddNote(noteName){
    var note = {
      "Name" : noteName
    }
    var tx = db.transaction(TABLE_NOTE, 'readwrite');
    var store = tx.objectStore(TABLE_NOTE);
    var request = store.add(note);
  
    request.onsuccess = function(event) {
      console.log('Note added to the database',event);
    };
  
    request.onerror = function(event) {
      console.log('Error adding Note to the database',event);
    };
  }
  function UpdateNote(noteId,noteName){
    var note = {
      "NoteId":noteId,
      "Name" : noteName
    }
    var tx = db.transaction(TABLE_NOTE, 'readwrite');
    var store = tx.objectStore(TABLE_NOTE);
    var request = store.put(note);
  
    request.onsuccess = function(event) {
      console.log('Note Updated');
    };
  
    request.onerror = function(event) {
      console.log('Error Updating Note',event);
    };
  }
  function DeleteNote(noteId){
    var transaction = db.transaction(TABLE_NOTE, 'readwrite');
  var objectStore = transaction.objectStore(TABLE_NOTE);

  var deleteRequest = objectStore.delete(noteId);
  deleteRequest.onsuccess = function(event) {
    console.log('Note deleted successfully with key' + noteId);
  };
  }


  //Task Repository
  //TaskId,NoteId,DateCreate,Checked,Name
  function getTask(Noteid) {
    var transaction = db.transaction(TABLE_TASK, 'readonly');
    var objectStore  = transaction.objectStore(TABLE_TASK);
    var data = [];

    objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if (cursor) {
      if(cursor.value.NoteId == Noteid){
        data.push(cursor.value);
      }
      cursor.continue();
    } else {
      console.log('All data read:', data);
      return data;
    }
  };
  }

  function AddTask(TaskName,noteid){
    let Task = {
      "NoteId" : noteid,
      "DateCreate" : new Date(),
      "Checked" : false,
      "Name" : TaskName
    }
    let tx = db.transaction(TABLE_TASK, 'readwrite');
    let store = tx.objectStore(TABLE_TASK);
    let request = store.add(Task);
  
    request.onsuccess = function(event) {
      console.log('Task added to the database');
    };
  
    request.onerror = function(event) {
      console.log('Error adding Task to the database',event);
    };
  }

  function UpdateTask(taskId,TaskName){
    var transaction = db.transaction(TABLE_TASK, 'readwrite');
    var objectStore = transaction.objectStore(TABLE_TASK);
  
    var getRequest = objectStore.get(taskId);
    getRequest.onsuccess = function(event) {
      var data = getRequest.result;
      data.Name = TaskName;
      data.DateCreate = new Date();

  
      var updateRequest = objectStore.put(data, taskId);
      updateRequest.onsuccess = function(event) {
        console.log('Task updated successfully');
      };
      updateRequest.onerror = function(event) {
        console.log('Error Updating Task',event);
      };
    };
    
  }

  function CheckTask(taskId){
    var transaction = db.transaction(TABLE_TASK, 'readwrite');
    var objectStore = transaction.objectStore(TABLE_TASK);
  
    var getRequest = objectStore.get(taskId);
    getRequest.onsuccess = function(event) {
      var data = getRequest.result;
      data.Checked = !data.Checked;
      data.DateCreate = new Date();
  
      var updateRequest = objectStore.put(data, taskId);
      updateRequest.onsuccess = function(event) {
        console.log('Task updated successfully');
      };
      updateRequest.onerror = function(event) {
        console.log('Error Updating Task',event);
      };
    };
    
  }

  function DeleteTask(taskId){
    var transaction = db.transaction(TABLE_TASK, 'readwrite');
  var objectStore = transaction.objectStore(TABLE_TASK);

  var deleteRequest = objectStore.delete(taskId);
  deleteRequest.onsuccess = function(event) {
    console.log('Task deleted successfully with key' + taskId);
  };
  }

function AddToNote(){
  var x = document.getElementById('NoteAdder').value;
  document.getElementById('NoteAdder').value = '';

}
  
function AddToTasks(noteId,TaskName){
  var x = document.getElementById('NoteAdder').value;
  document.getElementById('NoteAdder').value = '';

}

function ShowNotes(){
  let elmnt = document.querySelector('.job-list ul');
  

}
function ShowTasks(){

}