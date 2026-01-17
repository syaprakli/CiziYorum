import { useState, useEffect } from 'react';

export default function Logo() {
    const [logo, setLogo] = useState('/img/logo_new.jpg');

    useEffect(() => {
        const updateLogo = () => {
            try {
                const savedLogo = localStorage.getItem('appLogo');
                if (savedLogo) {
                    setLogo(savedLogo);
                } else {
                    setLogo('/img/logo_new.jpg');
                }
            } catch (err) {
                console.error("Logo load error:", err);
                setLogo('/img/logo_new.jpg');
            }
        };

        // Initial load
        updateLogo();

        // Listen for internal updates
        window.addEventListener('logoChange', updateLogo);
        // Listen for updates from other tabs
        window.addEventListener('storage', updateLogo);

        return () => {
            window.removeEventListener('logoChange', updateLogo);
            window.removeEventListener('storage', updateLogo);
        };
    }, []);

    return (
        <div className="relative w-40 h-40 flex items-center justify-center">
            {/* SVG for Curved Text */}
            <svg className="absolute w-full h-full animate-spin-slow" viewBox="0 0 200 200" style={{ animationDuration: '20s' }}>
                <path
                    id="textPathTop"
                    d="M 20,100 A 80,80 0 0,1 180,100"
                    fill="transparent"
                />
                <path
                    id="textPathBottom"
                    d="M 20,100 A 80,80 0 0,0 180,100"
                    fill="transparent"
                />

                <text className="font-heading font-bold fill-primary text-[24px] uppercase tracking-widest">
                    <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
                        Haydi
                    </textPath>
                </text>

                <text className="font-heading font-bold fill-secondary text-[22px] uppercase tracking-widest">
                    <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle" side="left">
                        ÇiziYorum
                    </textPath>
                </text>
            </svg>

            {/* Static Image Center */}
            <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-pop overflow-hidden z-10 bg-white">
                <img
                    src={logo}
                    alt="Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/img/logo_new.jpg";
                    }}
                />
            </div>

            {/* Circular Text Badge */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                        <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                    </defs>
                    <text fontSize="11" fontWeight="bold" fill="#6C5CE7" letterSpacing="2">
                        <textPath xlinkHref="#circle" startOffset="0%">
                            HAYDİ • ÇİZİYORUM •
                        </textPath>
                    </text>
                </svg>
            </div>
        </div>
    );
}

// Redoing component to match specific user request precisely:
// "Yukarıda Asaf İle, Aşağıda ÇiziYorum"
export function BrandLogo() {
    const [logo, setLogo] = useState('/img/logo_new.jpg');

    useEffect(() => {
        const updateLogo = () => {
            try {
                const savedLogo = localStorage.getItem('appLogo');
                if (savedLogo) {
                    setLogo(savedLogo);
                } else {
                    setLogo('/img/logo_new.jpg');
                }
            } catch (err) {
                console.error("BrandLogo load error:", err);
                setLogo('/img/logo_new.jpg');
            }
        };

        updateLogo();
        window.addEventListener('logoChange', updateLogo);
        window.addEventListener('storage', updateLogo);

        return () => {
            window.removeEventListener('logoChange', updateLogo);
            window.removeEventListener('storage', updateLogo);
        };
    }, []);

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Central Image */}
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-pop z-10 relative bg-white">
                <img
                    src={logo}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/img/logo_new.jpg";
                    }}
                />
            </div>

            {/* Curved Text Container */}
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 200 200">
                <defs>
                    {/* Top Arch */}
                    <path id="top-curve" d="M 30,100 A 70,70 0 0,1 170,100" fill="none" />
                    {/* Bottom Arch - drawn counter-clockwise to flip text correctly? No, usually distinct path needed for bottom readable text */}
                    <path id="bottom-curve" d="M 30,100 A 70,70 0 0,0 170,100" fill="none" />
                </defs>

                <text fill="#6C5CE7" fontSize="24" fontWeight="bold" fontFamily="Fredoka" letterSpacing="0.05em">
                    <textPath href="#top-curve" startOffset="50%" textAnchor="middle">
                        Haydi
                    </textPath>
                </text>

                <text fill="#00CEC9" fontSize="24" fontWeight="bold" fontFamily="Fredoka" letterSpacing="0.05em">
                    <textPath href="#bottom-curve" startOffset="50%" textAnchor="middle" dominantBaseline="hanging">
                        ÇiziYorum
                    </textPath>
                </text>
            </svg>
        </div>
    )
}
