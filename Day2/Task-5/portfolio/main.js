//register event
navigator.serviceWorker.register("sw.js")

.then(()=>{
    console.log("service worker registered");
})

.catch((error)=>{
    console.log("Servive error", error);
})


