// import {multiply , divide} from "./learn.js";

// console.log(multiply(2,2));
// console.log(divide(20,5));


// const shareBtn = document.querySelector("#shareBtn");

// const shareMessage= document.querySelector("#message");

// shareBtn.addEventListener("click", async()=>{
//    if(navigator.share){

//     try{
//         await navigator.share({
//             title:"My portfolio",
//             text:"Check out my profile",
//             url: window.location.href
//         })

//         shareMessage.textContent="Shared successfully";
//     }
//     catch(error){
//         console.log(error);
//     }
//    }

//    else{

//     await navigator.clipboard.writeText( window.location.href);
//     shareMessage.textContent="Share not supported URl copied";
//    }
// });



// const categorySelect= document.querySelector("#category");

// const params= new URLSearchParams(location.search);

// const category= params.get("category");

// console.log("Full URL:", location.href);
// console.log("Search:", location.search);
// console.log("Category:", category);

// if(category){
//     categorySelect.value =category;
// }

console.log(performance.now());
    