/*----------------About Section Tabs ----------------------*/
(() => {
    const aboutSection = document.querySelector('.about-section'),
        tabsContainer = document.querySelector('.about-tabs');

    tabsContainer.addEventListener('click', (event) => {
        /*if event.target contains 'tab-item' class
         and not contains 'active' class */
        if (event.target.classList.contains("tab-item") &&
            !event.target.classList.contains("active")) {
            const target = event.target.getAttribute('data-target');
            //deactivate existing active 'tab items'
            tabsContainer.querySelector(".active").classList.remove("outer-shadow", "active");
            //activate new 'tab items'
            event.target.classList.add("active", "outer-shadow");
            //deactivate existing active 'tab item'
            aboutSection.querySelector(".tab-content.active").classList.remove("active");
            //activate new 'tab-content'
            aboutSection.querySelector(target).classList.add("active");
        }
    })
})();

function bodyScrollingToggle() {
    document.body.classList.toggle("hidden-scrolling");
}

/*------hamburger menu toggle */
(() => {
    const hamburgerBtn = document.querySelector(".hamburger-btn"),
        navMenu = document.querySelector(".nav-menu"),
        closeNavMenu = document.querySelector(".close-nav-menu");

    hamburgerBtn.addEventListener("click", () => {
        navMenu.style.visibility = "visible";
        navMenu.style.opacity = "1";
        navMenu.style.zIndex = "999";
        bodyScrollingToggle();
    });

    closeNavMenu.addEventListener("click", () => {
        navMenu.style.visibility = "hidden";
        navMenu.style.opacity = "0";
        navMenu.style.zIndex = "-1";
        bodyScrollingToggle();
    });

    // Close menu when clicking on nav links
    navMenu.addEventListener("click", (event) => {
        if (event.target.tagName === "A") {
            navMenu.style.visibility = "hidden";
            navMenu.style.opacity = "0";
            navMenu.style.zIndex = "-1";
            bodyScrollingToggle();
        }
    });
})();

/*------portfolio filter and popup */
(() => {
    const filterContainer = document.querySelector(".portfolio-filter"),
        portfolioItemsContainer = document.querySelector(".portfolio-items"),
        portfolioItems = document.querySelectorAll(".portfolio-item"),
        popup = document.querySelector(".portfolio-popup"),
        prevBtn = popup.querySelector(".pp-prev"),
        nextBtn = popup.querySelector(".pp-next"),
        closeBtn = popup.querySelector(".pp-close"),
        projectDetailsContainer = popup.querySelector(".pp-details"),
        projectDetailsBtn = popup.querySelector(".pp-project-details-btn");

    let itemIndex, slideIndex, screenshots;
    /*filter portfolio items*/
    filterContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("filter-item") &&
            !event.target.classList.contains("active")) {
            //filterContainer.querySelector(".active", "outer-shadow");
            filterContainer.querySelector(".active").classList.remove("outer-shadow", "active");
            event.target.classList.add("active", "outer-shadow");
            const target = event.target.getAttribute("data-target");
            portfolioItems.forEach((item) => {
                //console.log(item.getAttribute("data-category"));
                if (target === item.getAttribute("data-category") || target === 'all') {
                    item.classList.remove("hide");
                    item.classList.add("show");
                } else {
                    item.classList.remove("show");
                    item.classList.add("hide");
                }
            })
        }
    })
    portfolioItemsContainer.addEventListener("click", (event) => {
        if (event.target.closest(".portfolio-item-inner")) {
            const portfolioItem = event.target.closest(".portfolio-item-inner").parentElement;
            //get the portfolio index
            itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(
                portfolioItem
            );
            screenshots = portfolioItems[itemIndex].querySelector(".portfolio-item-img img ").getAttribute("data-screenshots");
            //convert screenshots into array
            screenshots = screenshots.split(",");
            if (screenshots.length === 1) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
            } else {
                prevBtn.style.display = "block";
                nextBtn.style.display = "block";
            }
            slideIndex = 0;
            popupToggle();
            popupSlideshow();
            popupDetails();
        }
    })
    closeBtn.addEventListener("click", () => {
        popupToggle();
        if (projectDetailsContainer.classList.contains("active")) {
            popupDetailsToggle();
        }
    })

    function popupToggle() {
        popup.classList.toggle("open");
        bodyScrollingToggle();
    }

    function popupSlideshow() {
        const imgSrc = screenshots[slideIndex];
        const popupImg = popup.querySelector(".pp-img");
        /*activate loader untill the popupImg loaded */
        popup.querySelector(".pp-loader").classList.add("active");
        popupImg.src = imgSrc;
        popupImg.onload = () => {
            //deactivate loader after the popupImg loaded
            popup.querySelector(".pp-loader").classList.remove("active");
        }
        popup.querySelector(".pp-counter").innerHTML = (slideIndex + 1) + "of " + screenshots.length;
    }
    //next slideIndex 
    nextBtn.addEventListener("click", () => {
            if (slideIndex === screenshots.length - 1) {
                slideIndex = 0;
            } else {
                slideIndex++;
            }
            popupSlideshow();
        })
        //prev slide
    prevBtn.addEventListener("click", () => {
        if (slideIndex === 0) {
            slideIndex = screenshots.length - 1
        } else {
            slideIndex--;
        }
        popupSlideshow();

    })

    function popupDetails() {
        //if portfolio-item-details not exists
        if (!portfolioItems[itemIndex].querySelector(".portfolio-item-details")) {
            projectDetailsBtn.style.display = "none";

            return; //end function execution
        }
        projectDetailsBtn.style.display = "block";
        //get the project details
        const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;
        //set the project details

        popup.querySelector(".pp-project-details").innerHTML = details;
        //get the project title
        const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").innerHTML;
        //set the project title
        popup.querySelector(".pp-title h2").innerHTML = title;
        //get the project category
        const category = portfolioItems[itemIndex].getAttribute("data-category");

        //set the project category
        popup.querySelector(".pp-project-category").innerHTML = category.split("-").join(" ");
    }
    projectDetailsBtn.addEventListener("click", () => {
        popupDetailsToggle();
    })

    function popupDetailsToggle() {
        if (projectDetailsContainer.classList.contains("active")) {
            projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
            projectDetailsBtn.querySelector("i").classList.add("fa-plus");
            projectDetailsContainer.classList.remove("active");
            projectDetailsContainer.style.maxHeight = 0 + "px";
        } else {
            projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
            projectDetailsBtn.querySelector("i").classList.add("fa-minus");
            projectDetailsContainer.classList.add("active");
            projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + "px";
            popup.scrollTo(0, projectDetailsContainer.offsetTop);
        }

    }
})();

