const container= document.getElementById("container");

for(let i=0 ; i<1000; i++){
    const box= document.createElement("div");
    box.className="box";
    box.textContent=`Box ${i}`;
    container.appendChild(box);
}

//performace
const boxes= document.querySelector(".box");

const heights=[];

for(const box of boxes){
    heights.push(box.offsetHeight);
}

for(let i=0; i<boxes.length; i++){
    boxes[i].style.height= (heights[i]+1) +"px";
}