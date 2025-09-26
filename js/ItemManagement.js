const dbName = "Store-DB";
const relationName = "Item-Relation";
const Token = "764066664|7385821558786766262|764067669";
baseUrl = "https://api.jsonpowerdb.com:5567";

let typingTimer;
const doneTyping = 3500;

//form fields

const itemId = document.getElementById("itemId");
const itemName = document.getElementById("itemName");
const openingStocks = document.getElementById("openingStocks");
const UOM = document.getElementById("UOM");

//form buttons

const itemNewBtn = document.getElementById("itemNewBtn");
const itemSaveBtn = document.getElementById("itemSaveBtn");
const itemEditBtn = document.getElementById("itemEditBtn");
const itemChangeBtn = document.getElementById("itemChangeBtn");
const itemResetBtn = document.getElementById("itemResetBtn");

const itemFirstBtn = document.getElementById("itemFirstBtn");
const itemPreviousBtn = document.getElementById("itemPreviousBtn");
const itemNextBtn = document.getElementById("itemNextBtn");
const itemLastBtn = document.getElementById("itemLastBtn");

//check button

function checkButtons() {
  let currentItem = parseInt(localStorage.getItem("currentItem"));
  let lastItem = parseInt(localStorage.getItem("lastItem"));

  if (localStorage.getItem("currentItem") === null) {
    itemFirstBtn.disabled = true;
    itemPreviousBtn.disabled = true;
    itemNextBtn.disabled = true;
    itemLastBtn.disabled = true;
    return;
  }
   if (currentItem === 1 && lastItem === 1) {
    itemFirstBtn.disabled = true;
    itemPreviousBtn.disabled = true;
    itemNextBtn.disabled = true;
    itemLastBtn.disabled = true;
  }
  if (currentItem === 1) {
    itemFirstBtn.disabled = true;
    itemPreviousBtn.disabled = true;
  } else {
    itemFirstBtn.disabled = false;
    itemPreviousBtn.disabled = false;
  }

  if (currentItem === lastItem) {
    itemNextBtn.disabled = true;
    itemLastBtn.disabled = true;
  } else {
    itemNextBtn.disabled = false;
    itemLastBtn.disabled = false;
  }
}

// FORM VALIDATION

function validateFormFields() {
  let isValid = true;
  document.querySelectorAll(".errormsg").forEach((p) => (p.innerText = ""));

  if (!itemId.value.trim()) {
    itemIdError.innerText = "Item ID required.";
    isValid = false;
  }
  if (!itemName.value.trim()) {
    itemNameError.innerText = "Raw Material Name required.";
    isValid = false;
  }
  if (!openingStocks.value.trim()) {
    osError.innerText = "Opening Stock required.";
    isValid = false;
  } else if (!/^\d{1,12}(\.\d{1,3})?$/.test(openingStocks.value.trim())) {
    osError.innerText = "Max 15 digits, up to 3 decimals.";
    isValid = false;
  }
  if (!UOM.value.trim()) {
    UOMError.innerText = "UOM required.";
    isValid = false;
  } else if (UOM.value.trim().length > 10) {
    UOMError.innerText = "Max 10 characters.";
    isValid = false;
  }

  return isValid;
}

// page load function
window.addEventListener("load", () => {
  let current = parseInt(localStorage.getItem("currentItem"));
  if (localStorage.getItem("currentItem") === null) {
    itemNewBtn.disabled = true;
    itemSaveBtn.disabled = false;
    itemEditBtn.disabled = true;
    itemChangeBtn.disabled = true;
    itemResetBtn.disabled = false;
    checkButtons();
    return;
  }

  try {
    jQuery.ajaxSetup({ async: false });
    const req = createGET_BY_RECORDRequest(
      Token,
      dbName,
      relationName,
      current,
      true,
      true
    );
    console.log(req);
    let resultObj = executeCommandAtGivenBaseUrl(req, baseUrl, "/api/irl");

    jQuery.ajaxSetup({ async: true });

    fillForm(resultObj);
    itemNewBtn.disabled = false;
    itemSaveBtn.disabled = true;
    itemEditBtn.disabled = false;
    itemChangeBtn.disabled = true;
    itemResetBtn.disabled = true;
    checkButtons();
  } catch (err) {
    console.log(err);
  }
});

//check if record exist of that key

