const userInput= document.querySelector("#nameInput");

const saveBtn=document.querySelector("#saveBtn");

const readBtn= document.querySelector("#readBtn");


const savedName = sessionStorage.getItem("name");

if (savedName) {
    userInput.value = savedName;
}

saveBtn.addEventListener("click", ()=>{

    const name= userInput.value;

   sessionStorage.setItem("name",name);

    userInput.value="";

})


readBtn.addEventListener("click",()=>{

    const show= sessionStorage.getItem("name");

    console.log(show);
    
})