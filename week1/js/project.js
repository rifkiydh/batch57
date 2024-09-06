let dataBlog = [];
function addBlog(event) {
  event.preventDefault();

  let name = document.getElementById("projectName").value;
  let tanggalMulai = document.getElementById("startDate").value;
  let tanggalAkhir = document.getElementById("endDate").value;
  let description = document.getElementById("description").value;
  let image = document.getElementById("image").files;
  image = URL.createObjectURL(image[0]);
  console.log(image);

  let blog = {
    name: name,
    tanggalMulai: tanggalMulai,
    tanggalAkhir: tanggalAkhir,
    description: description,
    image,
    postAt: new Date(),
  };

  dataBlog.push(blog);

  renderBlog();

  document.getElementById("form-reset").reset();
}

function renderBlog() {
  document.getElementById("projectsContainer").innerHTML = ``;

  for (let i = 0; i < dataBlog.length; i++) {
    document.getElementById("projectsContainer").innerHTML += `
            <div style="width: 270px;margin: 5px 10px; box-shadow: 0px 0px 5px; border-radius: 10px;">
                <img src=" ${dataBlog[i].image} " alt="" style="width: 230px; border-radius: 10px; margin: 10px 20px ;">
                <h1 style="margin: 10px 20px;"> ${dataBlog[i].name} - ${dataBlog[i].tanggalMulai} </h1>
                <p style="margin: 10px 20px;"> ${dataBlog[i].tanggalAkhir} </p>
                <p style="margin: 10px 20px;">  ${dataBlog[i].description}.</p>
                <div style="margin: 10px 20px;">
                    <i class="fa-brands fa-node-js"></i>
                    <i class="fa-brands fa-react"></i>
                    <i class="fa-solid fa-angles-right"></i>
                    <i class="fa-solid fa-t"></i>
                </div>
                <p style=" float:right;margin-right: 10px;">${getDistanceTime(dataBlog[i].postAt)}</p>
                <br>
                <div style="display: flex; margin: 30px 0px;">
                    <a href="./detail.html" style="background-color: black; color: #ffffff; padding:2px 47px; margin: 0px 10px; text-decoration: none; border-radius: 5px;">edit</a>
                    <a href="#" style="background-color: black; color: #ffffff;padding: 1px 35px; text-decoration: none; border-radius: 5px;">delete</a>
                </div>
            </div>
        
            `;
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
