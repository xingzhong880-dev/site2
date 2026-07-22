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

const reasonTargets = document.querySelectorAll(".reason-top, .reason-bottom");

const reasonObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
        }
    });
}, {
    threshold: 0
});

reasonTargets.forEach((target) => reasonObserver.observe(target));

const voiceTargets = document.querySelectorAll(".voice-top, .voice-middle, .voice-bottom");

const voiceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
        }
    });
}, {
    threshold: 0.2
});

voiceTargets.forEach((target) => voiceObserver.observe(target));

const track = document.querySelector(".slider-track");
const originalItems = document.querySelectorAll(".slider-item");
const prevBtn = document.querySelector(".slider-arrow.prev");
const nextBtn = document.querySelector(".slider-arrow.next");

const totalItems = originalItems.length;

function getItemsPerView() {
    return window.innerWidth <= 1000 ? 1.4 : 3.6;
}

let itemsPerView = getItemsPerView();
let cloneCount = Math.ceil(itemsPerView);

const firstClones = Array.from(originalItems).slice(0, cloneCount).map(item => item.cloneNode(true));
const lastClones = Array.from(originalItems).slice(-cloneCount).map(item => item.cloneNode(true));

lastClones.forEach(clone => track.insertBefore(clone, track.firstChild));
firstClones.forEach(clone => track.appendChild(clone));

let itemWidth = 100 / itemsPerView;
let sliderIndex = cloneCount;

function updateSlider(withTransition = true) {
    track.style.transition = withTransition ? "transform 0.5s ease" : "none";
    track.style.transform = `translateX(-${sliderIndex * itemWidth}%)`;
    if (!withTransition) {
        track.offsetHeight;
    }
}

updateSlider(false);

nextBtn.addEventListener("click", () => {
    sliderIndex++;
    updateSlider();
});

prevBtn.addEventListener("click", () => {
    sliderIndex--;
    updateSlider();
});

track.addEventListener("transitionend", () => {
    if (sliderIndex >= totalItems + cloneCount) {
        sliderIndex = cloneCount;
        updateSlider(false);
    }
    if (sliderIndex <= 0) {
        sliderIndex = totalItems;
        updateSlider(false);
    }
});

window.addEventListener("resize", () => {
    const newItemsPerView = getItemsPerView();
    if (newItemsPerView !== itemsPerView) {
        itemsPerView = newItemsPerView;
        itemWidth = 100 / itemsPerView;
        sliderIndex = cloneCount; 
        updateSlider(false);
    }
});

let isDragging = false;
let startX = 0;
let startTranslate = 0;
let currentTranslate = 0;

function getTranslateX() {
    const style = window.getComputedStyle(track);
    const matrix = new DOMMatrixReadOnly(style.transform);
    return matrix.m41;
}

function dragStart(clientX) {
    isDragging = true;
    startX = clientX;
    startTranslate = getTranslateX();
    track.style.transition = "none";
}

function dragMove(clientX) {
    if (!isDragging) return;
    const diff = clientX - startX;
    currentTranslate = startTranslate + diff;
    track.style.transform = `translateX(${currentTranslate}px)`;
}

function dragEnd() {
    if (!isDragging) return;
    isDragging = false;

    const trackWidth = track.offsetWidth;
    const itemPixelWidth = (itemWidth / 100) * trackWidth;
    const movedRatio = (currentTranslate - startTranslate) / itemPixelWidth;

    if (movedRatio < -0.3) {
        sliderIndex++;
    } else if (movedRatio > 0.3) {
        sliderIndex--;
    }

    updateSlider();
}

track.addEventListener("mousedown", (e) => {
    e.preventDefault();
    dragStart(e.clientX);
});
window.addEventListener("mousemove", (e) => dragMove(e.clientX));
window.addEventListener("mouseup", dragEnd);

track.addEventListener("touchstart", (e) => {
    dragStart(e.touches[0].clientX);
});
track.addEventListener("touchmove", (e) => dragMove(e.touches[0].clientX));
track.addEventListener("touchend", dragEnd);