function ifExist() {
  try {
    console.log("Checking if ID exists...");
    const data = { ItemId: itemId.value.trim() };

    let req = createGET_BY_KEYRequest(
      Token,
      dbName,
      relationName,
      JSON.stringify(data),
      true,
      true
    );

    jQuery.ajaxSetup({ async: false });
    let rawRes = executeCommand(req, "/api/irl");
    jQuery.ajaxSetup({ async: true });

    // Parse outer response
    let res = typeof rawRes === "string" ? JSON.parse(rawRes) : rawRes;
    console.log("Response:", res);

    if (res && res.status === 200 && res.data) {
      let innerData = JSON.parse(res.data); // parse inner string
      return innerData.record; // return record if exists
    }
    return false;
  } catch (err) {
    console.error("Error in ifExist:", err);
    return false;
  }
}

// Fire when user finishes typing and leaves the field
itemId.addEventListener("change", () => {
  disableFields();

  let record = ifExist();
  if (record) {
    alert("ID already exists.");
    fillForm(record); // fill form with record

    itemId.focus();
    itemNewBtn.disabled = false;
    itemSaveBtn.disabled = true;
    itemEditBtn.disabled = false;
    itemChangeBtn.disabled = true;
    itemResetBtn.disabled = true;
    checkButtons();
  } else {
    alert("ID does not exist.");
    enableFields();

    itemNewBtn.disabled = true;
    itemSaveBtn.disabled = false;
    itemResetBtn.disabled = false;
    itemEditBtn.disabled = true;
    itemChangeBtn.disabled = true;
    itemFirstBtn.disabled = true;
    itemPreviousBtn.disabled = true;
    itemNextBtn.disabled = true;
    itemLastBtn.disabled = true;
  }
});

// FORM RESET FUNCTION

function resetForm() {
  itemId.value = "";
  itemName.value = "";
  openingStocks.value = "";
  UOM.value = "";
  itemId.focus();
}

// fill data to form function

function fillForm(res) {
  let data = JSON.parse(res.data);
  let record = data.record;

  itemId.value = record.ItemId;
  itemName.value = record.ItemName;
  openingStocks.value = record.OpeningStocks;
  UOM.value = record.UOM;
}

// disable inputs
function disableFields() {
  itemId.disabled = true;
  itemName.disabled = true;
  openingStocks.disabled = true;
  UOM.disabled = true;
}

// enable inputs
function enableFields() {
  itemId.disabled = false;
  itemName.disabled = false;
  openingStocks.disabled = false;
  UOM.disabled = false;
  itemId.focus();
}

// new function
function newItem() {
  resetForm();
  enableFields();
  itemNewBtn.disabled = true;
  itemSaveBtn.disabled = false;
  itemResetBtn.disabled = false;
  itemEditBtn.disabled = true;
  itemChangeBtn.disabled = true;
  itemFirstBtn.disabled = true;
  itemPreviousBtn.disabled = true;
  itemNextBtn.disabled = true;
  itemLastBtn.disabled = true;
}

// new button
itemNewBtn.addEventListener("click", () => {
  newItem();
});

//save button function
itemSaveBtn.addEventListener("click", () => {
  if (!validateFormFields()) {
    return;
  }
  alert("trying to save data");
  const data = {
    ItemId: itemId.value.trim(),
    ItemName: itemName.value.trim(),
    OpeningStocks: openingStocks.value.trim(),
    UOM: UOM.value.trim(),
  };
  try {
    const req = createPUTRequest(
      Token,
      JSON.stringify(data),
      dbName,
      relationName
    );

    jQuery.ajaxSetup({ async: false });
    let resultObj = executeCommandAtGivenBaseUrl(req, baseUrl, "/api/iml");
    alert("Data saved successfully");
    jQuery.ajaxSetup({ async: true });

    itemNewBtn.disabled = false;
    itemSaveBtn.disabled = true;
    itemResetBtn.disabled = true;
    itemEditBtn.disabled = false;
    itemChangeBtn.disabled = true;
    checkButtons();

    let firstItem = localStorage.getItem("firstItem");
    let lastItem = localStorage.getItem("lastItem");

    if (!firstItem) {
      localStorage.setItem("firstItem", 1);
      firstItem = 1;
    }

    lastItem = lastItem ? parseInt(lastItem) + 1 : 1;
    localStorage.setItem("lastItem", lastItem);
    localStorage.setItem("currentItem", lastItem);

    disableFields();
  } catch (error) {
    jQuery.ajaxSetup({ async: true });
    console.error("Error while saving data:", error);
    alert("An error occurred while saving data. Please try again.");
  }
});

