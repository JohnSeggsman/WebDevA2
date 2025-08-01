// Main Page JavaScripts | To get all the HTML elements needed for this whole thing
const bodySprite = document.querySelector("#bodySprite");
const defaultBg = document.querySelector("#defaultBg");
const mobileMenuBtn = document.querySelector("#mobileMenuBtn");
const mobileMenu = document.querySelector("#mobileMenu");
const hoverDescription = document.querySelector("#hoverDescription");
const descriptionTitle = document.querySelector("#descriptionTitle");
const descriptionText = document.querySelector("#descriptionText");
const gradientHeader = document.querySelector('.gradient-header');
const contentArea = document.querySelector('.content-area');
const systemContentContainer = document.querySelector('.system-content-container');
const headerContent = document.querySelector('.header-content');
const qrCode = document.querySelector('.qr-code');

// Audio Variables | Sound effects for button clicks and other interactions
const buttonClick1 = new Audio("audio/buttonClick_1.mp3");
const buttonClick2 = new Audio("audio/buttonClick_2.mp3");
const successSFX1 = new Audio("audio/successSFX_1.mp3");
const failureSFX1 = new Audio("audio/failureSFX_1.mp3");
const failureSFX2 = new Audio("audio/failureSFX_2.mp3");
const heartBeatSFX = new Audio("audio/heartBeatSFX.mp3");

