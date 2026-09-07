function setupMobileNav(){
    const button =document.querySelector("#menu");
    const drawer= document.querySelector("#drawer");

    button.addEventListener("click", ()=>{
        drawer.classList.add("open");
    })
}

module.exports= setupMobileNav;