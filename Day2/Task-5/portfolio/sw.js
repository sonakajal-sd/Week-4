
//install event 

const CACHE_NAME= "portfolio-v1";

const FILES_TO_CACHE=[
    "./",
    "./index.html",
    "./style.css",
    "./main.js"
]

self.addEventListener("install",(event)=>{

    console.log("installed Started");
    
    event.waitUntil(

        caches.open(CACHE_NAME) .then((cache)=>{

            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// self.addEventListener("fetch", (event)=>{
//     event.respondWith(

//         caches.match(event.request)

//         .then((cachedResponse)=>{
            
//             if(cachedResponse){

//                 return cachedResponse;
//             }
           
//                 return fetch(event.request);
         
//         })
//     )
// })


self.addEventListener("fetch", (event) => {

    const url = new URL(event.request.url);

    if (url.pathname.startsWith("/api/")) {

        event.respondWith(
            fetch(event.request)
                .then((response) => {

                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)

                    .then((cache)=>{
                        cache.put(event.request, responseClone);
                    });
                    return response;

                })
                .catch(() => {

                    return caches.match(event.request);

                })
        );

        return;
    }

});

self.addEventListener("activate", (event)=>{
    event.waitUntil(
       caches.keys() 
       .then((cacheNames)=>{
        return Promise.all(
            cacheNames
            .filter((cacheName)=>{
                return cacheName !==CACHE_NAME;
            })
            .map((cacheName)=>{
                return caches.delete(cacheName);
            })
        )
       })
    )
})