// Prevent zooming with more than one finger
document.addEventListener('touchstart', function (e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// Prevent continious pinch zooming during movement
document.addEventListener('touchmove', function (e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// Prevent pinch zooming with gestures
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
}, { passive: false });

// Prevent double-tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', function (e) {
    let now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Human Body system using arrays storing the title and description texts
const systemNames = ["respiratory", "muscular", "digestive", "circulatory", "nervous"];
const systemDescriptions = [
    { title: "RESPIRATORY SYSTEM", text: "Learn how your lungs work to bring oxygen into your body and remove carbon dioxide through breathing." },
    { title: "MUSCULAR SYSTEM", text: "Explore how over 600 muscles work together to create movement and maintain your posture." },
    { title: "DIGESTIVE SYSTEM", text: "Understand how your body breaks down food and absorbs nutrients to fuel your cells." },
    { title: "CIRCULATORY SYSTEM", text: "See how your heart pumps blood to deliver oxygen and nutrients throughout your entire body." },
    { title: "NERVOUS SYSTEM", text: "Learn how your brain and nerves control everything from thoughts to reflexes." }
];

// Get all of the buttons and pages using for loops
const desktopButtons = [];
const mobileButtons = [];
const backgroundImages = [];
const pages = [document.querySelector("#home")];

for (let i = 0; i < systemNames.length; i++) {
    const name = systemNames[i];
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    desktopButtons.push(document.querySelector("#" + name + "Btn"));
    mobileButtons.push(document.querySelector("#mobile" + capitalizedName + "Btn"));
    pages.push(document.querySelector("#" + name + "-content"));
    backgroundImages.push(document.querySelector("#" + name + "Bg"));
}

// Update body sprite to preview the different systems
function updateSprite(className) {
    bodySprite.className = "body-sprite " + className;
}

// Toggle the background images between various systems or the default background
function toggleBackground(index, show) {
    if (show) {
        defaultBg.classList.remove("show");
        backgroundImages[index].classList.add("show");
    } else {
        backgroundImages[index].classList.remove("show");
        defaultBg.classList.add("show");
    }
}

// Toggle text visibility, and update text depending on selected systems
function toggleDescription(index, show) {
    if (show) {
        descriptionTitle.textContent = systemDescriptions[index].title;
        descriptionText.textContent = systemDescriptions[index].text;
        hoverDescription.classList.add('show');
    } else {
        hoverDescription.classList.remove('show');
    }
}

// Removes the "active" class from all desktop and mobile buttons
function clearActiveButtons() {
    for (let i = 0; i < desktopButtons.length; i++) {
        desktopButtons[i].classList.remove("active");
        mobileButtons[i].classList.remove("active");
    }
}

// Return the header to full size when going back to the default page
function restoreHeader() {
    gradientHeader.classList.remove('minimized');
    contentArea.classList.remove('expanded');
    systemContentContainer.classList.remove('expanded');
    headerContent.classList.remove('minimized');
}

// Shrinks the header when viewing a system page
function minimizeHeader() {
    gradientHeader.classList.add('minimized');
    contentArea.classList.add('expanded');
    systemContentContainer.classList.add('expanded');
    headerContent.classList.add('minimized');
}

// Displays a specific system page and hides the others with various animation effects
// Minimize header, hide default page, show specific system page and activate the selected button
function showContent(pageIndex) {
    const selectedContentPage = pages[pageIndex + 1];

    clearActiveButtons();
    minimizeHeader();

    // Hide the QR code when showing any system page
    if (qrCode) {
        qrCode.style.display = 'none';
    }

    if (pages[0].style.display !== "none") {
        pages[0].style.display = "none";
        bodySprite.classList.add('hidden');
    }

    // Hide current active content page
    let currentlyActive = null;
    for (let i = 1; i < pages.length; i++) {
        if (pages[i].classList.contains('active')) {
            currentlyActive = pages[i];
            break;
        }
    }

    if (currentlyActive && currentlyActive !== selectedContentPage) {
        currentlyActive.classList.remove('active');
        setTimeout(function () {
            currentlyActive.style.display = 'none';
        }, 650);
    }

    // Show selected content page
    selectedContentPage.style.display = 'block';
    setTimeout(function () {
        selectedContentPage.classList.add('active');
    }, 50);

    desktopButtons[pageIndex].classList.add("active");
    mobileButtons[pageIndex].classList.add("active");
    mobileMenu.classList.remove("show");
}

// Switches back to the default page from the system page
// Restores the header, hide all system page, show default page and clear all active buttons
function showDefault() {
    restoreHeader();

    // Only show the QR code on the desktop layout
    if (qrCode) {
        if (window.innerWidth > 799) {
            qrCode.style.display = 'block'; // Show on desktop layout
        } else {
            qrCode.style.display = 'none'; // Hide on mobile layout
        }
    }

    for (let i = 1; i < pages.length; i++) {
        pages[i].classList.remove('active');
        pages[i].style.display = 'none';
    }

    clearActiveButtons();
    pages[0].style.display = "block";
    bodySprite.classList.remove('hidden');
    mobileMenu.classList.remove("show");
}

// Initialize home page
pages[0].style.display = "block";

// Setup event listeners for all systems
for (let i = 0; i < systemNames.length; i++) {
    const desktopBtn = desktopButtons[i];
    const mobileBtn = mobileButtons[i];
    const spriteClass = "sprite-" + systemNames[i];
    const handlers = Validator_Hack_Fix_Number1(i, spriteClass);
    const touchHandlers = handlers.createTouchHandlers();

    // Adding EventListeners
    desktopBtn.addEventListener("mouseenter", handlers.handleMouseEnter);
    desktopBtn.addEventListener("mouseleave", handlers.handleMouseLeave);
    mobileBtn.addEventListener("touchstart", touchHandlers.handleTouchStart);
    mobileBtn.addEventListener("touchend", touchHandlers.handleTouchEnd);
    mobileBtn.addEventListener("touchcancel", touchHandlers.handleTouchEnd);
    desktopBtn.addEventListener("click", handlers.handleClick);
    mobileBtn.addEventListener("click", handlers.handleClick);
}

// JS validator kept complaining and it took me a few hours to come to a colusion that
// the validator is stupid and overly cautious. THE CODE WORKS PERFECTLY FINE YOU IDIOT.
function Validator_Hack_Fix_Number1(currentIndex, currentSprite) {
    return {
        // Handling mouse hovers (enter/leave)
        handleMouseEnter: function () {
            updateSprite(currentSprite);
            toggleBackground(currentIndex, true);
            toggleDescription(currentIndex, true);
        },
        handleMouseLeave: function () {
            updateSprite("sprite-default");
            toggleBackground(currentIndex, false);
            toggleDescription(currentIndex, false);
        },

        // Handle button clicks
        handleClick: function () {
            showContent(currentIndex);
            buttonClick1.currentTime = 0;
            buttonClick1.play();
        },

        // Create touch handlers for mobile layout
        createTouchHandlers: function () {
            let touchTimer;
            let isLongPress = false;

            return {
                handleTouchStart: function () {
                    isLongPress = false;
                    touchTimer = setTimeout(function () {
                        isLongPress = true;
                        updateSprite(currentSprite);
                        toggleBackground(currentIndex, true);
                        toggleDescription(currentIndex, true);
                    }, 300);
                },
                handleTouchEnd: function () {
                    clearTimeout(touchTimer);
                    if (isLongPress) {
                        updateSprite("sprite-default");
                        toggleBackground(currentIndex, false);
                        toggleDescription(currentIndex, false);
                    }
                    isLongPress = false;
                }
            };
        }
    };
}

// Mobile menu toggle to show and hide navigation buttons
mobileMenuBtn.addEventListener("click", function () {
    if (mobileMenu.classList.contains("show")) {
        mobileMenu.classList.remove("show");
    } else {
        mobileMenu.classList.add("show");
    }
});

// Close the mobile menu when clicking outside
document.addEventListener("click", function (e) {
    if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove("show");
    }
});

// Clicking the header returns back to the default page
gradientHeader.addEventListener('click', function () {
    if (gradientHeader.classList.contains('minimized')) {
        buttonClick2.currentTime = 0;
        buttonClick2.play();
    }
    showDefault();
});

// Dynamically updates the page window by constantly resizing accordingly
let resizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {

        // Just in case, might as well check to make sure QR code doesn't appear on mobile
        if (qrCode && pages[0].style.display !== "none") {
            if (window.innerWidth > 799) {
                qrCode.style.display = 'block'; // Show on desktop layout
            } else {
                qrCode.style.display = 'none'; // Hide on mobile layout
            }
        }
    }, 100);
});

