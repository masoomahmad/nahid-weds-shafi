/* 
==================================================
ROYAL WEDDING WEBSITE MAIN JS
================================================== 
*/

document.addEventListener('DOMContentLoaded', () => {

    // 1. Remove Loader
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1000);

    // 2. Navbar Scroll Effect & Mobile Menu
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinksList = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    hamburger.addEventListener('click', () => {
        navLinksList.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinksList.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksList.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

    // 3. Countdown Timer to April 10, 2026
    const weddingDate = new Date('April 10, 2026 15:30:00').getTime(); // Roughly Before Asar

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.querySelector('.countdown-container').innerHTML = "<h3 class='gold-text' style='font-family: var(--font-heading); font-size: 2rem;'>Alhamdulillah, We're Married!</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
    };

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal, .scale-in');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Toggle Menu Section & RSVP Logic
    const toggleMenuBtn = document.getElementById('toggleMenuBtn');
    const menuGrid = document.getElementById('menuGrid');

    // RSVP Modal Elements
    const rsvpModal = document.getElementById('rsvpModal');
    const closeBtn = document.querySelector('.close-btn');
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');

    let isRsvpSubmitted = false;

    // Menu unlock date: April 7, 2026 (midnight local time)
    const menuUnlockDate = new Date('2026-04-07T00:00:00');

    // Original condition (commented out for testing):
    const isMenuUnlocked = new Date() >= menuUnlockDate;

    // --> TESTING MODE ONLY <-- Set to true to test the menu reveal right now
    // const isMenuUnlocked = true;

    if (toggleMenuBtn && menuGrid) {
        toggleMenuBtn.addEventListener('click', () => {
            if (isRsvpSubmitted && isMenuUnlocked) {
                // Already RSVP'd and menu is unlocked: act as toggle
                menuGrid.classList.toggle('hidden');
                if (menuGrid.classList.contains('hidden')) {
                    toggleMenuBtn.innerHTML = '<i class="fas fa-utensils" style="margin-right: 10px;"></i> Reveal The Menu';
                } else {
                    toggleMenuBtn.innerHTML = '<i class="fas fa-times" style="margin-right: 10px;"></i> Hide Menu';
                }
            } else {
                // Always open the RSVP modal (before or after April 7)
                if (rsvpModal) rsvpModal.classList.add('show');
            }
        });
    }

    // Modal Close Logic
    if (rsvpModal && closeBtn) {
        closeBtn.addEventListener('click', () => {
            rsvpModal.classList.remove('show');
        });

        window.addEventListener('click', (event) => {
            if (event.target === rsvpModal) {
                rsvpModal.classList.remove('show');
            }
        });
    }

    // Modal Submit Logic (Reveals Menu & Sends to Google Sheet)
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!rsvpForm.checkValidity()) {
                rsvpForm.reportValidity();
                return;
            }

            const submitBtn = rsvpForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(rsvpForm);
            const data = new URLSearchParams();
            // Map our form fields to the sheet columns (using original aqiqah names where possible to recycle columns, plus new ones)
            data.append('name', formData.get('guestName'));
            data.append('guests', formData.get('guestCount'));
            data.append('attendance', formData.get('attendance'));
            data.append('message', formData.get('guestMessage'));

            const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxdxBCQgAq7Np3ZVtjwzWWSKwIHH0STwReqEZIST046il5Td0yeasd5ne-D5XJ1OHbQqw/exec';

            fetch(SCRIPT_URL, {
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .then(res => {
                    // 1. Show Success Message in Modal
                    rsvpForm.style.display = 'none';
                    if (rsvpSuccess) rsvpSuccess.classList.remove('hidden');

                    // 2. Mark as submitted
                    isRsvpSubmitted = true;

                    // 3. Close modal after a delay
                    setTimeout(() => {
                        if (rsvpModal) {
                            rsvpModal.classList.remove('show');

                            // Reset modal content silently for future state
                            setTimeout(() => {
                                rsvpForm.reset();
                                submitBtn.innerText = originalBtnText;
                                submitBtn.disabled = false;
                            }, 500);
                        }

                        // 4. Either reveal the menu or show a coming-soon message
                        if (isMenuUnlocked) {
                            // Menu is already unlocked — reveal it and scroll to it
                            if (menuGrid) menuGrid.classList.remove('hidden');
                            if (toggleMenuBtn) {
                                toggleMenuBtn.innerHTML = '<i class="fas fa-times" style="margin-right: 10px;"></i> Hide Menu';
                            }
                            if (menuGrid) {
                                menuGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        } else {
                            // Menu not yet unlocked — update button to show unlock date message
                            if (toggleMenuBtn) {
                                toggleMenuBtn.innerHTML = '<i class="fas fa-calendar-alt" style="margin-right: 10px;"></i> Menu Reveals on 7th April 🗓️';
                                toggleMenuBtn.style.opacity = '0.75';
                                toggleMenuBtn.style.cursor = 'default';
                            }
                        }
                    }, 2500); // Wait 2.5 seconds before closing
                })
                .catch(error => {
                    console.error('Error submitting RSVP!', error.message);
                    submitBtn.innerText = 'Error! Try Again';
                    submitBtn.disabled = false;
                    setTimeout(() => {
                        submitBtn.innerText = originalBtnText;
                    }, 3000);
                });
        });
    }

    /* --- Rose Petal Confetti Logic --- */
    // Helper to fire confetti with a distinct petal-like appearance
    function fireRosePetals() {
        const duration = 4000;
        const animationEnd = Date.now() + duration;
        const defaults = {
            startVelocity: 15,
            spread: 360,
            ticks: 100,
            zIndex: 999,
            gravity: 0.6, // Slower fall
            scalar: 1.5   // Bigger petals
        };

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 15 * (timeLeft / duration);
            // Fire from two sides, using dark red/maroon colors to mimic roses
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#800000', '#c8102e', '#ff0038', '#d4af37'],
                shapes: ['circle']
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#800000', '#c8102e', '#ff0038', '#d4af37'],
                shapes: ['circle']
            }));
        }, 300);
    }

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Trigger rose petals specifically when Hero section comes into full view
    const heroSection = document.querySelector('.hero');
    let confettiCooldown = false;

    if (heroSection && typeof confetti !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !confettiCooldown) {
                    // Fire when they scroll to the top
                    setTimeout(fireRosePetals, 800);
                    confettiCooldown = true;
                } else if (!entry.isIntersecting) {
                    // Reset when they scroll away so it can fire again later
                    confettiCooldown = false;
                }
            });
        }, { threshold: 0.1 });

        observer.observe(heroSection);
    }

    /* --- Thank You Toast Logic --- */
    const toast = document.getElementById('thankYouToast');
    let toastShown = false;

    if (toast) {
        window.addEventListener('scroll', () => {
            // Check if user is scrolled near the very bottom
            const scrollPosition = Math.ceil(window.innerHeight + window.scrollY);
            const documentHeight = Math.max(
                document.body.scrollHeight, document.documentElement.scrollHeight,
                document.body.offsetHeight, document.documentElement.offsetHeight,
                document.body.clientHeight, document.documentElement.clientHeight
            );

            if (scrollPosition >= documentHeight - 150) {
                if (!toastShown) {
                    toast.classList.add('show');
                    toastShown = true;

                    // Auto hide after 5 seconds
                    setTimeout(() => {
                        toast.classList.remove('show');
                    }, 5000);
                }
            } else {
                // If they scroll back up, reset it so it can trigger again next time
                toastShown = false;
                toast.classList.remove('show');
            }
        });
    }

});