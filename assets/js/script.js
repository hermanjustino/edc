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
        this.quizDescription = "Test your knowledge of Canadian government responsibilities";
        
        this.init();
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
        
        // Share button events
        document.getElementById('share-twitter').addEventListener('click', () => this.shareToTwitter());
        document.getElementById('share-facebook').addEventListener('click', () => this.shareToFacebook());
        document.getElementById('share-linkedin').addEventListener('click', () => this.shareToLinkedIn());
        document.getElementById('share-copy').addEventListener('click', () => this.copyLink());
        
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
        
        // Show feedback message
        this.showFeedback(isCorrect, currentQ.correct);
        
        // Move to next question after delay
        setTimeout(() => {
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
        }, 1500);
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
        
        if (isCorrect) {
            feedbackDiv.textContent = '✅ Correct!';
        } else {
            feedbackDiv.textContent = `❌ Incorrect. The correct answer is ${correctAnswer}.`;
        }
        
        // Add educational context for environmental questions
        const currentQ = this.questions[this.currentQuestion];
        if (this.environmentalServices.some(env => env.service === currentQ.service)) {
            const contextDiv = document.createElement('div');
            contextDiv.className = 'context-message';
            contextDiv.textContent = this.getEnvironmentalContext(currentQ.service);
            feedbackDiv.appendChild(contextDiv);
        }
        
        document.querySelector('.drag-area').appendChild(feedbackDiv);
        
        // Trigger animation
        setTimeout(() => {
            feedbackDiv.classList.add('show');
        }, 100);
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
        
        // Update share buttons with current results
        this.updateShareContent();
    }
    
    shareToTwitter() {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.shareText)}&url=${encodeURIComponent(this.quizUrl)}&hashtags=${this.shareHashtags}`;
        this.openShareWindow(url);
    }
    
    shareToFacebook() {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.quizUrl)}&quote=${encodeURIComponent(this.shareText)}`;
        this.openShareWindow(url);
    }
    
    shareToLinkedIn() {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.quizUrl)}&title=${encodeURIComponent(this.quizTitle)}&summary=${encodeURIComponent(this.shareText)}`;
        this.openShareWindow(url);
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

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CivicQuiz();
});
