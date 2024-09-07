function getData(URL) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", URL, true);

    xhr.onerror = () => {
      reject("koneksi eror");
    };
    xhr.onload = () => {
      try {
        resolve(JSON.parse(xhr.responseText));
      } catch (error) {}
    };
    xhr.send("eksekusi");
  });
}

let testimonialHtml = ``;
async function allTestimonial() {
  try {
    const testimonialData = await getData("https://api.npoint.io/d67e92add5420b26a649");
    const testimonialHtml = testimonialData.map((renderTestimonial) => {
      return ` 
          <div class="col-md-3 mt-2 justify-content-center d-flex">
            <div class="card card border-dark shadow " style="width: 13rem; height:95%">
              <img src="${renderTestimonial.image}" class="card-img-top p-2" alt="andeganteng" style="height:50% !important" />
              <div class="mb-3">
                <div class="card-body">
                  <p class="card-text">${renderTestimonial.text}</p>
                </div>
                <div class="card-body" style="float: right">
                  <p class="card-text fw-bold">${renderTestimonial.name}</p>
                </div>
              </div>
            </div>
          </div>
      `;
    });
    document.getElementById("container").innerHTML = testimonialHtml.join("");
  } catch (eror) {
    console.log(eror);
  }
}

async function testimonialFilter(rating) {
  try {
    const testimonialData = await getData("https://api.npoint.io/d67e92add5420b26a649");
    const testimonialFilter = testimonialData.slice(0, rating);
    const testimonialHtml = testimonialFilter.map((renderTestimonial) => {
      return `
            <div class="col-md-3 mt-2 justify-content-center d-flex">
              <div class="card card border-dark shadow " style="width: 13rem; height:95%">
                <img src="${renderTestimonial.image}" class="card-img-top p-2" alt="andeganteng" style="height:50% !important" />
                <div class="mb-3">
                  <div class="card-body">
                    <p class="card-text">${renderTestimonial.text}</p>
                  </div>
                  <div class="card-body" style="float: right">
                    <p class="card-text fw-bold">${renderTestimonial.name}</p>
                  </div>
                </div>
              </div>
            </div>
         `;
    });
    document.getElementById("container").innerHTML = testimonialHtml.join("");
  } catch (eror) {
    console.log(eror);
  }
}

allTestimonial();
