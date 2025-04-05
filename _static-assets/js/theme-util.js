const setTheme = () => {
  if (sessionStorage.getItem("wfe_theme")) {
    return;
  }
  let theme = "light";
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    // dark mode
    theme = "dark";
  }
  sessionStorage.setItem("wfe_theme", theme);
};

const setThemeToBody = () => {
  const theme = sessionStorage.getItem("wfe_theme");
  document.body.setAttribute("data-theme", theme);
};

const updateThemeIcon = () => {
  let currTheme = sessionStorage.getItem("wfe_theme");
  if (currTheme === "dark") {
    document.getElementById("themeCheckBox").checked = true;
  }
  // const lightIconElement = document.getElementById("light_icon");
  // const darkIconElement = document.getElementById("dark_icon");
  // console.log(lightIconElement, darkIconElement);
  // switch (currTheme) {
  //   case "light":
  //     lightIconElement?.classList.add("swap-on");
  //     lightIconElement?.classList.remove("swap-off");
  //     darkIconElement?.classList.remove("swap-on");
  //     darkIconElement?.classList.add("swap-off");
  //     break;
  //   case "dark":
  //     lightIconElement?.classList.add("swap-off");
  //     lightIconElement?.classList.remove("swap-on");
  //     darkIconElement?.classList.remove("swap-off");
  //     darkIconElement?.classList.add("swap-on");
  //     break;
  // }
};

const initTheme = () => {
  setTheme();
  setThemeToBody();
  updateThemeIcon();
};

const switchTheme = () => {
  let currTheme = sessionStorage.getItem("wfe_theme");

  switch (currTheme) {
    case "light":
      sessionStorage.setItem("wfe_theme", "dark");
      document.body.setAttribute("data-theme", "dark");
      break;
    case "dark":
      sessionStorage.setItem("wfe_theme", "light");
      document.body.setAttribute("data-theme", "light");
      break;
  }
};

window.onload = initTheme;
