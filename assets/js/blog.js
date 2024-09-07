let dataBlog = [];
function addBlog(event) {
  event.preventDefault();
  let name = document.getElementById("name").value;
  let startDate = document.getElementById("start-date").value;
  let andDate = document.getElementById("and-date").value;
  let deskripsi = document.getElementById("deskripsi").value;
  let nodeJs = document.getElementById("nodejs").value;
  let reactJs = document.getElementById("reactjs").value;
  let php = document.getElementById("php").value;
  let java = document.getElementById("java").value;
  let image = document.getElementById("image").files;
  image = URL.createObjectURL(image[0]);

  let blog = {
    name,
    startDate,
    andDate,
    deskripsi,
    nodeJs,
    reactJs,
    php,
    java,
    image,
    postAt: new Date(),
  };

  dataBlog.push(blog);

  localStorage.setItem("dataBlog", JSON.stringify(dataBlog));
  renderBlog();
  document.getElementById("form").reset();
}

function renderBlog() {
  document.getElementById("projectContainer").innerHTML = "";
  for (let i = 0; i < dataBlog.length; i++) {
    document.getElementById("projectContainer").innerHTML += `
    <div class="card mb-3">
    <div class="row g-0">
      <div class="col-lg-4"><img src="${dataBlog[i].image}" class="img-fluid rounded-start h-100" alt="RIFKIYDH" /></div>
      <div class="col-md-8">
        <div class="card-body">
          <a href="/detail.html" class="text-decoration-none"><h5 class="card-title text-decoration-none text-black">${dataBlog[i].name}</h5></a>
          <p class="card-text">${dataBlog[i].deskripsi}</p>
        </div>
        <div class="card-body">
          <h5 class="card-title">Duration</h5>
          <p class="card-text"><i class="fa-solid fa-calendar-days fa-lg"></i>${dataBlog[i].startDate} - ${dataBlog[i].andDate}</p>
          <p class="card-text"><small class="text-body-secondary">${getDistanceTime(dataBlog[i].postAt)}</small></p>
        </div>
        <div class="card-body d-flex justify-content-center">
          <div class="card-body">
            <p class="card-text"><i class="fa-brands fa-node-js fa-lg"></i>${dataBlog[i].nodeJs}</p>
            <p><i class="fa-brands fa-react fa-lg"></i>${dataBlog[i].reactJs}</p>
          </div>
          <div class="card-body">
            <p class="card-text"><i class="fa-brands fa-php fa-lg"></i> ${dataBlog[i].php}</p>
            <p><i class="fa-brands fa-java fa-lg"></i>${dataBlog[i].java}</p>
          </div>
        </div>
        <div class="d-grid gap-2 d-md-block p-3">
          <a href=""><button class="btn btn-primary" type="button">Edit</button></a>
          <a href=""><button class="btn text-white bg-danger" type="button">Delete</button></a>
        </div>
      </div>
    </div>
  </div> `;
  }
}

function getFullDate(time) {
  let nameOfMonth = ["janiari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"];

  let date = time.getDate();
  let month = nameOfMonth[time.getMonth()];
  let year = time.getFullYear();
  return `${date} ${month} ${year}`;
}

function getDistanceTime(time) {
  let postTime = time;
  let currentTime = new Date();

  let distanceTime = currentTime - postTime;

  let miliSecond = 1000;
  let secondInHour = 3600;
  let hourInDay = 24;

  let distanceTimeInSecond = Math.floor(distanceTime / miliSecond);
  let distanceTimeInMinute = Math.floor(distanceTime / (miliSecond * 60));
  let distanceTimeInHour = Math.floor(distanceTime / (miliSecond * secondInHour));
  let distanceTimeInDay = Math.floor(distanceTime / (miliSecond * secondInHour * hourInDay));

  if (distanceTimeInDay > 0) {
    return `${distanceTimeInDay}days ago`;
  } else if (distanceTimeInHour > 0) {
    return `${distanceTimeInHour}hours ago`;
  } else if (distanceTimeInMinute > 0) {
    return `${distanceTimeInMinute}minutes ago`;
  } else {
    return `${distanceTimeInSecond}seconds ago`;
  }
}

setInterval(() => {
  renderBlog();
}, 10000);
