export function Modal(title, content){

    const modal= document.createElement("div");
    
    const heading=document.createElement("h2");
    heading.textContent=title;

    const paragraph= document.createElement("p");
    paragraph.textContent= content;


    modal.append(heading, paragraph);
    return modal;
}