const userInput= document.querySelector("#nameInput");

const saveBtn=document.querySelector("#saveBtn");

const readBtn= document.querySelector("#readBtn");


const savedName = localStorage.getItem("name");

if (savedName) {
    userInput.value = savedName;
}

saveBtn.addEventListener("click", ()=>{

    const name= userInput.value;

    localStorage.setItem("name",name);

    userInput.value="";

})


readBtn.addEventListener("click",()=>{

    const show= localStorage.getItem("name");

    console.log(show);
    
})