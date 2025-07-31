class CivicQuiz {
    constructor() {
        // Government services data from EDC CSV
        this.allServices = {
            Federal: [
                { service: "Mail", emoji: "📮" },
                { service: "Currency", emoji: "🪙" },
                { service: "Banking", emoji: "🏦" },
                { service: "Shipping", emoji: "🚢" },
                { service: "Airports", emoji: "🛫" },
                { service: "Railways", emoji: "🚄" },
                { service: "Pipelines", emoji: "🔧" },
                { service: "Telephones", emoji: "📞" },
                { service: "Federal Income Tax", emoji: "💰" },
                { service: "Employment Insurance", emoji: "💼" },
                { service: "Criminal Law", emoji: "⚖️" },
                { service: "Aboriginal Lands and Rights", emoji: "📃" },
                { service: "Foreign Affairs", emoji: "🗺️" },
                { service: "National Defence", emoji: "🪖" }
            ],
            Provincial: [
                { service: "Education", emoji: "🎓" },
                { service: "Healthcare", emoji: "🏥" },
                { service: "Road Regulations", emoji: "🛣️" },
                { service: "Driver's licenses", emoji: "🚗" },
                { service: "Highways", emoji: "🛤️" },
                { service: "Natural Resources", emoji: "💎" },
                { service: "Property and Civil Rights", emoji: "👩🏻‍⚖️" },
                { service: "Labour Standards", emoji: "👷🏻‍♂️" },
                { service: "Minimum wage", emoji: "💵" },
                { service: "Work safety", emoji: "🦺" },
                { service: "Sales Tax", emoji: "💰" },
                { service: "Provincial Income Tax", emoji: "📊" }
            ],
            Municipal: [
                { service: "Parks", emoji: "🌳" },
                { service: "Libraries", emoji: "📕" },
                { service: "Local Roads", emoji: "🛑" },
                { service: "Parking", emoji: "🅿️" },
                { service: "Public Transportation", emoji: "🚌" },
                { service: "Local Land Use (zoning)", emoji: "🏘️" },
                { service: "Water Services", emoji: "🚿" },
                { service: "Local Police", emoji: "🚓" },
                { service: "Fire Protection", emoji: "🚒" },
                { service: "By-law Enforcement", emoji: "🔊" },
                { service: "Waste Collection", emoji: "🗑️" }
            ]
        };

        // Environmental services (disputed/complex)
        this.environmentalServices = [
            { service: "Oceans and fisheries", correct: "Federal", emoji: "🌊" },
            { service: "Navigable waters", correct: "Federal", emoji: "⛵" },
            { service: "Migratory birds", correct: "Federal", emoji: "🦅" },
            { service: "International climate treaties", correct: "Federal", emoji: "🌍" },
            { service: "Industrial pollution", correct: "Provincial", emoji: "🏭" },
            { service: "Greenhouse gases", correct: "Provincial", emoji: "🌡️" },
            { service: "Toxic substances", correct: "Provincial", emoji: "☠️" },
            { service: "Water quality management", correct: "Provincial", emoji: "💧" },
            { service: "Endangered species", correct: "Provincial", emoji: "🦎" },
            { service: "Waste management policy", correct: "Provincial", emoji: "♻️" },
            { service: "Zoning for natural heritage", correct: "Municipal", emoji: "🌿" }
        ];

        // Generate quiz questions
        this.questions = this.generateQuestions();
        
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.draggedElement = null;
        this.isProcessing = false; // Add processing state
        
        this.personas = {
            "Civic Explorer": {
                range: [0, 3],
                message: "You're just starting your civic journey! Keep exploring to learn more about how government works. Every expert was once a beginner."
            },
            "Local Builder": {
                range: [4, 6],
                message: "You have a solid foundation in civic knowledge! You understand some key government responsibilities and are building your expertise."
            },
            "Policy Navigator": {
                range: [7, 9],
                message: "Impressive! You have strong knowledge of government responsibilities. You could help others navigate the civic landscape."
            },
            "Civic Strategist": {
                range: [10, 12],
                message: "Outstanding! You have excellent knowledge of Canadian government responsibilities. You're ready to be a civic leader in your community."
            }
        };
        
        this.quizUrl = window.location.href;
        this.quizTitle = "Who's in Charge? - Civic Engagement Quiz";
        this.quizDescription = "Test your knowledge of government responsibilities in Canada.";
        
        // Add feedback messages for each service
        this.feedbackMessages = {
            // Federal services
            "Mail": "Canada Post is a Crown Corporation created by the Federal Government.",
            "Currency": "Coins are produced by the Royal Canadian Mint. Bills are produced by the Canadian Bank Note Company based on the direction of the Bank of Canada, a crown corporation with considerable independence from the Federal Government.",
            "Banking": "Decisions about money supply, lending to private banks and interest rates are made by the Bank of Canada, a crown corporation.  Banking regulations are set by the Federal Government.",
            "Shipping": "When transportation crosses provincial and international borders it is usually regulated by the Federal Government - except for cars, trucks and highways.",
            "Airports": "When transportation crosses provincial and international borders it is usually regulated by the Federal Government - except for cars, trucks and highways.",
            "Railways": "Most infrastructure that crosses provincial borders is a federal responsibility.",
            "Pipelines": "Most infrastructure that crosses provincial borders is a federal responsibility.",
            "Telephones": "Most infrastructure that crosses provincial borders is a federal responsibility.",
            "Federal Income Tax": "The Canada Revenue Agency collects federal income taxes.",
            "Employment Insurance": "The federal government also provides Old Age Security and regulates the Canada Pension Plan.",
            "Criminal Law": "The Criminal Code of Canada is federal legislation.",
            "Aboriginal Lands and Rights": "Canada has treaties with many Indigenous nations. Upholding these treaties is the responsibility of the federal government.  Some land in Canada, especially in British Columbia, is unceded. No treaties were ever signed and the Indigenous Title to this land is still in place.",
            "Foreign Affairs": "International treaties on trade and other issues are negotiated and signed by the federal government.",
            "National Defence": "Funding and maintaining national defence forces is a Federal Responsibility.  In 2025, the federal government pledged to gradually increase spending on national defence to 3.5% of GDP.  This will mean more than doubling defence spending from current levels.",

            // Provincial services
            "Education": "Provinces manage and fund the education system, including colleges and universities. In 2025, the Ontario government has been displaying their power over education by seizing control of local school boards throughout the province.",
            "Healthcare": "Healthcare policy and funding are a provincial responsibility, but some costs are covered by the federal government in the form of Canada Health Transfer payments. You can learn more about healthcare policy from the Ontario Nurses Association, the Ontario Health Coalition or the Canadian Association of Physicians for the Environment.",
            "Road Regulations": "Provincial governments set the rules of the road and issue drivers licenses.",
            "Driver's licenses": "Driver's licenses are issued by provincial governments.",
            "Highways": "Provincial governments fund and maintain larger highways.  Ontario's proposed Highway 413 will cost over 7 Billion to build and pave over 2000 acres of farmland, including 400 acres of the Greenbelt.",
            "Natural Resources": "Rules around mining and extraction are set by provincial governments. These policies impact the economy and the environment and provincial revenues.  The non-partisan group Reform Gravel Mining argues that Ontario has licensed far more quarries and gravel pits than we need.",
            "Property and Civil Rights": "Property law and civil law are determined by the province. Criminal law is the responsibility of the federal government.",
            "Labour Standards": "Work safety rules and minimum wage are set by the provincial government.",
            "Minimum wage": "Each province sets its own minimum wage rates.",
            "Work safety": "Workplace safety regulations are managed by provincial governments.",
            "Sales Tax": "Provincial sales tax (PST) is set and collected by provinces.",
            "Provincial Income Tax": "Provincial income tax rates are set by each province.",

            // Municipal services
            "Parks": "Local parks are typically owned and maintained by municipal governments.",
            "Libraries": "Libraries offer a lot more than books!  Check with your local library to learn about classes, talks, computer and tool access and more!",
            "Local Roads": "Low-density housing tends to drive up property taxes because of the high cost of installing new infrastructure that can't be shared by a large number of residents.",
            "Parking": "As land and housing costs continue to increase, some urban planners are starting to wonder how much it actually costs to offer so much on-street parking.  'The High Cost of Free Parking' by Donald Shoup is a detailed examination of this issue.",
            "Public Transportation": "Public transportation is funded and maintained by municipal governments and regional agency like GO transit and Metrolinx, but projects often receive funding from federal and provincial governments.",
            "Local Land Use (zoning)": "The province sets many of the rules around land-use, but municipalities can define and map zoning. Did you know that zoning which allows only single-family homes drives up property taxes because there are fewer people to share the cost of maintaining infrastructure?",
            "Water Services": "Low-density housing tends to drive up property taxes and utilities because the cost of maintaining infrastructure must be shared between a small number of residents.",
            "Local Police": "Local police forces are funded and overseen by municipal governments.",
            "Fire Protection": "Fire departments are typically municipal services.",
            "By-law Enforcement": "Local bylaws and their enforcement are municipal responsibilities.",
            "Waste Collection": "Garbage and recycling collection are municipal services."
        };
        
        // Initialize sound effects
        this.sounds = {
            correct: null,
            incorrect: null
        };
        
        // Flag to track if sounds are ready
        this.soundsReady = false;
        
        // Preload sounds and set volume
        this.initializeSounds();
        
        this.init();
    }
    
    initializeSounds() {
        try {
            // Create audio objects
            this.sounds.correct = new Audio('assets/sounds/correct.mp3');
            this.sounds.incorrect = new Audio('assets/sounds/incorrect.mp3');
            
            // Set volume levels (0.0 to 1.0)
            this.sounds.correct.volume = 0.6;
            this.sounds.incorrect.volume = 0.5;
            
            // Preload sounds for better performance
            this.sounds.correct.preload = 'auto';
            this.sounds.incorrect.preload = 'auto';
            
            // Load sounds immediately
            this.sounds.correct.load();
            this.sounds.incorrect.load();
            
            let soundsLoaded = 0;
            const totalSounds = 2;
            
            // Track when sounds are ready
            const checkSoundsReady = () => {
                soundsLoaded++;
                if (soundsLoaded >= totalSounds) {
                    this.soundsReady = true;
                    console.log('Sound effects loaded successfully');
                }
            };
            
            // Handle successful loading
            this.sounds.correct.addEventListener('canplaythrough', checkSoundsReady);
            this.sounds.incorrect.addEventListener('canplaythrough', checkSoundsReady);
            
            // Handle loading errors gracefully
            this.sounds.correct.addEventListener('error', (e) => {
                console.warn('Could not load correct sound effect:', e);
                checkSoundsReady(); // Still count as "loaded" to prevent hanging
            });
            
            this.sounds.incorrect.addEventListener('error', (e) => {
                console.warn('Could not load incorrect sound effect:', e);
                checkSoundsReady(); // Still count as "loaded" to prevent hanging
            });
            
            // Fallback timeout to mark sounds as ready
            setTimeout(() => {
                if (!this.soundsReady) {
                    this.soundsReady = true;
                    console.log('Sound loading timeout - proceeding without audio');
                }
            }, 3000);
            
        } catch (error) {
            console.warn('Error initializing sounds:', error);
            this.soundsReady = true; // Proceed without sounds
        }
    }
    
    async playSound(soundType) {
        // Don't attempt to play if sounds aren't ready or don't exist
        if (!this.soundsReady || !this.sounds[soundType]) {
            return;
        }
        
        try {
            const audio = this.sounds[soundType];
            
            // Stop any currently playing instance
            audio.pause();
            audio.currentTime = 0;
            
            // Clone the audio to allow overlapping plays
            const audioClone = audio.cloneNode();
            audioClone.volume = audio.volume;
            
            // Attempt to play
            const playPromise = audioClone.play();
            
            if (playPromise !== undefined) {
                await playPromise.catch(error => {
                    // Browser blocked autoplay - this is expected behavior
                    if (error.name === 'NotAllowedError') {
                        console.log('Audio autoplay blocked by browser (this is normal)');
                    } else {
                        console.warn('Error playing sound:', error);
                    }
                });
            }
        } catch (error) {
            console.warn('Error in playSound:', error);
        }
    }
    
    generateQuestions() {
        const questions = [];
        
        // Add 3-4 questions from each government level
        const federalQuestions = this.getRandomServices(this.allServices.Federal, 3);
        const provincialQuestions = this.getRandomServices(this.allServices.Provincial, 3);
        const municipalQuestions = this.getRandomServices(this.allServices.Municipal, 3);
        
        // Add 2-3 environmental questions (these are more challenging)
        const environmentalQuestions = this.getRandomServices(this.environmentalServices, 3);
        
        // Combine and shuffle
        const allQuestions = [
            ...federalQuestions.map(q => ({ ...q, correct: "Federal" })),
            ...provincialQuestions.map(q => ({ ...q, correct: "Provincial" })),
            ...municipalQuestions.map(q => ({ ...q, correct: "Municipal" })),
            ...environmentalQuestions
        ];
        
        // Shuffle and take 12 questions
        return this.shuffleArray(allQuestions).slice(0, 12);
    }
    
    getRandomServices(serviceArray, count) {
        return this.shuffleArray([...serviceArray]).slice(0, count);
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    init() {
        // Update total questions display
        document.getElementById('total-questions').textContent = this.questions.length;
        this.updateProgress();
        this.displayQuestion();
        this.bindEvents();
    }
    
    bindEvents() {
        const draggable = document.getElementById('draggable-service');
        const dropZones = document.querySelectorAll('.drop-zone');
        
        // Enable sounds on first user interaction
        const enableSoundsOnce = () => {
            this.enableSounds();
            document.removeEventListener('click', enableSoundsOnce);
            document.removeEventListener('touchstart', enableSoundsOnce);
        };
        
        document.addEventListener('click', enableSoundsOnce);
        document.addEventListener('touchstart', enableSoundsOnce);
        
        // Drag events
        draggable.addEventListener('dragstart', (e) => this.handleDragStart(e));
        draggable.addEventListener('dragend', (e) => this.handleDragEnd(e));
        
        // Drop zone events
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => this.handleDragOver(e));
            zone.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            zone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            zone.addEventListener('drop', (e) => this.handleDrop(e));
            zone.addEventListener('click', (e) => this.handleZoneClick(e));
        });
        
        // Keyboard accessibility
        draggable.addEventListener('keydown', (e) => this.handleKeyDown(e));
        dropZones.forEach(zone => {
            zone.addEventListener('keydown', (e) => this.handleZoneKeyDown(e));
        });
        
        // Touch events for mobile
        draggable.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        draggable.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        draggable.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Add next button event
        document.addEventListener('click', (e) => {
            if (e.target.id === 'next-btn') {
                this.handleNextQuestion();
            }
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
    }
    
    updateProgress() {
        const progress = (this.currentQuestion / this.questions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('current-question').textContent = this.currentQuestion + 1;
        document.getElementById('total-questions').textContent = this.questions.length;
    }
    
    displayQuestion() {
        if (this.currentQuestion < this.questions.length) {
            const question = this.questions[this.currentQuestion];
            
            // Fade out
            const questionCard = document.querySelector('.question-card');
            questionCard.classList.add('fading');
            
            setTimeout(() => {
                // Update content
                document.getElementById('question-text').textContent = question.service;
                document.getElementById('service-emoji').textContent = question.emoji;
                document.getElementById('service-name').textContent = question.service;
                
                // Reset zones
                document.querySelectorAll('.drop-zone').forEach(zone => {
                    zone.classList.remove('drag-over', 'correct-answer', 'incorrect-answer');
                });
                
                // Reset draggable
                const draggable = document.getElementById('draggable-service');
                draggable.classList.remove('dragging');
                draggable.style.transform = '';
                
                // Remove any existing feedback
                const existingFeedback = document.querySelector('.feedback-message');
                if (existingFeedback) {
                    existingFeedback.remove();
                }
                
                // Fade in
                questionCard.classList.remove('fading');
            }, 150);
        }
    }
    
    handleDragStart(e) {
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }
    
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedElement = null;
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    
    handleDragEnter(e) {
        e.preventDefault();
        e.target.closest('.drop-zone').classList.add('drag-over');
    }
    
    handleDragLeave(e) {
        if (!e.target.closest('.drop-zone').contains(e.relatedTarget)) {
            e.target.closest('.drop-zone').classList.remove('drag-over');
        }
    }
    
    handleDrop(e) {
        e.preventDefault();
        
        // Prevent multiple submissions
        if (this.isProcessing) return;
        
        const dropZone = e.target.closest('.drop-zone');
        dropZone.classList.remove('drag-over');
        
        const selectedAnswer = dropZone.dataset.government;
        this.processAnswer(selectedAnswer, dropZone);
    }
    
    handleZoneClick(e) {
        // Prevent multiple submissions
        if (this.isProcessing) return;
        
        const dropZone = e.target.closest('.drop-zone');
        const selectedAnswer = dropZone.dataset.government;
        this.processAnswer(selectedAnswer, dropZone);
    }
    
    handleKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Highlight first zone for keyboard navigation
            document.querySelector('.drop-zone').focus();
        }
    }
    
    handleZoneKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            
            // Prevent multiple submissions
            if (this.isProcessing) return;
            
            const selectedAnswer = e.target.dataset.government;
            this.processAnswer(selectedAnswer, e.target);
        }
    }
    
    // Touch support for mobile
    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
        this.touchStartX = e.touches[0].clientX;
        e.target.classList.add('dragging');
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        // Remove previous drag-over states
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drag-over');
        });
        
        // Add drag-over to current zone
        const dropZone = element?.closest('.drop-zone');
        if (dropZone) {
            dropZone.classList.add('drag-over');
        }
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        
        // Prevent multiple submissions
        if (this.isProcessing) return;
        
        const touch = e.changedTouches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = element?.closest('.drop-zone');
        
        document.getElementById('draggable-service').classList.remove('dragging');
        
        if (dropZone) {
            dropZone.classList.remove('drag-over');
            const selectedAnswer = dropZone.dataset.government;
            this.processAnswer(selectedAnswer, dropZone);
        }
    }
    
    processAnswer(selectedAnswer, dropZone) {
        // Set processing state to prevent multiple clicks
        this.isProcessing = true;
        
        // Disable all drop zones
        this.disableInteractions();
        
        const currentQ = this.questions[this.currentQuestion];
        const isCorrect = selectedAnswer === currentQ.correct;
        
        // Store the answer
        this.userAnswers.push({
            question: currentQ.service,
            userAnswer: selectedAnswer,
            correctAnswer: currentQ.correct,
            isCorrect: isCorrect
        });
        
        // Update score
        if (isCorrect) {
            this.score++;
        }
        
        // Visual feedback
        dropZone.classList.add(isCorrect ? 'correct-answer' : 'incorrect-answer');
        
        // Play appropriate sound effect immediately
        this.playSound(isCorrect ? 'correct' : 'incorrect');
        
        // Show feedback message with next button
        this.showFeedback(isCorrect, currentQ.correct);
    }
    
    // Add method to enable sound after user interaction
    enableSounds() {
        if (!this.soundsReady) return;
        
        // Play a silent sound to "unlock" audio context
        try {
            if (this.sounds.correct) {
                const originalVolume = this.sounds.correct.volume;
                this.sounds.correct.volume = 0;
                this.sounds.correct.play().then(() => {
                    this.sounds.correct.pause();
                    this.sounds.correct.currentTime = 0;
                    this.sounds.correct.volume = originalVolume;
                }).catch(() => {
                    // Ignore errors
                });
            }
        } catch (error) {
            // Ignore errors
        }
    }
    
    disableInteractions() {
        // Disable all drop zones
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.style.pointerEvents = 'none';
            zone.style.opacity = '0.7';
        });
        
        // Disable draggable card
        const draggable = document.getElementById('draggable-service');
        draggable.draggable = false;
        draggable.style.pointerEvents = 'none';
        draggable.style.opacity = '0.7';
    }
    
    enableInteractions() {
        // Re-enable all drop zones
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.style.pointerEvents = 'auto';
            zone.style.opacity = '1';
        });
        
        // Re-enable draggable card
        const draggable = document.getElementById('draggable-service');
        draggable.draggable = true;
        draggable.style.pointerEvents = 'auto';
        draggable.style.opacity = '1';
    }
    
    showFeedback(isCorrect, correctAnswer) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = `feedback-message ${isCorrect ? 'correct' : 'incorrect'}`;
        
        const currentQ = this.questions[this.currentQuestion];
        const serviceName = currentQ.service;
        
        // Show correct/incorrect status
        if (isCorrect) {
            feedbackDiv.textContent = '✅ Correct! ';
        } else {
            feedbackDiv.textContent = `❌ Incorrect. The correct answer is ${correctAnswer}. `;
        }
        
        // Add the educational message if available
        if (this.feedbackMessages[serviceName]) {
            feedbackDiv.textContent += this.feedbackMessages[serviceName];
        }
        
        // Add educational context for environmental questions
        if (this.environmentalServices.some(env => env.service === serviceName)) {
            const contextDiv = document.createElement('div');
            contextDiv.className = 'context-message';
            contextDiv.textContent = this.getEnvironmentalContext(serviceName);
            feedbackDiv.appendChild(contextDiv);
        }
        
        // Add next button
        const nextButton = document.createElement('button');
        nextButton.id = 'next-btn';
        nextButton.className = 'next-btn';
        
        if (this.currentQuestion < this.questions.length - 1) {
            nextButton.innerHTML = '➡️ Next Question';
        } else {
            nextButton.innerHTML = '🏁 See Results';
        }
        
        feedbackDiv.appendChild(nextButton);
        
        document.querySelector('.drag-area').appendChild(feedbackDiv);
        
        // Trigger animation
        setTimeout(() => {
            feedbackDiv.classList.add('show');
        }, 100);
    }
    
    handleNextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            this.updateProgress();
            this.displayQuestion();
            // Re-enable interactions after question loads
            setTimeout(() => {
                this.enableInteractions();
                this.isProcessing = false;
            }, 200);
        } else {
            this.showResults();
            this.isProcessing = false;
        }
    }
    
    getEnvironmentalContext(service) {
        const contexts = {
            "Oceans and fisheries": "Federal government manages Canada's ocean resources and fisheries under the Fisheries Act.",
            "Navigable waters": "Federal jurisdiction covers waters that can be used for shipping and navigation.",
            "Migratory birds": "Birds that cross provincial/international boundaries fall under federal protection.",
            "International climate treaties": "Only federal government can sign international agreements like the Paris Climate Accord.",
            "Industrial pollution": "Provinces regulate most industrial emissions and pollution within their borders.",
            "Greenhouse gases": "Provincial governments set most emission standards and carbon pricing policies.",
            "Toxic substances": "Provinces manage most toxic waste and hazardous materials within their jurisdiction.",
            "Water quality management": "Provinces are responsible for water quality standards and testing.",
            "Endangered species": "Provincial governments manage most wildlife and species protection programs.",
            "Waste management policy": "Provinces set policies for waste management and recycling programs.",
            "Zoning for natural heritage": "Municipal governments control local land use and zoning decisions."
        };
        return contexts[service] || "Environmental responsibilities often overlap between government levels.";
    }
    
    showResults() {
        const quizScreen = document.getElementById('quiz-screen');
        const resultsScreen = document.getElementById('results-screen');
        
        quizScreen.classList.remove('active');
        setTimeout(() => {
            resultsScreen.classList.add('active');
        }, 300);
        
        // Update score display
        document.getElementById('final-score').textContent = this.score;
        
        // Determine and display persona
        const persona = this.getPersona();
        document.getElementById('persona-name').textContent = persona.name;
        document.getElementById('persona-message').textContent = persona.message;
        
        // Update persona badge color based on score
        const badge = document.getElementById('persona-badge');
        if (this.score >= 6) {
            badge.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        } else if (this.score >= 4) {
            badge.style.background = 'linear-gradient(135deg, #ffc107, #fd7e14)';
        } else if (this.score >= 2) {
            badge.style.background = 'linear-gradient(135deg, #17a2b8, #6f42c1)';
        } else {
            badge.style.background = 'linear-gradient(135deg, #dc3545, #e83e8c)';
        }
    }
    
    async copyLink() {
        try {
            await navigator.clipboard.writeText(this.quizUrl);
            this.showShareFeedback('Link copied to clipboard!');
            
            // Update button appearance
            const copyBtn = document.getElementById('share-copy');
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = '<span class="share-icon">✅</span>Copied!';
            
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = '<span class="share-icon">📋</span>Copy Link';
            }, 2000);
            
        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopyLink();
        }
    }
    
    fallbackCopyLink() {
        const textArea = document.createElement('textarea');
        textArea.value = this.quizUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showShareFeedback('Link copied to clipboard!');
        } catch (err) {
            this.showShareFeedback('Unable to copy link. Please copy manually.');
        }
        
        document.body.removeChild(textArea);
    }
    
    openShareWindow(url) {
        const width = 600;
        const height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        window.open(
            url,
            'share-window',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );
    }
    
    showShareFeedback(message) {
        const feedback = document.getElementById('share-feedback');
        feedback.textContent = message;
        feedback.classList.add('show');
        
        setTimeout(() => {
            feedback.classList.remove('show');
        }, 3000);
    }
    
    getPersona() {
        for (const [name, data] of Object.entries(this.personas)) {
            if (this.score >= data.range[0] && this.score <= data.range[1]) {
                return { name, message: data.message };
            }
        }
        return { name: "Civic Explorer", message: this.personas["Civic Explorer"].message };
    }
    
    restart() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isProcessing = false; // Reset processing state
        
        // Generate new questions for replay
        this.questions = this.generateQuestions();
        
        const quizScreen = document.getElementById('quiz-screen');
        const resultsScreen = document.getElementById('results-screen');
        
        resultsScreen.classList.remove('active');
        setTimeout(() => {
            quizScreen.classList.add('active');
            // Update total questions display with new question set
            document.getElementById('total-questions').textContent = this.questions.length;
            this.updateProgress();
            this.displayQuestion();
            // Ensure interactions are enabled on restart
            setTimeout(() => {
                this.enableInteractions();
            }, 200);
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CivicQuiz();
});
