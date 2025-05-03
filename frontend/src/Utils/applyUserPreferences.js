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

    } else {
      root.style.setProperty('--red', '#A11515');
      root.style.setProperty('--medium-red', '#9a0007');
      root.style.setProperty('--dark-red', '#6a1b1b');

      root.style.setProperty('--blue', '#1e88e5');
      root.style.setProperty('--green', '#2e7d32');

      root.style.setProperty('--grey', '#b0b0b0');
      root.style.setProperty('--medium-grey', '#d3d3d3');
      root.style.setProperty('--medium-light-grey', '#eeeeee');

      root.style.setProperty('--dark-grey', '#f5f5f5');
      root.style.setProperty('--white', '#000000');
      root.style.setProperty('--black', '#ffffff'); 

      root.style.setProperty('--primary-link', '#673ab7');
    }
  };

  export default applyUserPreferences;
  