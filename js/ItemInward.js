const dbName = "Store-DB";
const relationName = "Inward-Relation";
const Token = "764066664|7385821558786766262|764067669";
baseUrl = "https://api.jsonpowerdb.com:5567";

let typingTimer;
const doneTyping = 3500;

//form fields

const receiptNo = document.getElementById("receiptNo");
const rDate = document.getElementById("rDate");
const itemId = document.getElementById("itemId");
const quantity = document.getElementById("quantity");

//form buttons

const inwardNewBtn = document.getElementById("inwardNewBtn");
const inwardSaveBtn = document.getElementById("inwardSaveBtn");
const inwardEditBtn = document.getElementById("inwardEditBtn");
const inwardChangeBtn = document.getElementById("inwardChangeBtn");
const inwardResetBtn = document.getElementById("inwardResetBtn");

const inwardFirstBtn = document.getElementById("inwardFirstBtn");
const inwardPreviousBtn = document.getElementById("inwardPreviousBtn");
const inwardNextBtn = document.getElementById("inwardNextBtn");
const inwardLastBtn = document.getElementById("inwardLastBtn");

//check button

function checkButtons() {
  let currentInward = parseInt(localStorage.getItem("currentInward"));
  let lastInward = parseInt(localStorage.getItem("lastInward"));

  if (localStorage.getItem("currentInward") === null) {
    inwardFirstBtn.disabled = true;
    inwardPreviousBtn.disabled = true;
    inwardNextBtn.disabled = true;
    inwardLastBtn.disabled = true;
    return;
  }

  if (currentInward === 1 && lastInward === 1) {
    inwardFirstBtn.disabled = true;
    inwardPreviousBtn.disabled = true;
    inwardNextBtn.disabled = true;
    inwardLastBtn.disabled = true;
  }

  if (currentInward === 1) {
    inwardFirstBtn.disabled = true;
    inwardPreviousBtn.disabled = true;
  } else {
    inwardFirstBtn.disabled = false;
    inwardPreviousBtn.disabled = false;
  }

  if (currentInward === lastInward) {
    console.log("current last");
    inwardNextBtn.disabled = true;
    inwardLastBtn.disabled = true;
  } else {
    inwardNextBtn.disabled = false;
    inwardLastBtn.disabled = false;
  }
}

// FORM VALIDATION

function validateFormFields() {
  let isValid = true;

  document.querySelectorAll(".errormsg").forEach((p) => (p.innerText = ""));

  if (receiptNo.value.trim() === "") {
    document.getElementById("receiptNoError").innerText =
      "Item ID should not be empty.";
    isValid = false;
  }
  if (rDate.value.trim() === "") {
    document.getElementById("rDateError").innerText =
      "Item Name should not be empty.";
    isValid = false;
  }
  if (itemId.value.trim() === "") {
    document.getElementById("itemIdError").innerText =
      "Item ID should not be empty.";
    isValid = false;
  }
  if (quantity.value.trim() === "") {
    document.getElementById("quantityError").innerText =
      "quantity should not be empty.";
    isValid = false;
  }

  return isValid;
}

// page load function
window.addEventListener("load", () => {
  let current = parseInt(localStorage.getItem("currentInward"));

  if (localStorage.getItem("currentInward") === null) {
    inwardNewBtn.disabled = true;
    inwardSaveBtn.disabled = false;
    inwardEditBtn.disabled = true;
    inwardChangeBtn.disabled = true;
    inwardResetBtn.disabled = false;
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
    let resultObj = executeCommandAtGivenBaseUrl(req, baseUrl, "/api/irl");

    fillForm(resultObj);
    disableFields();
    jQuery.ajaxSetup({ async: true });
    if (validateFormFields()) {
      inwardSaveBtn.disabled = true;
      inwardChangeBtn.disabled = true;
      inwardResetBtn.disabled = true;
      checkButtons();
    } else {
      inwardNewBtn.disabled = true;
      inwardEditBtn.disabled = true;
      inwardChangeBtn.disabled = true;
      checkButtons();
    }
  } catch (err) {
    console.log(err);
  }
});

// FORM RESET FUNCTION

function resetForm() {
  receiptNo.value = "";
  rDate.value = "";
  itemId.value = "";
  quantity.value = "";
  receiptNo.focus();
}

// fill data to form function

function fillForm(res) {
  let data = JSON.parse(res.data);
  let record = data.record;

  receiptNo.value = record.ReceiptNo;
  rDate.value = record.RDate;
  itemId.value = record.ItemId;
  quantity.value = record.Quantity;
}

// disable inputs
function disableFields() {
  receiptNo.disabled = true;
  rDate.disabled = true;
  itemId.disabled = true;
  quantity.disabled = true;
}

