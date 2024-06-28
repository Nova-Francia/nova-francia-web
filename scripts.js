document.getElementById("burger").checked = false;
document.getElementById("burger").addEventListener("change", function () {
    if (this.checked) {
        document.body.style.position = 'fixed';
        document.body.style.overflow = "hidden";
        document.getElementById("menu").style.position = 'fixed';
        document.body.style.top = `-${window.scrollY}px`;
    } else {
        document.body.style.position = '';
        document.body.style.overflow = "";
        document.getElementById("menu").style.position = '';
        document.body.style.top = '';
    }
})

const faders = document.querySelectorAll(".fade-in");

const appearOptions = {
    threshold: 0,
    rootMargin: "0px 0px -100px 0px"
};

const appearOnScroll = new IntersectionObserver(function (
        entries,
        appearOnScroll
    ) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("appear");
                appearOnScroll.unobserve(entry.target);
            }
        });
    },
    appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

let fullscreen =document.getElementById("full-screen");
if(fullscreen) {
    fullscreen.addEventListener("click", function () {
        let header = document.querySelector("header");
        let footer = document.querySelector("footer");
        let iframe = document.getElementById("mainIframe");
        if (this.classList.contains("fullscreen")) {
            this.classList.remove("fullscreen");
            header.classList.remove("heightMask");
            footer.classList.remove("heightMask");
            iframe.style.height = "";
        } else {
            this.classList.add("fullscreen");
            header.classList.add("heightMask");
            footer.classList.add("heightMask");
            iframe.style.height = "100%";
        }
    })
}

window.onload = function () {
    Array.from(document.getElementsByClassName("maskNext")).forEach(function (item) {
            let sibling = item.nextElementSibling;
            sibling.style.height = sibling.offsetHeight + "px";
            item.addEventListener("click", function () {
                if (sibling.classList.contains("heightMask")) sibling.classList.remove("heightMask");
                else sibling.classList.add("heightMask");
            })
        }
    )
};