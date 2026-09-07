const userInput = document.querySelector("#nameInput");
const saveBtn = document.querySelector("#saveBtn");
const getBtn = document.querySelector("#getBtn");
const deleteBtn = document.querySelector("#deleteBtn");
const clearMe = document.querySelector("#clearMe");


const storageManager = {

    set(key, value, ttl) {

        const expiresAt = Date.now() + ttl;

        const data = {
            value: value,
            expiresAt: expiresAt
        };

        const storedData = JSON.stringify(data);

        localStorage.setItem(key, storedData);
    },


    get(key) {

        const storedData = localStorage.getItem(key);

        if (!storedData) {
            return null;
        }

        const data = JSON.parse(storedData);

        if (Date.now() > data.expiresAt) {

            localStorage.removeItem(key);

            return null;
        }

        return data.value;
    },


    delete(key) {

        localStorage.removeItem(key);
    },


    clear() {

        localStorage.clear();
    }

};


// TEST

storageManager.set("name", "Sona", 5000);

console.log(storageManager.get("name"));

const name = storageManager.get("name");

console.log(name);

storageManager.delete("name");

storageManager.clear();

console.log(storageManager.get("name"));