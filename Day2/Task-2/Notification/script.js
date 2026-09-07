Notification.requestPermission()
.then((permission)=>{
    if(permission ==="granted"){

        new Notification("Form Submitted Successully");
    }
})