/* ---------- */
// Respiratory System Mini-Game JavaScripts
let respiratoryGameActive = false, respiratoryScore = 0, respiratoryNextId = 0, respiratoryMolecules = [];
let respiratoryGreenZonePos = 200, respiratoryGreenZoneWidth = 80;
let respiratoryGameInterval, respiratoryZoneTimer, respiratorySpawnTimer;

const respiratoryTrack = document.querySelector('.respiratory-game-area');
const respiratoryZone = document.getElementById('greenZone');
const respiratoryBtn = document.getElementById('exchangeBtn');
const respiratoryScoreDis = document.getElementById('scoreDisplay');
const respiratoryMobile = window.innerWidth <= 799;
const respiratoryTrackWidth = respiratoryMobile ? window.innerWidth - 40 : 600;

// Start Respiratory Mini-Game
function startRespiratory() {
    respiratoryGameActive = true;
    respiratoryScore = 0;
    respiratoryMolecules = [];
    respiratoryNextId = 0;

    // Remove existing molecules (UPDATE: changed from replaceChildren, that shit broke something)
    // Just find anything that is named gas-molecule and delete all of it instead
    const existingMolecules = document.querySelectorAll('.gas-molecule');
    for (let i = 0; i < existingMolecules.length; i++) {
        existingMolecules[i].remove();
    }

    // Reset the UI elements as if the user started a new game
    respiratoryBtn.textContent = 'EXCHANGE';
    respiratoryBtn.classList.remove('game-over');
    respiratoryScoreDis.textContent = 'Successful Exchange: 0';

    // Spawn the first molecule and reposition the green zone somewhere else
    respiratoryMolecules.push(createRespiratoryMolecule());
    changeRespiratoryZone();

    // Clear existing timers
    clearInterval(respiratoryGameInterval);
    clearInterval(respiratoryZoneTimer);
    clearInterval(respiratorySpawnTimer);
    clearTimeout(respiratorySpawnTimer);

    // Start all the timers
    respiratoryGameInterval = setInterval(updateRespiratory, 16);
    respiratoryZoneTimer = setInterval(changeRespiratoryZone, Math.random() * 5000 + 5000);
    spawnRespiratoryMolecule();
}

// Mini-Game update loop
function updateRespiratory() {
    if (!respiratoryGameActive) return;

    // Update molecule positions (towards the right)
    for (let i = respiratoryMolecules.length - 1; i >= 0; i--) {
        const molecule = respiratoryMolecules[i];
        molecule.pos += respiratoryMobile ? 2.5 : 4;
        molecule.el.style.left = molecule.pos + 'px';

        // Remove molecules that went off screen (Remove from DOM & Array)
        if (molecule.pos > respiratoryTrackWidth + 50) {
            molecule.el.remove();
            respiratoryMolecules.splice(i, 1);
        }
    }

    // Check for game over condition
    for (let i = 0; i < respiratoryMolecules.length; i++) {
        const molecule = respiratoryMolecules[i];
        if (!molecule.isO2 && molecule.pos > respiratoryTrackWidth) {
            respiratoryGameOver();
            return;
        }
    }
}

// Spawn CO2 molecule at the most left of the game area
function createRespiratoryMolecule(isO2 = false) {
    const molecule = {
        id: respiratoryNextId++,
        pos: -50,
        isO2: isO2,
        el: document.createElement('div')
    };

    // Setting up the molecule visuals and position the molecule at the starting place
    molecule.el.className = 'gas-molecule';
    molecule.el.id = 'molecule-' + molecule.id;

    if (isO2) {
        molecule.el.className += ' oxygen';
    }

    molecule.el.style.left = molecule.pos + 'px';
    respiratoryTrack.appendChild(molecule.el);

    return molecule;
}

// Auto spawn function for the CO2 molecule
function spawnRespiratoryMolecule() {
    if (!respiratoryGameActive) return;

    // UPDATE AS NEEDED LATER (Current Delay: 0.25s to 1.5s)
    const spawnDelay = Math.random() * 1250 + 250;
    respiratorySpawnTimer = setTimeout(function () {
        if (respiratoryGameActive) {
            respiratoryMolecules.push(createRespiratoryMolecule());
            spawnRespiratoryMolecule();
        }
    }, spawnDelay);
}

// Handle exchange of gases (from CO2 to O2)
function exchangeRespiratoryGas() {
    if (!respiratoryGameActive) {
        startRespiratory();
        return;
    }

    // Find all CO2 molecules currently in the green zone
    const moleculesInZone = [];
    for (let i = 0; i < respiratoryMolecules.length; i++) {
        const molecule = respiratoryMolecules[i];
        if (!molecule.isO2) {
            const center = molecule.pos + 20;
            if (center >= respiratoryGreenZonePos && center <= respiratoryGreenZonePos + respiratoryGreenZoneWidth) {
                moleculesInZone.push(molecule);
            }
        }
    }

    // Convert all CO2 in the green zone to O2
    if (moleculesInZone.length > 0) {
        for (let i = 0; i < moleculesInZone.length; i++) {
            const molecule = moleculesInZone[i];
            molecule.isO2 = true;
            molecule.el.classList.add('oxygen');
            successSFX1.currentTime = 0;
            successSFX1.play();
        }

        respiratoryScore += moleculesInZone.length;
        respiratoryScoreDis.textContent = 'Successful Exchange: ' + respiratoryScore;
    }
    else {
        // If you fail to hit it at the green zone, game is over
        respiratoryGameOver();
    }
}