// enable inputs
function enableFields() {
  receiptNo.disabled = false;
  rDate.disabled = false;
  itemId.disabled = false;
  quantity.disabled = false;
  receiptNo.focus();
}
//check if record exist of that key
function ifExist() {
  alert("finding if id already exist..");
  try {
    const data = {
      ReceiptNo: receiptNo.value.trim(),
    };
    let req = createGET_BY_KEYRequest(
      Token,
      dbName,
      relationName,
      JSON.stringify(data),
      true,
      true
    );
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/irl");
    let isexists = resultObj === 200 ? true : false;
    jQuery.ajaxSetup({ async: true });
    if (isexists) {
      return resultObj;
    } else {
      return false;
    }
  } catch (err) {
    alert(err);
  }
}

receiptNo.addEventListener("change", (e) => {
  disableFields();

  console.log(e.target.value);
  let isSuccess = ifExist();
  if (isSuccess) {
    alert("id already exist.");
    fillForm(isSuccess);
    disableFields();
    inwardNewBtn.disabled = false;
    inwardSaveBtn.disabled = true;
    inwardEditBtn.disabled = false;
    inwardChangeBtn.disabled = true;
    inwardResetBtn.disabled = true;
    checkButtons();
  } else {
    alert("id does not exist.");
    receiptNo.focus();
    enableFields();
    inwardNewBtn.disabled = true;
    inwardSaveBtn.disabled = false;
    inwardResetBtn.disabled = false;
    inwardEditBtn.disabled = true;
    inwardChangeBtn.disabled = true;
    inwardFirstBtn.disabled = true;
    inwardPreviousBtn.disabled = true;
    inwardNextBtn.disabled = true;
    inwardLastBtn.disabled = true;
  }
});

// for item id checking  and updating
function ifIDExist() {
  try {
    console.log("finding if id already exist..");

    const data = { ItemId: itemId.value.trim() };

    // get the record by ItemId
    let req = createGET_BY_KEYRequest(
      Token,
      dbName,
      "Item-Relation",
      JSON.stringify(data),
      true,
      true
    );

    jQuery.ajaxSetup({ async: false });
    let rawRes = executeCommand(req, "/api/irl");
    jQuery.ajaxSetup({ async: true });

    // parse the record and rec no
    let updateItem = JSON.parse(rawRes.data);
    let recNo = updateItem.rec_no; // extract rec no

    // prepare updated data
    const itemQuality = Number(quantity.value.trim());
    const ItemData = {
      ItemId: updateItem.record.ItemId,
      ItemName: updateItem.record.ItemName,
      OpeningStocks: Number(updateItem.record.OpeningStocks) + itemQuality,
      UOM: updateItem.record.UOM,
    };

    // update using rec no
    const itemReq = createUPDATERecordRequest(
      Token,
      JSON.stringify(ItemData),
      dbName,
      "Item-Relation",
      recNo
    );

    jQuery.ajaxSetup({ async: false });
    let resultObj = executeCommand(itemReq, "/api/iml");
    console.log(resultObj);
    jQuery.ajaxSetup({ async: true });

    // Parse outer response
    let res = typeof rawRes === "string" ? JSON.parse(rawRes) : rawRes;
    console.log("Response:", res);

    if (res && res.status === 200 && res.data) {
      // Parse inner record
      let innerData = JSON.parse(res.data);
      console.log("Inner Data:", innerData);

      return innerData.record; // item exists, return record
    } else {
      return false; // item not found
    }
  } catch (err) {
    console.error("Error in ifIDExist:", err);
    return false;
  }
}

itemId.addEventListener("change", (e) => {
  disableFields();

  console.log("Checking ID:", e.target.value);

  let record = ifIDExist();

  if (record) {
    alert("Item is - " + record.ItemName + " - and it already exist");
    enableFields();
    itemId.focus();
  } else {
    alert("ID does not exists!");
    enableFields();
    e.target.value = "";
  }
});

// FORM RESET FUNCTION

function resetForm() {
  receiptNo.value = "";
  rDate.value = "";
  itemId.value = "";
  quantity.value = "";
  receiptNo.focus();
}

// new function
function inwardNew() {
  resetForm();
  enableFields();
  inwardNewBtn.disabled = true;
  inwardSaveBtn.disabled = false;
  inwardResetBtn.disabled = false;
  inwardEditBtn.disabled = true;
  inwardChangeBtn.disabled = true;
  inwardFirstBtn.disabled = true;
  inwardPreviousBtn.disabled = true;
  inwardNextBtn.disabled = true;
  inwardLastBtn.disabled = true;
}

// new button
inwardNewBtn.addEventListener("click", () => {
  inwardNew();
});

