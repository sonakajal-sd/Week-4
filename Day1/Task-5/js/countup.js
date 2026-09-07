function countUp(element , target){
    const duration =2000;

    const startTime = performance.now();

    function update(currentTime){
        const elapsed= currentTime -startTime;

        const progress =Math.min(elapsed /duration ,1);

        // const currentValue =Math.floor(progress* target);   
        const currentValue= Math.floor(progress*target).toFixed(1);

        element.textContent =currentValue;

        if(progress<1){
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}



const statsSection = document.querySelector(".stats");

const statsObserver = new IntersectionObserver((entries, observer) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            const counters = entry.target.querySelectorAll("[data-target]");

            counters.forEach((counter) => {

                const target = Number(counter.dataset.target);

                countUp(counter, target);

            });

            observer.unobserve(entry.target);
        }

    });

}, {
    threshold: 0.3
});

statsObserver.observe(statsSection);