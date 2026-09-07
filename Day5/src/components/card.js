export function Card(title, content){
    const card= document.createElement("div");

    const heading= document.createElement("h3");
    heading.textContent=title;

    const paragraph= document.createElement("p");
    paragraph.textContent=content;

    card.apppend(heading, paragraph);
    
    return card;



}