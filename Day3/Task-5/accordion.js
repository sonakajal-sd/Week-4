function setupAccordion(){
    const header = document.querySelector("#header");
    const panel= document.querySelector("#panel");

    header.addEventListener("click", ()=>{
        header.setAttribute("aria-expanded", "true");
        panel.hidden=false;
    });
}
module.exports= setupAccordion;