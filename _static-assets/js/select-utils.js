const clearCopyAndCutData = () => {
  localStorage.removeItem("stagedForCutOrCopy");
  document.getElementById("menuitem-paste")?.classList.add("menu-disabled");
};

const clearCheckboxSelection = () => {
  const rowElements = document.getElementsByClassName("file-row-select");
  for (let row of rowElements) {
    row.checked = false;
  }
  toggleCutCopyDeleteMenu(false);
};

const onCheckboxClickHandler = () => {
  const rowElements = document.getElementsByClassName("file-row-select");
  for (let row of rowElements) {
    if (row.checked) {
      toggleCutCopyDeleteMenu(true);
      return;
    }
  }
  toggleCutCopyDeleteMenu(false);
};

const toggleCutCopyDeleteMenu = (enable) => {
  if (enable) {
    document.getElementById("menuitem-cut")?.classList.remove("menu-disabled");
    document.getElementById("menuitem-copy")?.classList.remove("menu-disabled");
    document
      .getElementById("menuitem-delete")
      ?.classList.remove("menu-disabled");
  } else {
    document.getElementById("menuitem-cut")?.classList.add("menu-disabled");
    document.getElementById("menuitem-copy")?.classList.add("menu-disabled");
    document.getElementById("menuitem-delete")?.classList.add("menu-disabled");
  }
};

const storeCopyOrCutData = (verb, filePaths) => {
  clearCopyAndCutData();
  const dataForCutOrCopy = { verb: verb, sources: filePaths };
  localStorage.setItem("stagedForCutOrCopy", JSON.stringify(dataForCutOrCopy));
  document.getElementById("menuitem-paste")?.classList.remove("menu-disabled");
  clearCheckboxSelection();
};

const getCopyOrCutData = () => {
  return JSON.parse(localStorage.getItem("stagedForCutOrCopy"));
};

const toggleSelectAll = (checkBox) => {
  const rowElements = document.getElementsByClassName("file-row-select");

  for (let row of rowElements) {
    row.checked = checkBox.checked;
  }

  toggleCutCopyDeleteMenu(checkBox.checked);
};

const triggerCopy = () => {
  const rowElements = document.getElementsByClassName("file-row-select");
  let stagedForCopy = [];

  for (let row of rowElements) {
    if (row.checked) {
      stagedForCopy.push(row.value);
    }
  }
  storeCopyOrCutData("copy", stagedForCopy);
};

const triggerCut = () => {
  const rowElements = document.getElementsByClassName("file-row-select");
  let stagedForCut = [];

  for (let row of rowElements) {
    if (row.checked) {
      stagedForCut.push(row.value);
    }
  }
  storeCopyOrCutData("cut", stagedForCut);
};

const triggerPaste = () => {
  const dataForCutOrCopy = getCopyOrCutData();
  if (!dataForCutOrCopy) {
    return;
  }
  const url =
    dataForCutOrCopy?.verb == "cut" ? "/_execute/cut" : "/_execute/copy";
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      destination: location.pathname,
      sources: dataForCutOrCopy?.sources,
    }),
  })
    .then(() => {
      htmx.ajax("GET", location.pathname, {
        target: "#mainview",
        swap: "outerHTML",
      });
    })
    .catch((e) => {
      console.error("error while calling ", url, e);
    })
    .finally(() => {
      clearCopyAndCutData();
    });
};

const triggerDelete = () => {
  const rowElements = document.getElementsByClassName("file-row-select");
  let stagedForDelete = [];

  for (let row of rowElements) {
    if (row.checked) {
      stagedForDelete.push(row.value);
    }
  }
  if (stagedForDelete.length === 0) {
    return;
  }
  const url = "/_execute/remove";
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      filepaths: stagedForDelete,
    }),
  })
    .then(() => {
      htmx.ajax("GET", location.pathname, {
        target: "#mainview",
        swap: "outerHTML",
      });
    })
    .catch((e) => {
      console.error("error while calling ", url, e);
    });
};