// Change green zone position
function changeRespiratoryZone() {
    if (!respiratoryGameActive) return;

    // Find leftmost CO2 molecule
    let leftmost = -50;
    for (let i = 0; i < respiratoryMolecules.length; i++) {
        const molecule = respiratoryMolecules[i];
        if (!molecule.isO2 && molecule.pos > leftmost) {
            leftmost = molecule.pos;
        }
    }

    // Calculate valid green zone position to ensure possible zone location
    const maxPos = respiratoryTrackWidth - respiratoryGreenZoneWidth - 50;
    const minPos = Math.max(leftmost + 80, 80);

    // Reposition the green zone within a valid range
    if (minPos < maxPos) {
        respiratoryGreenZonePos = Math.random() * (maxPos - minPos) + minPos;
    } else {
        respiratoryGreenZonePos = maxPos / 2;
    }

    respiratoryZone.style.left = respiratoryGreenZonePos + 'px';
    respiratoryZone.style.width = respiratoryGreenZoneWidth + 'px';
}

// Game Over Function
function respiratoryGameOver() {
    respiratoryGameActive = false;
    failureSFX1.currentTime = 0;
    failureSFX1.play();

    clearInterval(respiratoryGameInterval);
    clearInterval(respiratoryZoneTimer);
    clearInterval(respiratorySpawnTimer);
    clearTimeout(respiratorySpawnTimer);

    respiratoryBtn.textContent = 'PLAY AGAIN';
    respiratoryBtn.classList.add('game-over');
    respiratoryScoreDis.textContent = 'Game Over! Exchange Done: ' + respiratoryScore;
}

// Event Listeners
respiratoryBtn.addEventListener('click', exchangeRespiratoryGas);

/* ---------- */
// Muscular System Mini-Game JavaScripts
let muscularScore = 0, muscularCurrentQtn = 0;
let muscularAnswered = false, muscularQuizQuestions = [];

const muscularQuestion = document.getElementById('muscularQuestion');
const muscularAnswers = document.getElementById('muscularAnswers');
const muscularNextBtn = document.getElementById('muscularNextBtn');
const muscularRestartBtn = document.getElementById('muscularRestartBtn');
const muscularCurrentNum = document.getElementById('muscularCurrentQtn');
const muscularTotalNum = document.getElementById('muscularTotalQtn');
const muscularScoreBox = document.getElementById('muscularScoreDisplay');
const muscularFinalScore = document.getElementById('muscularFinalScore');
const muscularQuestionHeader = document.getElementById('muscularQuestionHeader');

// Lists of questions using an array, storing question, possible answers, and the actual answer
const muscularQuestions = [
    { question: "What are the protein filaments involved in muscle contraction?", answers: ["Actin and myosin", "Collagen and elastin", "Keratin and fibrin", "Albumin and globulin"], correct: 0 },
    { question: "How many muscles are in the human body?", answers: ["Over 600", "Over 400", "Over 800", "Over 1000"], correct: 0 },
    { question: "What connects muscles to bones?", answers: ["Tendons", "Ligaments", "Cartilage", "Joints"], correct: 0 },
    { question: "Which muscles help pump blood back to the heart?", answers: ["Leg muscles", "Arm muscles", "Chest muscles", "Back muscles"], correct: 0 },
    { question: "What are the two main types of muscle fibers?", answers: ["Slow-twitch and fast-twitch", "Red and white", "Strong and weak", "Long and short"], correct: 0 },
    { question: "Which muscle fibers are best for endurance activities?", answers: ["Fast-twitch fibers", "Slow-twitch fibers", "Mixed fibers", "Power fibers"], correct: 1 },
    { question: "Which muscle fibers provide explosive power?", answers: ["Slow-twitch fibers", "Fast-twitch fibers", "Endurance fibers", "Cardiac fibers"], correct: 1 },
    { question: "What is the main function of the muscular system?", answers: ["Digestion", "Movement", "Breathing", "Circulation"], correct: 1 },
    { question: "Which muscle group controls pushing movements?", answers: ["Back muscles", "Chest muscles", "Leg muscles", "Arm muscles"], correct: 1 },
    { question: "Which muscles are responsible for pulling movements?", answers: ["Chest muscles", "Back muscles", "Shoulder muscles", "Core muscles"], correct: 1 },
    { question: "What is the scientific name for chest muscles?", answers: ["Deltoids", "Latissimus dorsi", "Pectorals", "Quadriceps"], correct: 2 },
    { question: "Which muscles help maintain posture?", answers: ["Only leg muscles", "Only back muscles", "All muscles work together", "Only arm muscles"], correct: 2 },
    { question: "Which muscles protect internal organs?", answers: ["Arm muscles", "Leg muscles", "Abdominal muscles", "Neck muscles"], correct: 2 },
    { question: "Which muscles stabilize the spine?", answers: ["Arm muscles", "Leg muscles", "Core muscles", "Neck muscles"], correct: 2 },
    { question: "What do muscles produce to help regulate body temperature?", answers: ["Oxygen", "Carbon dioxide", "Heat", "Water"], correct: 2 },
    { question: "What are the shoulder muscles called?", answers: ["Pectorals", "Biceps", "Triceps", "Deltoids"], correct: 3 },
    { question: "Which muscles straighten the elbow?", answers: ["Biceps", "Deltoids", "Forearms", "Triceps"], correct: 3 },
    { question: "What initiates muscle contraction?", answers: ["Heart signals", "Lung signals", "Stomach signals", "Brain signals"], correct: 3 },
    { question: "What happens when a muscle contracts?", answers: ["It gets longer", "It stays the same", "It disappears", "It gets shorter"], correct: 3 },
    { question: "What are the front thigh muscles called?", answers: ["Hamstrings", "Calves", "Glutes", "Quadriceps"], correct: 3 }
];

