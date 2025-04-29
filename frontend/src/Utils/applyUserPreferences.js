const applyUserPreferences = ({ theme, fontSize }) => {
    const root = document.documentElement;

    // Fuente base
    switch (fontSize) {
        case "small":
          root.style.setProperty('--base-font-size', '16px');
          break;
        case "medium":
          root.style.setProperty('--base-font-size', '20px');
          break;
        case "large":
          root.style.setProperty('--base-font-size', '24px');
          break;
        default:
          root.style.setProperty('--base-font-size', '20px');
      }
  
    // Tema
    if (theme === "night") {
      root.style.setProperty('--white', '#E6E8EC');
      root.style.setProperty('--black', '#000000');
      root.style.setProperty('--grey', '#A7A7A7');
      root.style.setProperty('--dark-grey', '#141212');
    } else {
      root.style.setProperty('--white', '#000000');
      root.style.setProperty('--black', '#E6E8EC');
      root.style.setProperty('--grey', '#141212');
      root.style.setProperty('--dark-grey', '#A7A7A7');
    }
  };

  export default applyUserPreferences;
  