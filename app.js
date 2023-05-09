const APIURL = "https://api.github.com/users/";
const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");

async function getUser(username) {
  try {
    const { data } = await axios.get(APIURL + username);
    console.log(data);
    createUserCard(data);
    getRepos(username)
  } catch (error) {
    if (error.response.status === 404) {
      createErrorCard("No Profile with this username");
    }
  }
}

async function getRepos(username) {
    try {
        const { data } = await axios.get(APIURL + username + '/repos?sort=created');
        addReposToCard(data);
      } catch (error) {
        if (error.response.status === 404) {
          createErrorCard("Problem fetching repos");
        }
      }
}

function createUserCard(user) {
  const { name, avatar_url, bio, followers, following, public_repos } = user;
  const cardHtml = `<div class="card">
    <div>
      <img
        src=${avatar_url}
        alt=${name}
        class="avatar"
      />
    </div>
    <div class="user-info">
      <h2>${name}</h2>
      <p>
      ${
        bio
          ? bio
          : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
      }
      </p>
      <ul>
        <li>${followers}<strong>Followers</strong></li>
        <li>${following} <strong>Following</strong></li>
        <li>${public_repos} <strong>Repos</strong></li>
      </ul>

      <div id="repos">

      </div>
    </div>
  </div>`;

  main.innerHTML = cardHtml;
}

function createErrorCard(msg) {
    const cardHtml = `
    <div class="card" >
    <h1>${msg}</h1>
    </div>
    `
    main.innerHTML = cardHtml;
}

function  addReposToCard (repos){
    const reposEl = document.getElementById('repos')

    repos
        .slice(0, 5)
        .forEach(repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repo')
            repoEl.href = repo.html_url
            repoEl.target = '_blank'
            repoEl.innerText = repo.name

            reposEl.appendChild(repoEl)
        })
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value;
  if (user) {
    getUser(user);
    search.value = ''
  } 
});
