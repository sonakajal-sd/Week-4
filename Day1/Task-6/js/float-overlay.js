const logPanel = document.querySelector("#dom-log");


const observer = new MutationObserver((mutations) => {

    mutations.forEach((mutation) => {

        // ELEMENT ADDED / REMOVED
        if (mutation.type === "childList") {

            mutation.addedNodes.forEach((node) => {

                if (node.nodeType === 1) {

                    console.log("Element added:", node);

                }

            });


            mutation.removedNodes.forEach((node) => {

                if (node.nodeType === 1) {

                    console.log("Element removed:", node);

                }

            });

        }


        // ATTRIBUTE CHANGED
        if (mutation.type === "attributes") {

            console.log(
                "Attribute changed:",
                mutation.attributeName
            );

        }

    });

});


observer.observe(document.body, {

    childList: true,
    attributes: true,
    subtree: true

});


const newDiv = document.createElement("div");

newDiv.textContent="Hello Bro";

document.body.appendChild(newDiv);
newDiv.classList.add("show");

newDiv.id= "active";
newDiv.style.background="red"

newDiv.remove();