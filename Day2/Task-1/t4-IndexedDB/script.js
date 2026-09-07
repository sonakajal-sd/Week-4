const request= indexedDB.open("MyPortfolio", 2);

request.onupgradeneeded= (event)=>{

    const db= event.target.result;

    db.createObjectStore("users",{
        keyPath:"id"
    });

    console.log("Database created");
};

request.onsuccess=(event)=>{
    
    const db= event.target.result;

    const transaction =db.transaction("users","readwrite");

    const store= transaction.objectStore("users");

    store.add({
        id:1,
        name:"Sona",
        age:22
    });

    transaction.oncomplete=()=>{
        const readTransaction =db.transaction("users","readonly");

        const readStore=readTransaction.objectStore("users");

        const getRequest= readStore.get(1);

        getRequest.onsuccess=()=>{
            console.log("user:", getRequest.result);
        };
    };
};

request.onerror=()=>{
    console.log("Database error", event.target.error);
}

