let sideBarSection = $(".sideBarSection").outerWidth();
let iconToggle = document.querySelector("#iconToggle");
let sideBarLinks = $(".sideBarLinks li");
let viewContent = document.getElementById("viewContent");
let search = document.getElementById("search");





$(document).ready(() => {
  $(".loading-screen").fadeOut(1000, function () {
      $("body").css("overflow", "auto")
  })
});




//  S T A R T  - S I D E - B A R - S E C T I O N
$(document).ready(function () {
  $(".sideBar").animate(
    {
      left: -sideBarSection,
    },
    500
  );
  $(iconToggle).click(function (e) {
    console.log(sideBarSection);
    if ($(".sideBar").css("left") == "0px") {
      $(".sideBar").animate(
        {
          left: -sideBarSection,
        },
        500
      );

      $(iconToggle).removeClass("fa-xmark");
      $(iconToggle).addClass("fa-bars");

      $(sideBarLinks).animate(
        {
          top: 300,
        },
        500
      );
    } else {
      $(".sideBar").animate(
        {
          left: "0px",
        },
        500
      );

      $(iconToggle).removeClass("fa-bars");
      $(iconToggle).addClass("fa-xmark");

      for (let i = 0; i < sideBarLinks.length; i++) {
        $(sideBarLinks)
          .eq(i)
          .animate(
            {
              top: 0,
            },
            (i + 5) * 100
          );
      }
    }
  });
  $(sideBarLinks).click(function () {
    $(".sideBar").animate(
      {
        left: -sideBarSection,
      },
      500
    );
    $(iconToggle).removeClass("fa-xmark");
    $(iconToggle).addClass("fa-bars");

    $(sideBarLinks).animate(
      {
        top: 300,
      },
      500
    );
  });
  //  E N D - S I D E - B A R - S E C T I O N
  getCategories();
});

// S T A R T - F U N C T I O N - F O R - D I S P L A Y - D A T A
function displayMeals(arr) {
  let mealData = "";

  for (let i = 0; i < arr.length; i++) {
    mealData += `
      <div class="col-md-3">
              <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 point">
                  <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                  <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                      <h3>${arr[i].strMeal}</h3>
                  </div>
              </div>
      </div>
      `;
  }

  viewContent.innerHTML = mealData;
}
// E N D - F U N C T I O N - F O R - D I S P L A Y - D A T A

// S T A R T - F U N C T I O N - F O R - D E T A I L S - M E A L S
async function getMealDetails(id) {
  viewContent.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  search.innerHTML = "";
  let mealDetails = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  mealDetails = await mealDetails.json();
  console.log(mealDetails);
  displayMealDetails(mealDetails.meals[0]);
  $(".loading-screen").fadeOut(300);
}

function displayMealDetails(meal) {
  search.innerHTML = "";

  let recipes = ``;

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      recipes += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  console.log(meal.strTags?.split(","));
  let tags = meal.strTags?.split(",");
  if (!tags) {
    tags = [];
  }

  let tagsLi = "";
  for (let i = 0; i < tags.length; i++) {
    tagsLi += `
      <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  let mealDetail = `
  <div class="col-md-4">
              <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                  alt="">
                  <h2>${meal.strMeal}</h2>
          </div>
          <div class="col-md-8">
              <h2>Instructions</h2>
              <p>${meal.strInstructions}</p>
              <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
              <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
              <h3>Recipes :</h3>
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${recipes}
              </ul>

              <h3>Tags :</h3>
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${tagsLi}
              </ul>

              <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
              <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
          </div>`;

  viewContent.innerHTML = mealDetail;
}
// E N D - F U N C T I O N - F O R - D E T A I L S - M E A L S


// S T A R T - S E A R C H - S E C T I O N 
function showSearch() {
  search.innerHTML = `
  <div class="row py-4 ">
      <div class="col-md-6 ">
          <input onkeyup="searchByName(this.value)" class="searchInput form-control bg-transparent text-white" type="text" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
          <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="searchInput form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
      </div>
  </div>`;

  viewContent.innerHTML = "";
}

$(sideBarLinks[0]).click(function () {
  showSearch();
});

 //F U N C T I O N - F O R - S E A R C H - BY - N A M E
async function searchByName(x) {
  viewContent.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${x}`
  );
  response = await response.json();
  console.log(response.meals);
  response.meals ? displayMeals(response.meals) : null;
  $(".loading-screen").fadeOut(300);
}
//F U N C T I O N - F O R - S E A R C H - BY - O N E - L E T T E R - N A M E
async function searchByFLetter(val) {
  viewContent.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  val == "" ? (val = "a") : "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${val}`
  );
  response = await response.json();

  displayMeals(response.meals);
  $(".loading-screen").fadeOut(300);
}
// E N D - S E A R C H - S E C T I O N 

