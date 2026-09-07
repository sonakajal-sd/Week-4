function calculate(a,b, operation){
    if(operation ==="add"){
        return a+b;
    }
    if(operation  === "subract"){
        return a-b;
    }
    return 0;
}
module.exports= calculate;