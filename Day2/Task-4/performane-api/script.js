const renderBtn= document.querySelector("#renderBtn");

const container= document.querySelector("#container");


renderBtn.addEventListener("click", ()=>{
          const start= performance.now();

          container.innerHTML="";
          for(let i=0; i<1000; i++){
            const item= document.createElement("div");

            item.textContent=`Item ${i}`;

            container.appendChild(item);
          }

          const end= performance.now();
          console.log("Time:", end-start , "ms");

});


const virtualBtn= document.querySelector("#virtualBtn");

const container2= document.querySelector("#container2");


virtualBtn.addEventListener("click",()=>{
    const start= performance.now();
    container.innerHTML="";
    const visibleItems= 20;

    for(let i=0; i<visibleItems; i++){
        const item= document.createElement("div");
 
        item.textContent=`Item ${i}`;
        container2.appendChild(item);

    }
    const end=performance.now();

    console.log("Virtula Sscroll  time", end-start, "ms");

})


// LCP
// const observer= new PerformanceObserver((list)=>{

//     const entries= list.getEntries();

//     const lastEntry= entries[entries.length -1];

//     console.log("LCP:", lastEntry.startTime ,"ms");
// });

// observer.observe({
//     type: "largest-contentful-paint",
//     buffered:true
// });

// CLS = Cumulative Layout Shift

setTimeout(() => {

    document.querySelector("#box").style.height = "300px";

}, 2000);

const observer= new PerformanceObserver((list)=>{

    const entries= list.getEntries();

    entries.forEach((entry)=>{
        console.log("CLS:", entry.value);
    });
});

observer.observe({
    type: "layout-shift",
    buffered:true
});



function init(){
    console.log("portfolio initializing...");

    for( let i=0; i<100000; i++){

    }
    console.log("portfolio ready");
}

performance.mark("init-start");
init()
performance.mark("init-end");

performance.measure("portfolio-init", "init-start", "init-end");

const result= performance.getEntriesByName("portfolio-init");

console.log(
    "Init Time:",
    result[0].duration,
    "ms"
);

// navigator.connection -Browser-ku user oda network connection information konjam kidaikkum.

const connection = navigator.connection;
console.log(connection.effectiveType)