//  S T A R T - C A T E G O R I E S - S E C T I O N  
async function getCategories() {
  viewContent.innerHTML = "";
  $(".loading-screen").fadeIn(300);
  search.innerHTML = "";

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  response = await response.json();
  console.log(response);
  displayCategories(response.categories);
  $(".loading-screen").fadeOut(300);
}

$(sideBarLinks[1]).click(function () {
  getCategories();
});
function displayCategories(cate) {
  let category = "";

  for (let i = 0; i < cate.length; i++) {
    category += `
    <div class="col-md-3">
            <div onclick="getCategoryMeals('${cate[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${cate[i].strCategoryThumb}" alt="" srcset="">
                <div class="meal-layer position-absolute text-black p-2">
                    <h3 class="mt-5">${cate[i].strCategory}</h3>
                </div>
            </div>
    </div>
    `;
  }
  viewContent.innerHTML = category 
}

async function getCategoryMeals(category) {
  viewContent.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  response = await response.json();
  console.log(response.meals);
  displayMeals(response.meals.slice(0, 20));
  $(".loading-screen").fadeOut(300);
}
//  E N D - C A T E G O R I E S - S E C T I O N

// S T A R T - A R E A - S E C T I O N
async function getArea() {
  viewContent.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  search.innerHTML = "";

  let areasData = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  areasData = await areasData.json();
  console.log(areasData.meals);

  displayArea(areasData.meals);
  $(".loading-screen").fadeOut(300);
}

$(sideBarLinks[2]).click(function () {
  getArea();
});
function displayArea(area) {
  let areaBox = ``;
  for (let i = 0; i < area.length; i++) {
    areaBox += `<div class="col-md-3 text-white">
    <div onclick="getAreaMeals('${area[i].strArea}')" class="rounded-2 text-center point">
            <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h3>${area[i].strArea}</h3>
    </div>
</div>`;
  }
  viewContent.innerHTML = areaBox;
}
async function getAreaMeals(area) {
  viewContent.innerHTML = "";
  $(".loading-screen").fadeIn(300);
  search.innerHTML = "";

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  response = await response.json();
  console.log(response.meals);
  displayMeals(response.meals.slice(0, 20));
  $(".loading-screen").fadeOut(300);
}
// E N D - A R E A - S E C T I O N

// S T A R T - I N G R E D I E N T S - S E C T I O N
async function getIngredients() {
  viewContent.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  search.innerHTML = "";

  let ingredientsData = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  ingredientsData = await ingredientsData.json();
  console.log(ingredientsData.meals);

  displayIngredients(ingredientsData.meals.slice(0, 20));
  $(".loading-screen").fadeOut(300);
}
$(sideBarLinks[3]).click(function () {
  getIngredients();
});

function displayIngredients(arr) {
  let ingredientsBox = "";

  for (let i = 0; i < arr.length; i++) {
    ingredientsBox += `
      <div class="col-md-3 text-white">
              <div onclick="getIngredientsMeals('${
                arr[i].strIngredient
              }')" class="rounded-2 text-center point">
                      <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                      <h3>${arr[i].strIngredient}</h3>
                      <p>${arr[i].strDescription
                        .split(" ")
                        .slice(0, 20)
                        .join(" ")}</p>
              </div>
      </div>
      `;
  }

  viewContent.innerHTML = ingredientsBox;
}
async function getIngredientsMeals(ingredients) {
  viewContent.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  response = await response.json();

  displayMeals(response.meals.slice(0, 20));
  $(".loading-screen").fadeOut(300);
}
// E N D  - I N G R E D I E N T S  - S E C T I O N

