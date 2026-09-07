class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(event, listener) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }

        this.events.get(event).push(listener);
    }

    emit(event, ...args) {
        const listeners = this.events.get(event) || [];

        listeners.forEach(function (listener) {
            listener(...args);
        });

        const wildcardListeners = this.events.get("*") || [];

        wildcardListeners.forEach(function (listener) {
            listener(event, ...args);
        });
    }

    off(event, listener) {
        const listeners = this.events.get(event);

        if (!listeners) {
            return;
        }

        const index = listeners.indexOf(listener);

        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }

    once(event, listener) {
        const wrapper = (...args) => {
            listener(...args);

            this.off(event, wrapper);
        };

        this.on(event, wrapper);
    }
}


class UserStore extends EventEmitter {

    constructor() {
        super();
        this.users = [];
    }

    addUser(user) {
        this.users.push(user);

        this.emit("userAdded", user);
    }

    removeUser(id) {
        const index = this.users.findIndex(function (user) {
            return user.id === id;
        });

        if (index !== -1) {
            const removedUser = this.users.splice(index, 1)[0];

            this.emit("userRemoved", removedUser);
        }
    }

    updateUser(id, newName) {
        const user = this.users.find(function (user) {
            return user.id === id;
        });

        if (user) {
            user.name = newName;

            this.emit("userUpdated", user);
        }
    }
}


const store = new UserStore();


store.on("userAdded", function (user) {
    console.log("User added:", user);
});


store.on("*", function (eventName, data) {
    console.log("EVENT:", eventName, data);
});


store.once("userAdded", function (user) {
    console.log("This runs only once:", user.name);
});


store.on("userRemoved", function (user) {
    console.log("User removed:", user);
});


store.on("userUpdated", function (user) {
    console.log("User Updated:", user);
});


// Add users
store.addUser({
    id: 1,
    name: "Sona"
});

store.addUser({
    id: 2,
    name: "Kajal"
});


// Remove user
store.removeUser(2);


// Update user
store.updateUser(1, "Sona Kajal");