// Lists of completion text using an array, all giving words of encouragement or acknowleding accomplishments
const completionMessages = [
    "Don't worry, Learning takes time! Review the content above and try again!",
    "Good start! You're beginning to understand. Keep studying and you'll improve quickly!",
    "Nice progress! You're getting the hang of it. A bit more practice and you'll master it!",
    "Well done! You have a solid understanding! Just a few more details to learn!",
    "Excellent work! You really know your stuff! Almost perfect, keep it up!",
    "Outstanding! Perfect score! You've mastered the subject like a true expert!"
];

// Start Muscular Mini-Game
function startMuscular() {
    // Pick 5 random questions from the list in 'muscularQuestions'
    muscularQuizQuestions = muscularQuestions.sort(function () {
        return Math.random() - 0.5;
    }).slice(0, 5);

    // Reset everything and update the display, then start the quiz
    muscularCurrentQtn = 0;
    muscularScore = 0;
    muscularAnswered = false;
    muscularTotalNum.textContent = '5';
    muscularScoreBox.style.display = 'none';
    muscularRestartBtn.style.display = 'none';
    muscularNextBtn.style.display = 'inline-block';
    showMuscularQuestion();
}

// Displays the current question
function showMuscularQuestion() {
    const currentQuestion = muscularQuizQuestions[muscularCurrentQtn];
    const questionNumber = muscularCurrentQtn + 1;

    // Update the question display
    muscularQuestionHeader.textContent = 'Question ' + questionNumber;
    muscularQuestion.textContent = currentQuestion.question;
    muscularCurrentNum.textContent = questionNumber;
    muscularAnswers.innerHTML = '';
    muscularAnswered = false;
    muscularNextBtn.disabled = true;

    // Create radio button options for the quiz
    for (let i = 0; i < currentQuestion.answers.length; i++) {
        // Create radio input element
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'muscularAnswer';
        radioInput.value = i;
        radioInput.id = 'muscularAnswer-' + i;

        // Create label for the radio button
        const label = document.createElement('label');
        label.htmlFor = 'muscularAnswer-' + i;
        label.textContent = currentQuestion.answers[i];

        // Create container div to hold everything
        const container = document.createElement('div');
        container.className = 'muscular-radio-option';
        container.appendChild(radioInput);
        container.appendChild(label);

        // Create event handlers & whatever else to add below
        const handlers = Validator_Hack_Fix_Number2(i, container, radioInput);
        container.onclick = handlers.handleContainerClick;
        radioInput.addEventListener('change', handlers.handleRadioChange);
        muscularAnswers.appendChild(container);
    }
}

// Function to handle user input, determine if answer is correct or wrong
function selectMuscularAnswer(answerIndex, clickedContainer) {
    if (muscularAnswered) return;

    muscularAnswered = true;
    const correctIndex = muscularQuizQuestions[muscularCurrentQtn].correct;
    const isCorrect = answerIndex === correctIndex;

    // Mark the clicked answer to compare
    clickedContainer.classList.add('selected');

    setTimeout(function () {
        const allContainers = muscularAnswers.querySelectorAll('.muscular-radio-option');  // ✅ Correct

        if (isCorrect) { // If the user answered correctly
            clickedContainer.classList.add('correct');
            muscularScore++;
            successSFX1.currentTime = 0;
            successSFX1.play();
        } else { // If the user answered wrongly, show correct answer as well
            clickedContainer.classList.add('incorrect');
            allContainers[correctIndex].classList.add('highlight-correct');
            failureSFX2.currentTime = 0;
            failureSFX2.play();
        }

        // Disable all the containers and enable button to go to the next question
        for (let i = 0; i < allContainers.length; i++) {
            allContainers[i].style.pointerEvents = 'none';
        }
        muscularNextBtn.disabled = false;
    }, 300);
}

// Check if we need to go to next the question or finish the quiz
function nextMuscularQuestion() {
    if (++muscularCurrentQtn >= muscularQuizQuestions.length) {
        finishMuscularQuiz();
    } else {
        showMuscularQuestion();
    }
}

