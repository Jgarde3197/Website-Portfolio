// MOBILE NAVIGATION MENU TOGGLE
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link, .mobile-only-btn");

if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", () => {
        hamburgerBtn.classList.toggle("active");
        navMenu.classList.toggle("active");
        document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "auto";
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            hamburgerBtn.classList.remove("active");
            navMenu.classList.remove("active");
            document.body.style.overflow = "auto";
        });
    });
}

// CONTACT FORM SUBMISSION
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const WEBHOOK_URL = "https://hook.eu1.make.com/rsgapus44rty85sh2463qa38bevxbvvs";

if (form) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        formStatus.textContent = "Sending...";

        const formData = new FormData(form);

        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            service: formData.get("service"),
            message: formData.get("message")
        };

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                formStatus.textContent = "Message sent successfully!";
                form.reset();
            } else {
                formStatus.textContent = "Something went wrong. Please try again.";
            }

        } catch (error) {
            console.error(error);
            formStatus.textContent = "Unable to send message.";
        }
    });
}