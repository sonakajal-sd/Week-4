// ======================================
// 1. CLIPBOARD
// ======================================

const codeBlock = document.querySelector("#codeBlock");

const copyBtn = document.querySelector("#copyBtn");

const copyMessage = document.querySelector("#copyMessage");


copyBtn.addEventListener("click", async () => {

    await navigator.clipboard.writeText(
        codeBlock.textContent
    );

    copyMessage.textContent = "Copied! ✅";

});



// ======================================
// 2. NOTIFICATION
// ======================================

const contactForm = document.querySelector("#contactForm");


contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    // Ask notification permission
    const permission =
        await Notification.requestPermission();


    if (permission === "granted") {

        new Notification(
            "Form submitted successfully! ✅"
        );

    }


    console.log("Form submitted");

});



// ======================================
// 3. GEOLOCATION
// ======================================

const locationInput =
    document.querySelector("#location");

const locationBtn =
    document.querySelector("#locationBtn");

const locationMessage =
    document.querySelector("#locationMessage");


locationBtn.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            console.log(
                "Latitude:",
                latitude
            );

            console.log(
                "Longitude:",
                longitude
            );


            // Convert coordinates → city
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );

           


            const data = await response.json();


            const city =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "";


            locationInput.value = city;

            locationMessage.textContent =
                `Location detected: ${city} `;

        },


        (error) => {

            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                locationMessage.textContent =
                    "Location permission denied.";

            } else {

                locationMessage.textContent =
                    "Unable to detect location.";

            }

        }

    );

});



// ======================================
// 4. WEB SHARE API
// ======================================

const shareBtn =
    document.querySelector("#shareBtn");

const shareMessage =
    document.querySelector("#shareMessage");


shareBtn.addEventListener("click", async () => {


    // Browser supports Web Share API
    if (navigator.share) {

        try {

            await navigator.share({

                title: "My Portfolio",

                text: "Check out my portfolio!",

                url: window.location.href

            });

            shareMessage.textContent =
                "Shared successfully! ✅";

        }

        catch (error) {

            console.log(
                "Share cancelled"
            );

        }

    }


    // Browser does NOT support Web Share
    else {

        await navigator.clipboard.writeText(
            window.location.href
        );

        shareMessage.textContent =
            "Share not supported. URL copied! 📋";

    }

});


