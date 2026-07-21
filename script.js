const slides = document.querySelectorAll(".hero-slideshow .slide");
let currentIndex = 0;

setInterval(() => {
    slides[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add("active");
}, 4000);
const hamburger = document.querySelector(".hamburger");
const topNav = document.querySelector(".top-nav");

hamburger.addEventListener("click", () => {
    const isOpen = topNav.classList.toggle("active");
    hamburger.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen);
});

const targets = document.querySelectorAll(".reason-top, .reason-bottom");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
        }
    });
}, {
    threshold: 0
});

targets.forEach((target) => observer.observe(target));