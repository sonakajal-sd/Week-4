// Task 1 part 1
function double(x){

    return x*2;
}

function addOne(x){
    return x+1;
}

function pipe(fn1 , fn2){
    return function(value){
        const result= fn1(value);

        return fn2(result);
    }
}

console.log(pipe(double, addOne)(5));




function double(x){
    return x*2;
}
function addOne(x){
    return x+1;

}function square(x){
  return x*x;
}

function pipe(...functions){

    return function(value){

       return functions.reduce(function(result, fn){

        return fn(result);

       },value);
       
    }
}

console.log(pipe(double, addOne, square)(5))


//task1 part 2

function compose(...functions){
    return function(value){
         return functions.reduceRight(function(result, fn){
            return fn(result);
         },value);
    }
}

console.log(compose(double, addOne, square)(5))


//curriying

function add(a){
    return function(b){
        return function(c){
            return a+b+c;
        }
    }
}

console.log(add(10)(10)(10));



// function curry(fn){
//     return function(a){
//         return function(b){
//             return function(c){
//                 return fn(a,b,c);
//             }
//         }
//     }
// }

// function add(a,b,c){
//     return a+b+c;
// }

// const curriedAdd= curry(add);

// console.log(curriedAdd(1)(2)(3));


//partial function

function greet(greeting, name){

    return greeting + " " +name;
}
function partial(fn, preset){

    return function(name){

        return fn(preset, name);
    }
}
const sayHello = partial(greet, "Hello");

console.log(sayHello("Sona"));
console.log(sayHello("Ram"))