// S T A R T - C O N T A C T - US - S E C T I O N
function getContactUs() {
  viewContent.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
  <div class="container w-75 text-center">
      <div class="row g-4">
          <div class="col-md-6">
              <input id="inputName" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
              <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Special characters and numbers not allowed
              </div>
          </div>
          <div class="col-md-6">
              <input id="inputEmail" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
              <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Email not valid *exemple@yyy.zzz
              </div>
          </div>
          <div class="col-md-6">
              <input id="inputPhone" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
              <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid Phone Number
              </div>
          </div>
          <div class="col-md-6">
              <input id="inputAge" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
              <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid age
              </div>
          </div>
          <div class="col-md-6">
              <input  id="inputPass" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
              <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid password *Minimum eight characters, at least one letter and one number:*
              </div>
          </div>
          <div class="col-md-6">
              <input  id="inputRePass" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
              <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid repassword 
              </div>
          </div>
      </div>
      <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
  </div>
</div> `;
  submitBtn = document.getElementById("submitBtn");
  $("#inputName").focus(() => {
    inputNameTouched = true;
  });

  $("#inputEmail").focus(() => {
    inputEmailTouched = true;
  });

  $("#inputPhone").focus(() => {
    inputPhoneTouched = true;
  });

  $("#inputAge").focus(() => {
    inputAgeTouched = true;
  });

  $("#inputPass").focus(() => {
    inputPassTouched = true;
  });

  $("#inputRePass").focus(() => {
    inputRePassTouched = true;
  });
}
$(sideBarLinks[4]).click(() => {
  getContactUs();
});
let inputNameTouched = false,
  inputEmailTouched = false,
  inputPhoneTouched = false,
  inputAgeTouched = false,
  inputPassTouched = false,
  inputRePassTouched = false;

function inputsValidation() {
  let nameAlert = document.getElementById("nameAlert");
  let emailAlert = document.getElementById("emailAlert");
  let phoneAlert = document.getElementById("phoneAlert");
  let ageAlert = document.getElementById("ageAlert");
  let passAlert = document.getElementById("passwordAlert");
  let rePassAlert = document.getElementById("repasswordAlert");
  if (inputNameTouched) {
    if (nameValid()) {
      nameAlert.classList.replace("d-block", "d-none");
    } else {
      nameAlert.classList.replace("d-none", "d-block");
    }
  }
  if (inputEmailTouched) {
    if (emailValid()) {
      emailAlert.classList.replace("d-block", "d-none");
    } else {
      emailAlert.classList.replace("d-none", "d-block");
    }
  }

  if (inputPhoneTouched) {
    if (phoneValid()) {
      phoneAlert.classList.replace("d-block", "d-none");
    } else {
      phoneAlert.classList.replace("d-none", "d-block");
    }
  }

  if (inputAgeTouched) {
    if (ageValid()) {
      ageAlert.classList.replace("d-block", "d-none");
    } else {
      ageAlert.classList.replace("d-none", "d-block");
    }
  }

  if (inputPassTouched) {
    if (passwordValid()) {
      passAlert.classList.replace("d-block", "d-none");
    } else {
      passAlert.classList.replace("d-none", "d-block");
    }
  }
  if (inputRePassTouched) {
    if (repasswordValid()) {
      rePassAlert.classList.replace("d-block", "d-none");
    } else {
      rePassAlert.classList.replace("d-none", "d-block");
    }
  }

  if (
    nameValid() &&
    emailValid() &&
    phoneValid() &&
    ageValid() &&
    passwordValid() &&
    repasswordValid()
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

// S T A R T - REGEX - V A L I D A T I O N
function nameValid() {
  let regex = /^[A-Z][a-z]{3,19}$/;
  return regex.test(document.getElementById("inputName").value);
}

function emailValid() {
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(document.getElementById("inputEmail").value);
}

function phoneValid() {
  let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return regex.test(document.getElementById("inputPhone").value);
}

function ageValid() {
  let regex = /^(1[89]|[2-9]\d)$/gm;
  return regex.test(document.getElementById("inputAge").value);
}

function passwordValid() {
  let regex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
  return regex.test(document.getElementById("inputPass").value);
}

function repasswordValid() {
  return (
    document.getElementById("inputRePass").value ==
    document.getElementById("inputPass").value
  );
}
// E N D - REGEX - V A L I D A T I O N
// E N D - C O N T A C T - US - S E C T I O N
