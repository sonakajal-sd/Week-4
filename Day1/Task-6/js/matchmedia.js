const mq768 = window.matchMedia(
    "(max-width: 768px)"
);

const mq1024 = window.matchMedia(
    "(max-width: 1024px)"
);


mq768.addEventListener("change", (event) => {

    console.log(
        "768px breakpoint crossed:",
        event.matches
    );

});


mq1024.addEventListener("change", (event) => {

    console.log(
        "1024px breakpoint crossed:",
        event.matches
    );

});