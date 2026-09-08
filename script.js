document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    // Toggle Mobile Navigation
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close Mobile Menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Contact Form Submission Feedback
    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formStatus.textContent = 'Sending message...';
            formStatus.style.color = '#38bdf8';

            setTimeout(() => {
                formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                formStatus.style.color = '#4ade80';
                contactForm.reset();
            }, 1200);
        });
    }
});