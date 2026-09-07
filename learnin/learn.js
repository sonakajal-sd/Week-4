// const subscribers=[];

// function subscribe(callback){
//     subscribers.push(callback);
// }

// function notify(data){
//     subscribers.forEach(function(callback){
//         callback(data);
//     });
// };

// subscribe(function(name){
//     console.log("Recived:", name);
// })
// subscribe(function(name){
//     console.log("Message Length:",name.length
//     )
// })

// notify("Sona")



// function createUser(name, age){
//     return {
//         name:name,
//         age:age
//     };
// }
// const user1= createUser("Sona", 22);
// console.log(user1);
// const user2= createUser("Ram",34);




// function createCar(brand, model){
//     return{
//         brand:brand,
//         model:model
//     };
// }
// const b1= createCar("toyota","innova");

// console.log(b1);



// const events= {};

// function on(eventName , callback){
//    if(!events[eventName]){
//     events[eventName]= [];
//     events[eventName].push(callback);
//    }
// }

// function emit(eventName){
//     if(!events[eventName]){
//         return;
//     }
//     events[eventName].forEach(function(callback){
//         callback();
//     })
// }



// class EventEmitter{
//     constructor(){
//         this.events={}
//     }

//     on(eventName, callback){
//         if(!this.events[eventName]){
//             this.events[eventName]=[];
//         }
//         this.events[eventName].push(callback);
//     }

//     emit(eventName){
//         if(!this.events[eventName]){
//             return;
//         }

//         this.events[eventName].forEach(function(callback){
//             callback();
//         });
//     }
// }

// const emitter =new EventEmitter();

// emitter.on("login",function(){
//     console.log("User Logged in");
// })
// emitter.on("login", function(){
//     console.log("Welcome");
// })

// emitter.emit("login","Sona");



// query

// .select("name, email")
// .from("users")
// .where("age >18");

// class QueryBuilder{
//     constructor(){
//         this.query="";
//     }
//     select(fields){
//         this.query= "SELECT " +fields;
//         return this;
//     }
//     from (table){
//         this.query +=" FROM " +table;
//         return this;
//     }
//     where(condition){
//         this.query +=" WHERE " +condition;
//         return this;
//     }
//     build(){
//         return this.query;
//     }
    
// }
// const query = new QueryBuilder();

// const result =query
// .select("name, email")
// .from("users")
// .where("age >18")
// .build();

// console.log(result);



const request= indexedDB.open("MyDatabase", 1);

request.onupgradeneeded= (event)=>{

    const db= event.target.result;

    db.createObjectStore("users");
};


const user={
    name:"Arun",
    age:25
};

store.add(user);