//edit function
itemEditBtn.addEventListener("click", () => {
  enableFields();
  itemNewBtn.disabled = true;
  itemSaveBtn.disabled = true;
  itemEditBtn.disabled = true;
  itemChangeBtn.disabled = false;
  itemResetBtn.disabled = false;
  itemFirstBtn.disabled = true;
  itemPreviousBtn.disabled = true;
  itemNextBtn.disabled = true;
  itemLastBtn.disabled = true;
});

//change function
itemChangeBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentItem"));
  console.log("change btn clicked");

  if (!validateFormFields()) {
    return;
  }
  alert("trying to update ");

  const data = {
    ItemId: itemId.value.trim(),
    ItemName: itemName.value.trim(),
    OpeningStocks: openingStocks.value.trim(),
    UOM: UOM.value.trim(),
  };

  try {
    const req = createUPDATERecordRequest(
      Token,
      JSON.stringify(data),
      dbName,
      relationName,
      current
    );

    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/iml");
    console.log(resultObj);
    alert("Updated record.");
    jQuery.ajaxSetup({ async: true });
    disableFields();
    itemNewBtn.disabled = false;
    itemSaveBtn.disabled = true;
    itemResetBtn.disabled = true;
    itemEditBtn.disabled = false;
    itemChangeBtn.disabled = true;
    checkButtons();
  } catch (error) {
    jQuery.ajaxSetup({ async: true });
    console.error("Error while updating record:", error);
    alert("An error occurred while updating the record. Please try again.");
  }
});

// reset function
itemResetBtn.addEventListener("click", () => {
  resetForm();
  checkButtons();
  location.reload();
});

itemFirstBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentItem"));
  let first = parseInt(localStorage.getItem("firstItem"));
  try {
    const req = createFIRST_RECORDRequest(
      Token,
      dbName,
      relationName,
      true,
      true
    );
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/irl");

    fillForm(resultObj);
    jQuery.ajaxSetup({ async: true });
    current = first;
    localStorage.setItem("currentItem", current);
    itemFirstBtn.disabled = true;
    itemPreviousBtn.disabled = true;
    itemNextBtn.disabled = false;
    itemLastBtn.disabled = false;
    disableFields();
  } catch (err) {
    console.log("error");
  }
});

// previous button

itemPreviousBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentItem"));
  let first = parseInt(localStorage.getItem("firstItem"));
  try {
    const req = createPREV_RECORDRequest(
      Token,
      dbName,
      relationName,
      current,
      true,
      true
    );
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/irl");
    fillForm(resultObj);
    jQuery.ajaxSetup({ async: true });
    current -= 1;
    if (first === current) {
      itemFirstBtn.disabled = true;
      itemPreviousBtn.disabled = true;
      itemNextBtn.disabled = false;
      itemLastBtn.disabled = false;
    }
    if (first < current) {
      itemFirstBtn.disabled = false;
      itemPreviousBtn.disabled = false;
      itemNextBtn.disabled = false;
      itemLastBtn.disabled = false;
    }
    disableFields();

    localStorage.setItem("currentItem", current);
  } catch (err) {
    console.log("error");
  }
});

// next button

itemNextBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentItem"));
  let last = parseInt(localStorage.getItem("lastItem"));

  try {
    const req = createNEXT_RECORDRequest(
      Token,
      dbName,
      relationName,
      current,
      true,
      true
    );
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/irl");
    fillForm(resultObj);
    jQuery.ajaxSetup({ async: true });
    current = current + 1;
    //checking button
    if (current === last) {
      itemNextBtn.disabled = true;
      itemLastBtn.disabled = true;
      itemFirstBtn.disabled = false;
      itemPreviousBtn.disabled = false;
    } else if (last > current) {
      itemNextBtn.disabled = false;
      itemLastBtn.disabled = false;
      itemFirstBtn.disabled = false;
      itemPreviousBtn.disabled = false;
    }
    disableFields();

    localStorage.setItem("currentItem", current);
  } catch (err) {
    console.log("error");
  }
});

// last button

itemLastBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentItem"));
  let last = parseInt(localStorage.getItem("lastItem"));

  try {
    const req = createLAST_RECORDRequest(
      Token,
      dbName,
      relationName,
      true,
      true
    );
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/irl");
    fillForm(resultObj);
    jQuery.ajaxSetup({ async: true });
    itemFirstBtn.disabled = false;
    itemPreviousBtn.disabled = false;
    itemNextBtn.disabled = true;
    itemLastBtn.disabled = true;

    current = last;
    localStorage.setItem("currentItem", current);
    disableFields();
  } catch (err) {
    console.log("error");
  }
});
