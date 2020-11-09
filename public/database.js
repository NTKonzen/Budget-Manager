let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;

    db.createObjectStore("unsaved", { autoIncrement: true });
}

request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        getData();
    }
}

function saveRecord(data) {
    const transaction = db.transaction(["unsaved"], "readwrite");
    const unSavedStore = transaction.objectStore("unsaved");

    unSavedStore.add(data);
}

function getData() {
    const transaction = db.transaction(["unsaved"], "readwrite");
    const unSavedStore = transaction.objectStore("unsaved");

    const getAllData = unSavedStore.getAll();

    getAllData.onsuccess = function () {
        fetch("/api/transaction/bulk", {
            method: "POST",
            body: JSON.stringify(getAllData.result),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["unsaved"], "readwrite");

                const unSavedStore = transaction.objectStore("unsaved");

                unSavedStore.clear();
            })
    }
}

window.addEventListener("online", getData)