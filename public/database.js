let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;

    db.createObjectStore("unsaved", { autoIncrement: true });
}

request.onsuccess = function (event) {
    db = event.target.result;
}

function saveRecord(data) {
    const transaction = db.transaction(["unsaved"], "readwrite");
    const unSavedStore = transaction.objectStore(["unsaved"]);

    unSavedStore.add(data);
}