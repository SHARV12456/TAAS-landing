document.addEventListener('DOMContentLoaded', () => {
  const splashScreen = document.getElementById('splash-screen');
  const skipBtn = document.getElementById('splash-skip');
  const logo = splashScreen?.querySelector('animated-logo');
  
  if (!splashScreen) return;

  const hideSplash = () => {
    splashScreen.style.transform = 'translateY(-100%)';
    splashScreen.style.opacity = '0';
    setTimeout(() => {
      splashScreen.style.display = 'none';
    }, 600); // Wait for transition
  };

  if (sessionStorage.getItem('taas-intro-seen')) {
    splashScreen.style.display = 'none';
  } else {
    sessionStorage.setItem('taas-intro-seen', 'true');
    
    if (logo) {
      logo.addEventListener('intro-complete', hideSplash);
    } else {
      setTimeout(hideSplash, 2400);
    }
    
    if (skipBtn) {
      skipBtn.addEventListener('click', hideSplash);
    }
  }
});
