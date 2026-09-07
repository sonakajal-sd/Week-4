

function createUser({name, email, role="viewer",createdAt= Date.now()}){
     
      if(!name){
        throw new Error("Name is required");
    }

    if(!email){
        throw new Error("Email is required");
    }
    const user= {
        id:crypto.randomUUID(),
        name:name,
        email:email,
        role:role,
        createdAt:createdAt
    };
    return Object.freeze(user);

}

const user= createUser({
    name:"SOna",
    email:"sonakajalsd10@gmail.com"
});

console.log(user);




class QueryBuilder{
    constructor(){
        this.query="";
    }
    select(fields){
        this.query= " SELECT " +fields;
        return this;
    }

    from(table){
        this.query += " FROM " + table;
        return this;
    }
    where(condition){
        this.query += " WHERE " + condition;
        return this;
    }
  
    limit(n){
        this.query +=" LIMIT " + n;
        return this;
    }
    build(){
        return this.query;
    }
}
const query= new QueryBuilder();

const result= query
.select(["name","email"])
.from("users")
.where("age >18")
.limit(20)
.build();

console.log(result);



function createNotification({
    type,
    message,
    duration,
    dismissible
}){
    const notification= {
        type: type,
        message:message,
        duration: duration,
        dismissible:dismissible
    };
    return notification;
}

const notification = createNotification({
    type:"success",
    message:"Saved Successfully",
    duration:5000,
    dismissible:false
});

console.log(notification);