// Show the final results (the score) for the quiz and some words from a list above
function finishMuscularQuiz() {
    muscularQuestionHeader.textContent = "Quiz Complete!";
    muscularQuestion.textContent = completionMessages[muscularScore] || "Great job completing the muscular system quiz!";
    muscularAnswers.innerHTML = '';
    muscularNextBtn.style.display = 'none';
    muscularRestartBtn.style.display = 'inline-block';
    muscularScoreBox.style.display = 'block';
    muscularFinalScore.textContent = muscularScore;
}

// Same stupid validator issue as above. Here to stop the validator from complaining.
// I didn't need this. The code worked perfectly fine, it's only here because the validator
// wouldn't shut up and complain about some "closure in loop" or whatever nonsense.
function Validator_Hack_Fix_Number2(answerIndex, container, radioInput) {
    return {
        // Allow the user to click on anywhere, including the radio button
        handleContainerClick: function () {
            if (!muscularAnswered) {
                radioInput.checked = true;
                selectMuscularAnswer(answerIndex, container);
            }
        },

        // Radio button interaction
        handleRadioChange: function () {
            if (!muscularAnswered && radioInput.checked) {
                selectMuscularAnswer(answerIndex, container);
            }
        }
    };
}

// Event Listeners
muscularNextBtn.addEventListener('click', nextMuscularQuestion);
muscularRestartBtn.addEventListener('click', startMuscular);

// Start the quiz when page loads
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        if (document.getElementById('muscular-content')) {
            startMuscular();
        }
    }, 100);
});

/* ---------- */
// Digestive System Calculator JavaScripts
const digestiveGenderSelect = document.getElementById('userGender');
const digestiveAgeInput = document.getElementById('userAge');
const digestiveHeightInput = document.getElementById('userHeight');
const digestiveWeightInput = document.getElementById('userWeight');
const digestiveCalculateBtn = document.getElementById('calculateBtn');
const digestiveResultsSection = document.getElementById('resultsSection');
const digestiveResultsGrid = document.getElementById('resultsGrid');

// Calculate BMI from weight and height
function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return Math.round(bmi * 10) / 10;
}

// Get the BMI category and class
function getBMICategory(bmi) {
    if (bmi < 18.5) return { category: 'Underweight', class: 'bmi-underweight' };
    if (bmi < 25) return { category: 'Normal Weight', class: 'bmi-normal' };
    if (bmi < 30) return { category: 'Overweight', class: 'bmi-overweight' };
    return { category: 'Obese', class: 'bmi-obese' };
}

// Calculate body fat percentage using a BMI formula I found online somewhere on google
function calculateBodyFat(gender, age, bmi) {
    const multiplier = gender === 'male' ? -16.2 : -5.4;
    const bodyFat = (1.20 * bmi) + (0.23 * age) + multiplier;
    return Math.max(0, Math.round(bodyFat * 10) / 10);
}

// Get the body fat category and CSS class
function getBodyFatCategory(bodyFat, gender) {
    if (gender === 'male') {
        if (bodyFat < 6) return { category: 'Very Low', class: 'bodyfat-low' };
        if (bodyFat < 18) return { category: 'Normal', class: 'bodyfat-normal' };
        if (bodyFat < 25) return { category: 'High', class: 'bodyfat-high' };
        return { category: 'Very High', class: 'bodyfat-very-high' };
    } else {
        if (bodyFat < 16) return { category: 'Low', class: 'bodyfat-low' };
        if (bodyFat < 25) return { category: 'Normal', class: 'bodyfat-normal' };
        if (bodyFat < 32) return { category: 'High', class: 'bodyfat-high' };
        return { category: 'Very High', class: 'bodyfat-very-high' };
    }
}

// Validate all input fields and ensure everything has been correctly filled
function validateInputs() {
    const age = parseInt(digestiveAgeInput.value);
    const height = parseInt(digestiveHeightInput.value);
    const weight = parseInt(digestiveWeightInput.value);

    if (!age || !height || !weight) {
        alert('Please fill in all fields with valid numbers!');
        return false;
    }
    if (age < 16 || age > 100) {
        alert('Please enter an age between 16 and 100 years!');
        return false;
    }
    if (height < 120 || height > 260) {
        alert('Please enter a height between 120 and 260 cm!');
        return false;
    }
    if (weight < 25 || weight > 320) {
        alert('Please enter a weight between 25 and 320 kg!');
        return false;
    }
    return true;
}

// Create the BMI and Body Fat Percentage result under the BMI input fields
function createResult(title, value, category, cssClass, description) {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'digestive-result-item';
    resultDiv.innerHTML = '<h5>' + title + '</h5>' +
        '<div class="digestive-result-value">' + value + '</div>' +
        '<div class="digestive-result-category ' + cssClass + '">' + category + '</div>' +
        '<div class="digestive-result-description">' + description + '</div>';
    return resultDiv;
}

