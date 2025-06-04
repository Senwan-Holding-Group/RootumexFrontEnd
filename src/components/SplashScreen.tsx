import { useEffect, useState } from "react";
// import second from "/loginLogo.svg"; 
// import first from "/splashLogoName.svg"; 
// import third from "/loginForm.svg"; 
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import secureLocalStorage from "react-secure-storage";
import { User } from "@/lib/types";

const SplashScreen = () => {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [animationComplete, setAnimationComplete] = useState(false);
  const [positionTransition, setPositionTransition] = useState(false);
  const companyName = "ROOTUMEX";

  useEffect(() => {
    if (animationComplete) return;
    
    let currentIndex = 0;
    const animationInterval = setInterval(() => {
      if (currentIndex <= companyName.length) {
        setDisplayedText(companyName.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(animationInterval);
        setAnimationComplete(true);
        setTimeout(() => {
          setPositionTransition(true);
        }, 500);
      }
    }, 200); 

    return () => clearInterval(animationInterval);
  }, []); 

  useEffect(() => {
  
    if (animationComplete && positionTransition) {
      const checkAuth = () => {
        try {
          const storedToken = secureLocalStorage.getItem("token");

          if (storedToken) {
            const decodedToken = jwtDecode(storedToken.toString()) as User;
            const expirationTime = decodedToken.exp * 1000;

            if (expirationTime > Date.now()) {
              setRedirectTo("/rootumex/dashboard");
            } else {
              secureLocalStorage.clear();
              setRedirectTo("/login");
            }
          } else {
            setRedirectTo("/login");
          }
        } catch (error) {
          console.error("Auth check error:", error);
          secureLocalStorage.clear();
          setRedirectTo("/login");
        }
      };

      const authTimer = setTimeout(() => {
        checkAuth(); 
      }, 800); 

      return () => clearTimeout(authTimer);
    }
  }, [animationComplete, positionTransition]);

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="h-dvh w-screen  bg-Secondary-50 flex items-center justify-center">
      <div 
        className={`flex justify-center ${positionTransition ? 'items-start' : 'items-center'} px-11 py-[2.875rem] font-[900] text-4xl  text-Primary-500 leading-CS w-[25rem] h-[33.125rem] rounded-CS drop-shadow-2xl drop-shadow-[#8D8D8E24] bg-white  transition-all duration-700`}
      >
        <div className={`transition-all duration-700 ${positionTransition ? 'transform -translate-y-4' : ''}`}>
          {displayedText.split("").map((char, index) => (
            <span 
              key={index} 
              className="inline-block text-Primary-500 animate-pulse"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                opacity: index === displayedText.length - 1 ? 0.7 : 1
              }}
            >
              {char}
            </span>
          ))}
          {!animationComplete && <span className="animate-blink ml-1 text-Primary-500">|</span>}
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;