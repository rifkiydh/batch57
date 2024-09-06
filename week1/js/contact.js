function getData() {
  let name = document.getElementById("nameInput").value;
  let email = document.getElementById("emailInput").value;
  let number = document.getElementById("numberInput").value;
  let position = document.getElementById("position").value;
  let address = document.getElementById("address").value;
  let formData = { name, email, number, position, address };

  if (name === "") {
    alert("Your name is blank");
    return;
  }
  if (email === "") {
    alert("Your email is blank");
    return;
  }
  if (number === "") {
    alert("Your number is blank");
    return;
  }
  if (position === "Select Option") {
    alert("Your position is blank");
    return;
  }
  if (address === "") {
    alert("Your address is blank");
    return;
  }

  console.log(formData);

  let myEmail = "rifkiydh@gmail.com";
  let subject = "Introduction";
  let a = document.createElement("a");
  a.href = `mailto:${myEmail}?subject=${subject}&body=Hello, my name is ${name}`;
  a.click();

  // Clear form
  document.getElementById("nameInput").value = "";
  document.getElementById("emailInput").value = "";
  document.getElementById("numberInput").value = "";
  document.getElementById("position").value = "Select Option";
  document.getElementById("address").value = "";
}

function btnHmbrgr() {
  const element = document.getElementById("humberger-list");
  element.classList.toggle("active");
}