// Display the calculation results
function displayResults(bmi, bmiInfo, bodyFat, bodyFatInfo) {
    digestiveResultsGrid.innerHTML = '';

    // Create and add BMI div
    const bmiDiv = createResult(
        'Body Mass Index (BMI)',
        bmi,
        bmiInfo.category,
        bmiInfo.class,
        'BMI measures body fat based on height and weight ratios'
    );

    // Create and add body fat div
    const bodyFatDiv = createResult(
        'Estimated Body Fat',
        bodyFat + '%',
        bodyFatInfo.category,
        bodyFatInfo.class,
        'Estimated percentage of body weight that is fat tissue'
    );

    digestiveResultsGrid.appendChild(bmiDiv);
    digestiveResultsGrid.appendChild(bodyFatDiv);
    digestiveResultsSection.style.display = 'block';
}

// Main calculation function
function calculateHealthMetrics() {
    if (!validateInputs()) return;

    // Get the input values
    const gender = digestiveGenderSelect.value;
    const age = parseInt(digestiveAgeInput.value);
    const height = parseInt(digestiveHeightInput.value);
    const weight = parseInt(digestiveWeightInput.value);

    // Calculate results
    const bmi = calculateBMI(weight, height);
    const bmiInfo = getBMICategory(bmi);
    const bodyFat = calculateBodyFat(gender, age, bmi);
    const bodyFatInfo = getBodyFatCategory(bodyFat, gender);

    // Show results
    displayResults(bmi, bmiInfo, bodyFat, bodyFatInfo);
}

// Event Listeners
// UPDATE (JUL 31: STUPID VALIDATOR SHUT UP STOP COMPLAINING YOU IDIOT)
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        if (document.getElementById('digestive-content')) {
            if (digestiveCalculateBtn) {
                digestiveCalculateBtn.addEventListener('click', calculateHealthMetrics);
            }

            if (digestiveAgeInput) {
                digestiveAgeInput.addEventListener('keypress', function (event) {
                    if (event.key === 'Enter') {
                        calculateHealthMetrics();
                    }
                });
            }

            if (digestiveHeightInput) {
                digestiveHeightInput.addEventListener('keypress', function (event) {
                    if (event.key === 'Enter') {
                        calculateHealthMetrics();
                    }
                });
            }

            if (digestiveWeightInput) {
                digestiveWeightInput.addEventListener('keypress', function (event) {
                    if (event.key === 'Enter') {
                        calculateHealthMetrics();
                    }
                });
            }
        }
        // (JUL 31, 2:25 AM)
        // Wow extra lines of code and all for what? Nothing. It worked fine like THE PREVIOUS
        // TWO. But noooooo, you have to complain. And you gave me extra work just for you to
        // shut up. I never want to touch web development in my life ever again.
    }, 100);
});

/* ---------- */
// Circulatory System Mini-Game JavaScripts
let circulatoryTargetBPM = 60, circulatoryClickCount = 0, circulatoryUserClicks = [];
let circulatoryGameStarted = false, circulatoryPulseInterval = null;

const circulatoryHeartIcon = document.getElementById('heartIcon');
const circulatorySetBPMBtn = document.querySelector('.set-bpm-btn');
const circulatoryResetGameBtn = document.getElementById('resetGameBtn');
const circulatoryTargetBPMInput = document.getElementById('targetBPM');
const circulatoryDisplayTargetBPM = document.getElementById('displayTargetBPM');
const circulatoryDisplayActualBPM = document.getElementById('displayActualBPM');
const circulatoryRhythmFeedback = document.getElementById('rhythmFeedback');
const circulatoryPulseCircle = document.getElementById('heartPulseCircle');

// Start the heart pulse animation
function startCirculatoryPulse(bpm) {
    if (circulatoryPulseInterval) {
        clearInterval(circulatoryPulseInterval);
    }

    // Reset and restart the pulse animation
    circulatoryPulseInterval = setInterval(function () {
        if (circulatoryPulseCircle) {
            circulatoryPulseCircle.classList.remove('pulse-animation');
            void circulatoryPulseCircle.offsetHeight;
            circulatoryPulseCircle.classList.add('pulse-animation');
        }
    }, 60000 / bpm);
}

// Set the target BPM for the game
function setCirculatoryBPM() {
    const newBPM = parseInt(circulatoryTargetBPMInput.value);

    if (newBPM < 40 || newBPM > 220) {
        alert("Please enter a BPM between 40 and 220");
        circulatoryTargetBPMInput.value = circulatoryTargetBPM;
        return;
    }

    circulatoryTargetBPM = newBPM;
    circulatoryGameStarted = true;
    circulatoryUserClicks = [];
    circulatoryClickCount = 0;

    circulatoryDisplayTargetBPM.textContent = newBPM;
    circulatoryDisplayActualBPM.textContent = '--';

    startCirculatoryPulse(newBPM);
    updateCirculatoryFeedback("Click the heart in rhythm with the pulse!");
}