//save button function
inwardSaveBtn.addEventListener("click", () => {
  if (!validateFormFields()) {
    return;
  }
  alert("trying to save data");
  ifIDExist();
  const data = {
    ReceiptNo: receiptNo.value.trim(),
    RDate: rDate.value.trim(),
    ItemId: itemId.value.trim(),
    Quantity: quantity.value.trim(),
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

    inwardNewBtn.disabled = false;
    inwardSaveBtn.disabled = true;
    inwardResetBtn.disabled = true;
    inwardEditBtn.disabled = false;
    inwardChangeBtn.disabled = true;
    checkButtons();

    let firstInward = localStorage.getItem("firstInward");
    let lastInward = localStorage.getItem("lastInward");

    if (!firstInward) {
      localStorage.setItem("firstInward", 1);
      firstInward = 1;
    }

    lastInward = lastInward ? parseInt(lastInward) + 1 : 1;
    localStorage.setItem("lastInward", lastInward);
    localStorage.setItem("currentInward", lastInward);

    disableFields();
  } catch (error) {
    jQuery.ajaxSetup({ async: true });
    console.error("Error while saving data:", error);
    alert("An error occurred while saving data. Please try again.");
  }
});

//edit function
inwardEditBtn.addEventListener("click", () => {
  enableFields();
  inwardNewBtn.disabled = true;
  inwardSaveBtn.disabled = true;
  inwardEditBtn.disabled = true;
  inwardChangeBtn.disabled = false;
  inwardResetBtn.disabled = false;
  inwardFirstBtn.disabled = true;
  inwardPreviousBtn.disabled = true;
  inwardNextBtn.disabled = true;
  inwardLastBtn.disabled = true;
});

//change function
inwardChangeBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentInward"));
  console.log("change btn clicked");

  if (!validateFormFields()) {
    return;
  }
  ifIDExist();
  alert("trying to update ");

  const data = {
    ReceiptNo: receiptNo.value.trim(),
    RDate: rDate.value.trim(),
    ItemId: itemId.value.trim(),
    Quantity: quantity.value.trim(),
  };

  try {
    const req = createUPDATERecordRequest(
      Token,
      JSON.stringify(data),
      dbName,
      relationName,
      current
    );
    console.log(req);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/iml");
    console.log(resultObj);
    alert("Updated record.");
    jQuery.ajaxSetup({ async: true });
    disableFields();
    inwardNewBtn.disabled = false;
    inwardSaveBtn.disabled = true;
    inwardResetBtn.disabled = true;
    inwardEditBtn.disabled = false;
    inwardChangeBtn.disabled = true;
    checkButtons();
  } catch (error) {
    jQuery.ajaxSetup({ async: true });
    console.error("Error while updating record:", error);
    alert("An error occurred while updating the record. Please try again.");
  }
});

// reset function
inwardResetBtn.addEventListener("click", () => {
  resetForm();
  location.reload();
});

inwardFirstBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentInward"));
  let first = parseInt(localStorage.getItem("firstInward"));
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
    localStorage.setItem("currentInward", current);
    inwardFirstBtn.disabled = true;
    inwardPreviousBtn.disabled = true;
    inwardNextBtn.disabled = false;
    inwardLastBtn.disabled = false;
    disableFields();
  } catch (err) {
    console.log("error");
  }
});

// previous button

inwardPreviousBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentInward"));
  let first = parseInt(localStorage.getItem("firstInward"));
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
      inwardFirstBtn.disabled = true;
      inwardPreviousBtn.disabled = true;
      inwardNextBtn.disabled = false;
      inwardLastBtn.disabled = false;
    }
    if (first < current) {
      inwardFirstBtn.disabled = false;
      inwardPreviousBtn.disabled = false;
      inwardNextBtn.disabled = false;
      inwardLastBtn.disabled = false;
    }
    disableFields();

    localStorage.setItem("currentInward", current);
  } catch (err) {
    console.log("error");
  }
});

// next button

inwardNextBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentInward"));
  let last = parseInt(localStorage.getItem("lastInward"));

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
      inwardNextBtn.disabled = true;
      inwardLastBtn.disabled = true;
      inwardFirstBtn.disabled = false;
      inwardPreviousBtn.disabled = false;
    } else if (last > current) {
      inwardNextBtn.disabled = false;
      inwardLastBtn.disabled = false;
      inwardFirstBtn.disabled = false;
      inwardPreviousBtn.disabled = false;
    }
    disableFields();

    localStorage.setItem("currentInward", current);
  } catch (err) {
    console.log("error");
  }
});

// last button

inwardLastBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentInward"));
  let last = parseInt(localStorage.getItem("lastInward"));

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
    inwardFirstBtn.disabled = false;
    inwardPreviousBtn.disabled = false;
    inwardNextBtn.disabled = true;
    inwardLastBtn.disabled = true;

    current = last;
    localStorage.setItem("currentInward", current);
    disableFields();
  } catch (err) {
    console.log("error");
  }
});
