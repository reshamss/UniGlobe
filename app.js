let url = "http://universities.hipolabs.com/search?country=";

let searchBtn = document.querySelector("#searchBtn");
let input = document.querySelector("#countryInput");
let loader = document.querySelector("#loader");
let results = document.querySelector("#results");

searchBtn.addEventListener("click", searchUniversities);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchUniversities();
});

async function searchUniversities() {
  let country = input.value.trim();
  if (!country) {
    alert("Please enter a country!");
    return;
  }

  results.innerHTML = "";
  loader.classList.remove("hidden");

  try {
    let [uniRes, flagRes] = await Promise.all([
      axios.get(url + country),
      axios.get(`https://restcountries.com/v3.1/name/${country}`)
    ]);

    let colleges = uniRes.data;
    let flag = flagRes.data[0]?.flags?.png || "";

    loader.classList.add("hidden");

    if (colleges.length === 0) {
      results.innerHTML = `<p>No universities found 😢</p>`;
      return;
    }

    colleges.sort((a, b) => a.name.localeCompare(b.name));

    colleges.forEach(col => {
      let card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <h3>${col.name}</h3>
        <p><strong>Country:</strong> ${col.country}</p>
        ${flag ? `<img src="${flag}" width="40" style="border-radius:5px;">` : ""}
        <p><a href="${col.web_pages[0]}" target="_blank">Visit Website 🌐</a></p>
      `;
      results.appendChild(card);
    });

  } catch (err) {
    loader.classList.add("hidden");
    console.error(err);
    results.innerHTML = `<p style="color:red;">Error fetching data ❌</p>`;
  }
}
