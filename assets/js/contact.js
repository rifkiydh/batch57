function addBlog(event) {
  event.preventDefault();
  let name = document.getElementById("name").value;
  let email = document.getElementById("inputEmail").value;
  let number = document.getElementById("number").value;
  let position = document.getElementById("position").value;
  let deskripsi = document.getElementById("deskripsi").value;
  let formData = { name, email, number, position, deskripsi };

  document.getElementById("name").value = "";
  document.getElementById("inputEmail").value = "";
  document.getElementById("number").value = "";
  document.getElementById("deskripsi").value = "";
  document.getElementById("position").value = "";

  if (name == "") {
    return alert("your name blank");
  } else if (email == "") {
    return alert("your email blank");
  } else if (number == "") {
    return alert("your number blank");
  } else if (position == "") {
    return alert("your position blank");
  } else if (deskripsi == "") {
    return alert("your massage blank");
  }
  //   console.log(formData);

  let myEmail = "rifkiydh@gmail.com";
  let a = document.createElement("a");
  a.href = `mailto:${myEmail}?subject=${""}&body=${deskripsi}`;
  a.click();
}
