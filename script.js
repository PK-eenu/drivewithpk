document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Mobile Navigation & Sticky Header
       ========================================================================== */
    const header = document.querySelector('.header');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    // Sticky Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Drawer Open
    menuToggleBtn.addEventListener('click', () => {
        mobileDrawer.classList.add('open');
    });

    // Drawer Close
    closeDrawerBtn.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
    });

    // Close drawer when clicking links
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
        });
    });


    /* ==========================================================================
       2. Suburb Coverage Checker
       ========================================================================== */
    const suburbInput = document.getElementById('suburb-input');
    const suburbCheckBtn = document.getElementById('suburb-check-btn');
    const suburbResult = document.getElementById('suburb-result');

    // Active Service Suburbs in Geelong
    const coveredSuburbs = {
        "armstrong creek": "Yes! Armstrong Creek is one of our primary growth corridors. PK offers pickup from home, school, or Iona College.",
        "belmont": "Yes! Belmont is fully covered. Perfect for practicing roundabouts near Wilsons Road and merging onto High Street.",
        "east geelong": "Yes! East Geelong is covered. We conduct mock tests and route practices in this vicinity.",
        "geelong west": "Yes! Geelong West is covered. Great area for practicing lane management on Pakington Street.",
        "grovedale": "Yes! Grovedale is fully covered. Convenient pickup and route prep starting near Grovedale College.",
        "hamlyn heights": "Yes! Hamlyn Heights is in our active service area. Great residential roads for starting out.",
        "highton": "Yes! Highton is covered. Highly recommended for practicing hills starts, clutch control and winding roads.",
        "lara": "Yes! Lara is covered. We conduct automatic driving training and freeway merging practice on the Princes Highway.",
        "leopold": "Yes! Leopold is covered. Perfect gateway for students near the Bellarine Peninsula.",
        "newtown": "Yes! Newtown is covered. Excellent residential zones for parallel parking practice.",
        "wandana heights": "Yes! Wandana Heights is covered. Great hilly roads to build confidence.",
        "waurn ponds": "Yes! Waurn Ponds is covered. We offer direct pickup and drop-off at the Deakin University Campus.",
        "newcomb": "Yes! Newcomb is covered. Easy access to arterial routes for intermediate students.",
        "norlane": "Yes! Norlane is covered. We practice suburban driving rules and school zones.",
        "marshall": "Yes! Marshall is covered. Near the train line, good for station pickup and highway transition."
    };

    function checkSuburb() {
        const query = suburbInput.value.trim().toLowerCase();
        
        if (!query) {
            suburbResult.textContent = "Please enter a suburb name.";
            suburbResult.className = "suburb-result error";
            return;
        }

        if (coveredSuburbs[query]) {
            suburbResult.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${coveredSuburbs[query]}`;
            suburbResult.className = "suburb-result success";
        } else {
            suburbResult.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> We don't cover "${suburbInput.value}" directly yet. Please drop us a line below, as we can often arrange pick-ups at train stations (like South Geelong or Waurn Ponds)!`;
            suburbResult.className = "suburb-result error";
        }
    }

    suburbCheckBtn.addEventListener('click', checkSuburb);
    suburbInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkSuburb();
        }
    });


    /* ==========================================================================
       3. Interactive Pricing & Lesson Calculator
       ========================================================================== */
    const hoursSlider = document.getElementById('hours-slider');
    const hoursDisplay = document.getElementById('hours-display');
    const calcTotalPrice = document.getElementById('calc-total-price');
    const calcHourlyRate = document.getElementById('calc-hourly-rate');
    const calcSavings = document.getElementById('calc-savings');
    const calcCheckoutBtn = document.getElementById('calculator-checkout-btn');

    function updateCalculator() {
        const hours = parseInt(hoursSlider.value);
        hoursDisplay.textContent = `${hours} Hour${hours > 1 ? 's' : ''}`;
        
        let rate = 70; // Standard single rate
        
        if (hours >= 20) {
            rate = 62;
        } else if (hours >= 10) {
            rate = 65;
        } else if (hours >= 5) {
            rate = 67;
        }
        
        const total = hours * rate;
        const standardCost = hours * 70;
        const savings = standardCost - total;
        const discountPct = Math.round((savings / standardCost) * 100);

        calcTotalPrice.textContent = total;
        calcHourlyRate.textContent = `Rate: $${rate} / Hr`;
        
        if (savings > 0) {
            calcSavings.textContent = `You Save: $${savings} (${discountPct}% Discount)`;
            calcSavings.style.opacity = 1;
        } else {
            calcSavings.textContent = `Standard Casual Rate`;
            calcSavings.style.opacity = 0.7;
        }
    }

    hoursSlider.addEventListener('input', updateCalculator);
    updateCalculator(); // Initialize on load

    // Connect slider checkout to booking form step 1
    calcCheckoutBtn.addEventListener('click', () => {
        const hours = parseInt(hoursSlider.value);
        let durationVal = 60;
        
        if (hours >= 10) durationVal = 120; // Suggest longer lessons for big packs
        else if (hours >= 5) durationVal = 90;
        
        // Select matching radio button
        const radio = document.querySelector(`input[name="lesson-duration"][value="${durationVal}"]`);
        if (radio) {
            radio.checked = true;
            document.querySelectorAll('.duration-option').forEach(opt => opt.classList.remove('active'));
            radio.closest('.duration-option').classList.add('active');
        }
        
        // Scroll to booking form
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });


    /* ==========================================================================
       4. Learner Dashboard Progress Tracker (Logbook & Skills)
       ========================================================================== */
    // Logbook circle selector
    const addHourBtn = document.getElementById('add-hour-btn');
    const resetHourBtn = document.getElementById('reset-hour-btn');
    const progressCircle = document.getElementById('logbook-progress-circle');
    const logbookPct = document.getElementById('logbook-pct');
    const logbookHoursText = document.querySelector('.logbook-hours');
    
    let hoursLogged = 72;
    const maxHours = 120;
    // Circumference = 2 * PI * r = 2 * Math.PI * 66 = 414.69
    const circumference = 414.69;

    function setLogbookProgress(hours) {
        const percent = Math.min((hours / maxHours) * 100, 100);
        const offset = circumference - (percent / 100) * circumference;
        
        progressCircle.style.strokeDashoffset = offset;
        logbookPct.textContent = `${Math.round(percent)}%`;
        logbookHoursText.innerHTML = `<strong>${hours}</strong> / ${maxHours} Total Hours`;
    }

    addHourBtn.addEventListener('click', () => {
        if (hoursLogged < maxHours) {
            hoursLogged += 2; // Increments by 2 hours (standard lesson structure)
            if (hoursLogged > maxHours) hoursLogged = maxHours;
            setLogbookProgress(hoursLogged);
        }
    });

    resetHourBtn.addEventListener('click', () => {
        hoursLogged = 72; // Reset back to default starting demo value
        setLogbookProgress(hoursLogged);
    });

    setLogbookProgress(hoursLogged); // Init

    // Skills Checklist Competency
    const skillCheckboxes = [
        document.getElementById('skill-cockpit'),
        document.getElementById('skill-steering'),
        document.getElementById('skill-roundabout'),
        document.getElementById('skill-parking'),
        document.getElementById('skill-merges'),
        document.getElementById('skill-3point')
    ];
    const skillsProgressText = document.getElementById('skills-progress-text');
    const skillsProgressBar = document.getElementById('skills-progress-bar');

    function calculateSkillsProgress() {
        const totalSkills = skillCheckboxes.length;
        const checkedSkills = skillCheckboxes.filter(cb => cb.checked).length;
        const percent = Math.round((checkedSkills / totalSkills) * 100);
        
        skillsProgressText.textContent = `${percent}%`;
        skillsProgressBar.style.width = `${percent}%`;
    }

    skillCheckboxes.forEach(cb => {
        cb.addEventListener('change', calculateSkillsProgress);
    });

    calculateSkillsProgress(); // Init


    /* ==========================================================================
       5. Interactive Learner Mock Quiz
       ========================================================================== */
    const quizQuestions = [
        {
            question: "When entering a multi-lane roundabout in Geelong (e.g. Wilsons Road), which signal must you give if turning right?",
            options: [
                "Signal right on entry, and signal left immediately before exiting.",
                "Do not signal on entry, signal right just before exiting.",
                "Signal left on entry, and signal right just before exiting.",
                "No signals are required for automatic vehicles in roundabouts."
            ],
            correct: 0,
            explanation: "Correct! In Victoria, when turning right at a multi-lane roundabout, you must signal right on approach, maintain the signal inside, and then signal left just prior to exiting."
        },
        {
            question: "What is the default speed limit in built-up/residential areas in Geelong when there are no speed limit signs?",
            options: [
                "40 km/h",
                "50 km/h",
                "60 km/h",
                "80 km/h"
            ],
            correct: 1,
            explanation: "Correct! The default speed limit in built-up areas throughout Victoria is 50 km/h unless signs indicate otherwise."
        },
        {
            question: "When merging onto a high-speed arterial road like Latrobe Terrace, what should a learner driver do?",
            options: [
                "Stop at the end of the slip lane and wait for a gap.",
                "Merge at a low speed (30 km/h) to remain safe.",
                "Accelerate in the slip lane to match the speed of the highway traffic before merging.",
                "Sound your horn to warn highway traffic to yield."
            ],
            correct: 2,
            explanation: "Correct! You should utilize the length of the slip lane to accelerate and match the speed of traffic (often 70-80 km/h on Latrobe Terrace) to execute a smooth, safe merge."
        },
        {
            question: "What is the rule regarding hand-held mobile phone use while driving for L and P plate drivers in Victoria?",
            options: [
                "Only allowed when using hands-free Bluetooth systems.",
                "Allowed only when stopped at red traffic lights.",
                "Completely prohibited. L and P plate drivers cannot use phones for any function (including GPS/maps) while driving.",
                "Allowed for voice calls only."
            ],
            correct: 2,
            explanation: "Correct! Learner and probationary drivers are strictly prohibited from using mobile phones in any capacity while driving, including hands-free Bluetooth, GPS navigation, and music playback."
        },
        {
            question: "You are driving near a school zone on a weekday. What speed limit applies during designated school hours?",
            options: [
                "50 km/h",
                "40 km/h",
                "30 km/h",
                "School zones do not apply to automatic vehicles."
            ],
            correct: 1,
            explanation: "Correct! School zones in Victoria enforce a strict 40 km/h speed limit during school hours (typically 8:00-9:30 AM and 2:30-4:00 PM) on school days."
        }
    ];

    let currentQuizIndex = 0;
    let quizScore = 0;

    const quizQNum = document.getElementById('quiz-qnum');
    const quizQText = document.getElementById('quiz-qtext');
    const quizOptionsList = document.getElementById('quiz-options-list');
    const quizProgress = document.getElementById('quiz-progress');
    const quizExplanation = document.getElementById('quiz-explanation');
    const quizNextBtn = document.getElementById('quiz-next-btn');
    const quizContainer = document.getElementById('quiz-container');
    const quizResultBox = document.getElementById('quiz-result-box');
    const quizScoreDisplay = document.getElementById('quiz-score');
    const quizFeedbackMsg = document.getElementById('quiz-feedback-msg');
    const quizRestartBtn = document.getElementById('quiz-restart-btn');

    function loadQuizQuestion() {
        quizExplanation.classList.add('hidden');
        quizNextBtn.classList.add('hidden');
        quizExplanation.textContent = "";

        const q = quizQuestions[currentQuizIndex];
        quizQNum.textContent = `Question ${currentQuizIndex + 1} of ${quizQuestions.length}`;
        quizQText.textContent = q.question;
        
        // Progress bar
        const progressPct = ((currentQuizIndex + 1) / quizQuestions.length) * 100;
        quizProgress.style.width = `${progressPct}%`;

        // Render options
        quizOptionsList.innerHTML = "";
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = "quiz-option";
            btn.innerHTML = opt;
            btn.addEventListener('click', () => selectQuizOption(idx));
            quizOptionsList.appendChild(btn);
        });
    }

    function selectQuizOption(selectedIdx) {
        const q = quizQuestions[currentQuizIndex];
        const optionBtns = quizOptionsList.querySelectorAll('.quiz-option');

        optionBtns.forEach((btn, idx) => {
            btn.classList.add('disabled');
            if (idx === q.correct) {
                btn.classList.add('correct');
            } else if (idx === selectedIdx) {
                btn.classList.add('incorrect');
            }
        });

        if (selectedIdx === q.correct) {
            quizScore++;
        }

        // Show explanation
        quizExplanation.textContent = q.explanation;
        quizExplanation.classList.remove('hidden');
        quizNextBtn.classList.remove('hidden');
    }

    quizNextBtn.addEventListener('click', () => {
        currentQuizIndex++;
        if (currentQuizIndex < quizQuestions.length) {
            loadQuizQuestion();
        } else {
            showQuizResults();
        }
    });

    function showQuizResults() {
        quizContainer.classList.add('hidden');
        quizResultBox.classList.remove('hidden');
        quizScoreDisplay.textContent = `${quizScore} / ${quizQuestions.length}`;

        let feedback = "";
        if (quizScore === quizQuestions.length) {
            feedback = "Excellent! You are ready to ace the VicRoads knowledge test!";
        } else if (quizScore >= 3) {
            feedback = "Good job! A little more study and you'll have a perfect score.";
        } else {
            feedback = "Keep studying! Review the Victorian Road Rules handbook or book a session with PK to clarify these concepts.";
        }
        quizFeedbackMsg.textContent = feedback;
    }

    quizRestartBtn.addEventListener('click', () => {
        currentQuizIndex = 0;
        quizScore = 0;
        quizContainer.classList.remove('hidden');
        quizResultBox.classList.add('hidden');
        loadQuizQuestion();
    });

    loadQuizQuestion(); // Init quiz


    /* ==========================================================================
       6. Booking Wizard Steps & State Management
       ========================================================================== */
    const bookingForm = document.getElementById('booking-form');
    const tabs = [
        document.getElementById('tab-1'),
        document.getElementById('tab-2'),
        document.getElementById('tab-3')
    ];
    const stepIndicators = [
        document.getElementById('wstep-1'),
        document.getElementById('wstep-2'),
        document.getElementById('wstep-3')
    ];
    
    // Buttons
    const btnNext1 = document.getElementById('btn-next-1');
    const btnNext2 = document.getElementById('btn-next-2');
    const btnBack2 = document.getElementById('btn-back-2');
    const btnBack3 = document.getElementById('btn-back-3');
    const bookingSuccessBox = document.getElementById('booking-success-box');
    const bookingResetBtn = document.getElementById('booking-reset-btn');

    // Summary elements
    const summaryDuration = document.getElementById('summary-duration');
    const summaryDateTime = document.getElementById('summary-datetime');
    const summaryPickup = document.getElementById('summary-pickup');
    const summaryPrice = document.getElementById('summary-price');

    // Success elements
    const successStudentName = document.getElementById('success-student-name');
    const successStudentEmail = document.getElementById('success-student-email');
    const receiptDate = document.getElementById('receipt-date');
    const receiptTime = document.getElementById('receipt-time');
    const receiptAddress = document.getElementById('receipt-address');

    let bookingState = {
        duration: 60,
        price: 70,
        date: "",
        time: "",
        suburb: "",
        address: "",
        name: "",
        email: "",
        phone: "",
        payment: "cash"
    };

    // Duration options selection
    const durationOptions = document.querySelectorAll('.duration-option');
    durationOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            durationOptions.forEach(item => item.classList.remove('active'));
            opt.classList.add('active');
            
            const duration = parseInt(opt.getAttribute('data-duration'));
            const radio = opt.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;

            bookingState.duration = duration;
            if (duration === 60) bookingState.price = 70;
            else if (duration === 90) bookingState.price = 105;
            else if (duration === 120) bookingState.price = 135;
        });
    });

    function navigateToStep(stepIdx) {
        // Toggle tabs
        tabs.forEach((tab, idx) => {
            if (idx === stepIdx) tab.classList.add('active');
            else tab.classList.remove('active');
        });
        
        // Toggle indicators
        stepIndicators.forEach((ind, idx) => {
            if (idx <= stepIdx) ind.classList.add('active');
            else ind.classList.remove('active');
        });
    }

    // Tab 1 -> Tab 2
    btnNext1.addEventListener('click', () => {
        navigateToStep(1);
    });

    // Tab 2 -> Tab 1
    btnBack2.addEventListener('click', () => {
        navigateToStep(0);
    });

    // Tab 2 -> Tab 3 (With Validation)
    btnNext2.addEventListener('click', () => {
        const dateInput = document.getElementById('booking-date');
        const timeInput = document.getElementById('booking-time');
        const suburbInputSel = document.getElementById('pickup-suburb');
        const addressInput = document.getElementById('pickup-address');

        if (!dateInput.value || !timeInput.value || !suburbInputSel.value || !addressInput.value) {
            alert("Please fill in all scheduling and address fields before proceeding.");
            return;
        }

        bookingState.date = dateInput.value;
        bookingState.time = timeInput.value;
        bookingState.suburb = suburbInputSel.value;
        bookingState.address = addressInput.value;

        // Compile Summary Receipt in Step 3
        summaryDuration.textContent = `${bookingState.duration} Mins (Automatic)`;
        
        // Format Date to friendly string
        const d = new Date(bookingState.date);
        const dateStr = d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
        summaryDateTime.textContent = `${dateStr} @ ${bookingState.time}`;
        
        summaryPickup.textContent = `${bookingState.address}, ${bookingState.suburb}`;
        summaryPrice.textContent = `$${bookingState.price} AUD`;

        navigateToStep(2);
    });

    // Tab 3 -> Tab 2
    btnBack3.addEventListener('click', () => {
        navigateToStep(1);
    });

    // Final Submission
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        bookingState.name = document.getElementById('student-name').value;
        bookingState.email = document.getElementById('student-email').value;
        bookingState.phone = document.getElementById('student-phone').value;
        bookingState.payment = document.getElementById('payment-method').value;

        // Populate Success details
        successStudentName.textContent = bookingState.name;
        successStudentEmail.textContent = bookingState.email;
        
        const d = new Date(bookingState.date);
        receiptDate.textContent = d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        receiptTime.textContent = bookingState.time;
        receiptAddress.textContent = `${bookingState.address}, ${bookingState.suburb}`;

        // Show Success
        bookingForm.classList.add('hidden');
        bookingSuccessBox.classList.remove('hidden');
    });

    // Reset Booking Wizard
    bookingResetBtn.addEventListener('click', () => {
        bookingForm.reset();
        bookingState = {
            duration: 60,
            price: 70,
            date: "",
            time: "",
            suburb: "",
            address: "",
            name: "",
            email: "",
            phone: "",
            payment: "cash"
        };
        
        // Reset radio defaults
        const opt60 = document.querySelector('.duration-option[data-duration="60"]');
        durationOptions.forEach(opt => opt.classList.remove('active'));
        opt60.classList.add('active');

        bookingForm.classList.remove('hidden');
        bookingSuccessBox.classList.add('hidden');
        navigateToStep(0);
    });


    /* ==========================================================================
       7. FAQs Accordion Trigger
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const answer = item.querySelector('.faq-answer');

        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-answer').style.display = 'none';
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                answer.style.display = 'block';
            }
        });
    });


    /* ==========================================================================
       8. Intersection Observer for Scroll Animations
       ========================================================================== */
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Unobserve once animation is run
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        observer.observe(el);
    });

});
