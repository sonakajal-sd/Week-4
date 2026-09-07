const sections = document.querySelectorAll(".section");
const stickyHeader = document.querySelector("#sticky-header");

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                const title = entry.target.querySelector("h2").textContent;

                stickyHeader.textContent = title;
                stickyHeader.style.display = "block";
            }

        });

    },
    {
        rootMargin: "-50px 0px -90% 0px",
        threshold: 0
    }
);

sections.forEach((section) => {
    observer.observe(section);
});