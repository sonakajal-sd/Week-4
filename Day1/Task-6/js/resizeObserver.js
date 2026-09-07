const container= document.querySelector(".chart-container");


function drawChart(width, height){
    console.log("Redrawing Chart:", width, height);

    const chart= document.querySelector("#chart");

    chart.innerHTML="";

    const values=[20,40,55,90,60];

    values.forEach((value)=>{
        const bar=document.createElement("div");

        bar.classList.add("bar");

        bar.style.height= `${value}%`;

        bar.style.width = `${width / values.length}px`;

        chart.appendChild(bar);

    })
}

const resizeObserver=  new ResizeObserver((entries)=>{
    entries.forEach((entry)=>{
        
        const width= entry.contentRect.width;
        const height= entry.contentRect.height;

        drawChart(` Width:${width}  Height: ${height}`);
    });
});

resizeObserver.observe(container);