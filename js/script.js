/*profile info will appear*/
const overview = document.querySelector(".overview");
const displayRepoList = document.querySelector(".repo-list")
const username = "shaylapierrard"
const allRepos = document.querySelector(".repos")
const individualRepo = document.querySelector(".repo-data")
const backToRepoButton = document.querySelector(".view-repos")
const filterInput = document.querySelector(".filter-repos")

const fetchInfo = async function () {
    const userInfo = await fetch(`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    displayInfo(data);
};

fetchInfo();

const displayInfo = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
        div.innerHTML = `
        <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>
    `;
    overview.append(div);
    fetchRepos();
};

const fetchRepos = async function () {
    const repoInfo = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await repoInfo.json();
    displayRepos(repoData);
}

const displayRepos = function (repos) {
  filterInput.classList.remove("hide");
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML =`<h3>${repo.name}</h3>`;
        displayRepoList.append(repoItem);
    }
 };

 displayRepoList.addEventListener("click", function(e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        specificRepoInfo(repoName);
    }
 });

 const specificRepoInfo = async function (repoName) {
    const fetchSpecificRepo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchSpecificRepo.json();
    console.log(repoInfo);
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();
   
    const languages = [];
    for (const language in languageData) {
      languages.push(language);
    }
  
    displayRepoInfo(repoInfo, languages);
  };
  
  const displayRepoInfo = function (repoInfo, languages) {
    backToRepoButton.classList.remove("hide");
    individualRepo.innerHTML = "";
    individualRepo.classList.remove("hide");
    allRepos.classList.add("hide");
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>Name: ${repoInfo.name}</h3>
      <p>Description: ${repoInfo.description}</p>
      <p>Default Branch: ${repoInfo.default_branch}</p>
      <p>Languages: ${languages.join(", ")}</p>
      <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    individualRepo.append(div);
  };

  backToRepoButton.addEventListener("click", function () {
    allRepos.classList.remove("hide");
    individualRepo.classList.add("hide");
    backToRepoButton.classList.add("hide");
  });

  filterInput.addEventListener("input", function (e) {
    const searchText = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const searchLowerText = searchText.toLowerCase();
  
    for (const repo of repos) {
      const repoLowerText = repo.innerText.toLowerCase();
      if (repoLowerText.includes(searchLowerText)) {
        repo.classList.remove("hide");
      } else {
        repo.classList.add("hide");
      }
    }
  });

 

 
 