/*--------------------------testimonial slider ----------------------------------*/
(() => {
    // Check if testimonial elements exist before initializing
    const sliderContainer = document.querySelector(".testi-slider-container");
    if (!sliderContainer) return;
    
    const slides = sliderContainer.querySelectorAll(".testi-item"),
        slideWidth = sliderContainer.offsetWidth,
        prevBtn = document.querySelector(".testi-slider-nav .prev"),
        nextBtn = document.querySelector(".testi-slider-nav .next"),
        activeSlide = sliderContainer.querySelector(".testi-item.active");
    
    if (!slides.length || !activeSlide) return;
    
    let slideIndex = Array.from(activeSlide.parentElement.children).indexOf(activeSlide);

    // set width of all slides
    slides.forEach((slide) => {
            slide.style.width = slideWidth + "px";
        })
        //set width of slideContainer
    sliderContainer.style.width = slideWidth * slides.length + "px";

    nextBtn && nextBtn.addEventListener("click", () => {
        if (slideIndex === slides.length - 1) {
            slideIndex = 0;
        } else {
            slideIndex++;
        }
        slider();
    })

    prevBtn && prevBtn.addEventListener("click", () => {
        if (slideIndex === 0) {
            slideIndex = slides.length - 1;

        } else {
            slideIndex--;
        }
        slider();
    })

    function slider() {
        //deactivate existing active slides
        sliderContainer.querySelector(".testi-item.active").classList.remove("active");
        //activate new slide
        slides[slideIndex].classList.add("active");
        sliderContainer.style.marginLeft = -(slideWidth * slideIndex) + "px";
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const newSlideWidth = sliderContainer.offsetWidth;
        slides.forEach((slide) => {
            slide.style.width = newSlideWidth + "px";
        });
        sliderContainer.style.width = newSlideWidth * slides.length + "px";
        sliderContainer.style.marginLeft = -(newSlideWidth * slideIndex) + "px";
    });
})();

async function submitForm() {
    event.preventDefault();
    // Get form values
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Create the payload for Google Workspace Chat webhook
    const chatMessage = {
        "text": `New form submission:\n\nFull Name: ${fullName}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
    };

    // Send the form data to Google Chat webhook
    await fetch("https://chat.googleapis.com/v1/spaces/AAAAKrICgCg/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=6ZTmdxAXrE05-FG3YFaVJWJE5EXwMdVKh3ragY8RRBU", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(chatMessage)
    })
    .then(response => {
        if (response.ok) {
            document.getElementById("statusMessage").innerText = "Form submitted successfully!";
        } else {
            document.getElementById("statusMessage").innerText = "Error submitting form.";
        }
    })
    .catch(error => {
        document.getElementById("statusMessage").innerText = "Error: " + error;
    });
    
}
// setTimeout(submitForm(),50000);