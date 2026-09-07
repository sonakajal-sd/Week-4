const about =document.querySelector("#aboutLink");
const home= document.querySelector("#homeLink");

const content= document.querySelector("#content");

//active link
function updateActiveLink(){

    home.classList.remove("active");

    about.classList.remove("active");

    if(location.pathname ==="/about"){

        about.classList.add("active");
    }else{

        home.classList.add("active");
    }
}

about.addEventListener("click", (event)=>{

    event.preventDefault();

    history.pushState({}, "", "/about");

    content.textContent="About Page";

    updateActiveLink();
});

window.addEventListener("popstate",()=>{

    if(location.pathname ==="/about"){

        content.textContent="About Page";

    }else{

        content.textContent="Home Page";
    }
    updateActiveLink();
});


updateActiveLink();


const path= location.pathname;

console.log(path)