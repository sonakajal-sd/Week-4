const add= require("./add");

test("adds two numbers", ()=>{
    expect(add(2,3)).toBe(5);
});

// test("returns a random number",()=>{
//     expect(Math.random()).toBe(5);
// });

// let count= 0;

// beforeEach(()=>{
//     count=0;
// })
// afterEach(()=>{
//     console.log("Test Completed");
// })

// test("first test",()=>{
//     count++;
//     expect(count).toBe(1);
// });
// test("second test",()=>{
//     count++;
//     expect(count).toBe(1);
// })



const mockFn= jest.fn();

afterEach(()=>{
    jest.clearAllMocks();
})
test("mock is called",()=>{
    mockFn("Hello");

    expect(mockFn).toHaveBeenCalledTimes(1);
});

test("mock starts with fresh call history",()=>{
    expect(mockFn).toHaveBeenCalledTimes(0);
});

const user={
    getName:()=>"Kajal"
};

afterEach(()=>{
    jest.restoreAllMocks();
});

test("spies on getname",()=>{
    const spy= jest.spyOn(user,"getName");

    user.getName();

    expect(spy).toHaveBeenCalled();
});

test("original function is restored",()=>{
    expect(user.getName()).toBe("Kajal");
});