// Function to handle user input (when the user clicks on the heart)
// UPDATE 1ST AUG 9:25PM: WE HAVE ENOUGH SPACE FOR A PNG!! LETS GOOOOOO!
function handleCirculatoryClick() {
    if (!circulatoryGameStarted) {
        updateCirculatoryFeedback("Please set a target BPM first to start the game!");
        return;
    }

    // This is needed because we can do "Prev Epoch - Curr Epoch" to get time difference
    circulatoryUserClicks.push(Date.now());
    circulatoryClickCount++;

    // Visual feedback on click
    circulatoryHeartIcon.style.transform = 'scale(0.225)'; // Lower from 1.1
    setTimeout(function () {
        circulatoryHeartIcon.style.transform = 'scale(0.2)'; // Lower from 1.0
    }, 100);

    if (circulatoryClickCount >= 10) {
        calculateCirculatoryBPM();
    } else {
        const remaining = 10 - circulatoryClickCount;
        updateCirculatoryFeedback('Calculating rhythm... Please click ' + remaining + ' more time' + (remaining === 1 ? '' : 's') + '!');
    }

    heartBeatSFX.currentTime = 0;
    heartBeatSFX.play();
}

// Calculate the user's BPM from their clicks
function calculateCirculatoryBPM() {
    // Get the 10 most recent clicks to do some BPM calculations
    const recentClicks = circulatoryUserClicks.slice(-10);

    // Now we calculate the time between clicks for all 10 of them
    let totalTime = 0;
    for (let i = 1; i < recentClicks.length; i++) {
        totalTime += recentClicks[i] - recentClicks[i - 1];
    }

    // Convert all those recent click numbers to BPM
    const userBPM = Math.round(60000 / (totalTime / (recentClicks.length - 1)));

    // Display calculated BPM
    if (userBPM >= 20 && userBPM <= 300) {
        circulatoryDisplayActualBPM.textContent = userBPM;
        giveCirculatoryFeedback(userBPM);
    } else {
        // Prevent the user from spam clicking or clicking too slow (for whatever reason)
        circulatoryDisplayActualBPM.textContent = 'Error';
        updateCirculatoryFeedback("Rhythm cannot be recorded, please try again!");
    }

    // Record 20 most recent clicks only, anything older will be deleted
    if (circulatoryUserClicks.length > 20) {
        circulatoryUserClicks = circulatoryUserClicks.slice(-20);
    }
}

// Give feedback to the user based on how close user is to target BPM
function giveCirculatoryFeedback(userBPM) {
    const difference = Math.abs(userBPM - circulatoryTargetBPM);
    let message = "";

    if (difference <= 1) { // Perfect rhythm, within 0-1 BPM difference
        message = "Perfect rhythm! Absolutely flawless!";
    } else if (difference <= 4) { // Good rhythm, within 2-4 BPM difference
        message = "Good rhythm! Almost perfect!";
    } else if (difference <= 10) { // Slightly off rhythm, within 5-10 BPM difference
        message = userBPM < circulatoryTargetBPM ?
            "Slightly off rhythm! Click/Tap faster!" :
            "Slightly off rhythm! Click/Tap slower!";
    } else if (difference <= 20) { // Very off rhythm, within 11-20 BPM difference
        message = userBPM < circulatoryTargetBPM ?
            "Very off rhythm! Click/Tap much faster!" :
            "Very off rhythm! Click/Tap much slower!";
    } else { // Extremely off rhythm, 20+ BPM difference
        message = userBPM < circulatoryTargetBPM ?
            "Extremely off rhythm! Way too slow!" :
            "Extremely off rhythm! Way too fast!";
    }

    updateCirculatoryFeedback(message);
}

// Update the feedback message (inside the green box in between the heart and the text box)
function updateCirculatoryFeedback(message) {
    if (circulatoryRhythmFeedback) {
        circulatoryRhythmFeedback.innerHTML = '<p>' + message + '</p>';
    }
}

// Reset the entire game
function resetCirculatoryGame() {
    if (circulatoryPulseInterval) {
        clearInterval(circulatoryPulseInterval);
    }

    // Reset interval value back to its default state
    circulatoryTargetBPM = 60;
    circulatoryUserClicks = [];
    circulatoryGameStarted = false;
    circulatoryClickCount = 0;

    // Reset the text back and everything else to its default state
    circulatoryTargetBPMInput.value = 60;
    circulatoryDisplayTargetBPM.textContent = '--';
    circulatoryDisplayActualBPM.textContent = '--';
    circulatoryPulseCircle.classList.remove('pulse-animation');
    circulatoryHeartIcon.style.transform = 'scale(0.2)'; // Same as above. Reduce scale to fit.

    updateCirculatoryFeedback("Set your target BPM and click the heart in rhythm!");
    startCirculatoryPulse(circulatoryTargetBPM);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        if (document.getElementById('circulatory-content')) {
            if (circulatorySetBPMBtn) {
                circulatorySetBPMBtn.addEventListener('click', setCirculatoryBPM);
            }

            if (circulatoryResetGameBtn) {
                circulatoryResetGameBtn.addEventListener('click', resetCirculatoryGame);
            }

            if (circulatoryHeartIcon) {
                circulatoryHeartIcon.addEventListener('click', handleCirculatoryClick);
            }

            if (circulatoryTargetBPMInput) {
                circulatoryTargetBPMInput.addEventListener('keypress', function (event) {
                    if (event.key === 'Enter') {
                        setCirculatoryBPM();
                    }
                });
            }

            startCirculatoryPulse(circulatoryTargetBPM);
        }
    }, 100);
});