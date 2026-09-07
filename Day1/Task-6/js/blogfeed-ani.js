const blogFeed = document.querySelector("#blog-feed");
const addButton = document.querySelector("#add-btn");


// ========================================
// 1. INTERSECTION OBSERVER
// ========================================

const animationObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

                observer.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.2
    }
);


// ========================================
// 2. OBSERVE EXISTING ARTICLES
// ========================================

const existingArticles =
    document.querySelectorAll(".article");

existingArticles.forEach((article) => {

    animationObserver.observe(article);

});


// ========================================
// 3. MUTATION OBSERVER
// ========================================

const mutationObserver = new MutationObserver(
    (mutations) => {

        mutations.forEach((mutation) => {

            if (mutation.type === "childList") {

                mutation.addedNodes.forEach((node) => {

                    // Is it an HTML element?
                    if (node.nodeType === 1) {

                        // Is it an article?
                        if (node.matches(".article")) {

                            console.log(
                                "New article detected:",
                                node
                            );

                            // Give new article
                            // to IntersectionObserver
                            animationObserver.observe(node);
                        }
                    }

                });

            }

        });

    }
);


// Start watching blog feed
mutationObserver.observe(blogFeed, {
    childList: true
});


// ========================================
// 4. ADD NEW ARTICLE
// ========================================

addButton.addEventListener("click", () => {

    const newArticle = document.createElement("article");

    newArticle.classList.add("article");

    newArticle.innerHTML = `
        <h2>New Article</h2>
        <p>
            This article was added dynamically.
            MutationObserver detected it!
        </p>
    `;

    blogFeed.appendChild(newArticle);

});


// const observer= new MutationObserver((mutations)=>{
//    mutations.forEach((mutation)=>{
      
//       if(mutation.type ==="classList"){

//          mutation.addedNodes.forEach((node)=>{
              
//             if(
//                node.nodeType ===1 && node.matches(".article")
//             ){
//                console.log("mew Artcile:", node);
//             }
//          });
//       }
//    })
// })

// observer.observe(blogFeed, {
//    childList:true
// })


// const button = document.querySelector("#addArticle");

// button.addEventListener("click", ()=>{
//    const article= document.createElement("article");

//    article.classList.add("article");

//    article.innerHTML= `
//    <h2>New Aryticle</h2>
//    <p>Sona Kajal</p>`;

//    blogFeed.appendChild(article);
// })