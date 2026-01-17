
export const fireConfetti = () => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF5', '#F5FF33'];

    const createParticle = () => {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height, // Start above screen
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 10 + 5,
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        };
    };

    // Burst from center logic
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            speedY: (Math.random() - 0.5) * 15, // Burst up/down
            speedX: (Math.random() - 0.5) * 15, // Burst left/right
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5,
            gravity: 0.1,
            opacity: 1
        });
    }

    let animationId;
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, index) => {
            p.x += p.speedX;
            p.y += p.speedY; // Only gravity if burst mode
            p.speedY += p.gravity || 0; // specific gravity for burst
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.005;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            if (p.opacity <= 0 || p.y > canvas.height) {
                particles.splice(index, 1);
            }
        });

        if (particles.length > 0) {
            animationId = requestAnimationFrame(animate);
        } else {
            document.body.removeChild(canvas);
            cancelAnimationFrame(animationId);
        }
    };

    animate();
};
