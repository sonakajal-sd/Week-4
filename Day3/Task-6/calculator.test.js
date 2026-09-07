const calculate= require("./calender");

test("adds two numbers",()=>{
    expect(calculate(10,5,"add")).toBe(15);
});

test("subracts two numbers",()=>{
    expect(calculate(10,5, "subract")).toBe(0);
});

test("returns 0 for unknown operation",()=>{
    expect(calculate(10,5,"multiply")).toBe(0);
});