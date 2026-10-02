// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Matrix Rain Effect
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
const charArray = chars.split('');

const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(5, 10, 21, 0.07)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0a3d5c'; // Dark teal
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Occasional darker accent characters
        if (Math.random() > 0.92) {
            ctx.fillStyle = '#0d4a3a';
        } else {
            ctx.fillStyle = '#0a3d5c';
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 33);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Typing Animation
const typingText = document.getElementById('typing-text');
const phrases = [
    "Ethical Hacker",
    "Penetration Tester",
    "Cybersecurity Enthusiast"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500; // Pause before typing next
    }

    setTimeout(typeEffect, typeSpeed);
}

setTimeout(typeEffect, 1000);

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate progress bars when visible
            const progressFills = entry.target.querySelectorAll('.progress-fill');
            progressFills.forEach(fill => {
                const width = fill.getAttribute('data-width');
                fill.style.width = width;
            });
            
            // Animate counters
            if (entry.target.classList.contains('stats-row')) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                    
                    // Remove class to prevent triggering again
                    counter.removeAttribute('data-target'); 
                });
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe
document.querySelectorAll('.glass-card, .timeline-item, .stats-row, .section-title').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Active Navigation Highlight
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').substring(1) === current) {
            item.classList.add('active');
        }
    });
});

// Web3Forms Contact Form Submission
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Payload Delivered!';
            submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #00e5ff)';
            submitBtn.style.opacity = '1';
            contactForm.reset();
            
            // Show success notification
            showNotification('✅ Connection established! Message delivered successfully.', 'success');
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 4000);
        } else {
            throw new Error(result.message || 'Transmission failed');
        }
    } catch (error) {
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Transmission Failed';
        submitBtn.style.background = 'linear-gradient(135deg, #ff3860, #ff6b6b)';
        submitBtn.style.opacity = '1';
        
        showNotification('❌ Connection failed. Try again or email directly.', 'error');
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    }
});

// Notification Toast
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400);
    }, 5000);
}
