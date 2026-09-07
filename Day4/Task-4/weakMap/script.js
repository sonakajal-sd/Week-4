        const map = new Map();
        const weakMap = new WeakMap();

        document.getElementById("mapButton")
            .addEventListener("click", () => {

                const box = document.createElement("div");

                box.textContent = "Map Element";

                document.body.appendChild(box);

                map.set(box, "some data");

                box.remove();

                console.log("Map size:", map.size);
            });


        document.getElementById("weakMapElement")
            .addEventListener("click", () => {

                const box = document.createElement("div");

                box.textContent = "WeakMap Element";

                document.body.appendChild(box);

                weakMap.set(box, "some data");

                box.remove();

                console.log(
                    "WeakMap still has reference:",
                    weakMap.has(box)
                );
            });

