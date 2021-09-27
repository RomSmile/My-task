'use strict';
const rootElement = document.getElementById('root');
const sorting = document.getElementById('sorting');
const url = 'https://jsonplaceholder.typicode.com/users';

let userToServer = null;
let sort = false;
const addedUsers = [];

sorting.addEventListener('click', () => {
  sort = !sort;
  get();
})

const addUserForm = document.getElementById('addUser');

addUserForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(addUserForm);
  const enteredName = data.get('name');
  const enteredUserName = data.get('username');
  const enteredEmail = data.get('email');
  const enteredWebsite = data.get('website');

  if (enteredName === '') {
    alert('Enter the name');
    return;
  }

  if (enteredUserName === '') {
    alert('Enter the userName');
    return;
  }

  if (enteredEmail === '') {
    alert('Enter the email');
    return;
  }

  if (enteredWebsite === '') {
    alert('Enter the website');
    return;
  }
  
  userToServer = Object.fromEntries(data.entries());
  addedUsers.push(userToServer);
  userToServer = null;
  get();

  addUserForm.reset();
});

async function get() {
  return await fetch(url)
    .then(response => response.json())
    .then(Users => {
      if (addedUsers.length > 0) {
        console.log(userToServer)
        Users = [...Users, ...addedUsers];
      }
      return Users;
    })
    .then(users => {
      if (sort) {
        return [...users].sort((first, second) => first.name.localeCompare(second.name))
      }

      return users;
    })
    .then(Users => {
      rootElement.innerHTML = `
        <table class="topics">
          <tr class="topic">
            <td class="headContainer container">Name</td>
            <td class="headContainer container">Username</td>
            <td class="headContainer container">Email</td>
            <td class="headContainer container">Website</td>
          </tr>
          ${Users.map(user => `
            <tr class="topic" id="${}">
              <td class="container">${user.name}</td>
              <td class="container">${user.username}</td>
              <td class="container">${user.email}</td>
              <td class="container">${user.website}</td>
            </tr>
          `).join('')}
        </table>
      `;

      Users.map(user => {
        const userContainer = document.getElementById(`${user.id}`)
        userContainer.addEventListener('click', (event) => {

          const positionY = event.pageY;
          const positionX = event.pageX;
          const modalBlock = document.getElementById('optionalBlock');

          modalBlock.style.cssText = `
            display: block;
            position: absolute;
            top: ${positionY}px;
            left: ${positionX}px;
            background-color: grey;
            padding: 5px;
            border: 1px solid blue;
            border-radius: 10px
          `;

          modalBlock.innerHTML = `
            <button id="close">X</button>
            <p>Street: ${user.address.street}</p>
            <p>City: ${user.address.city}</p>
            <p>Zipcode: ${user.address.zipcode}</p>
            <p>Suite: ${user.address.suite}</p>
          `;

          const closeButton = document.getElementById('close');

          closeButton.onclick = () => {
            modalBlock.innerHTML = '';
            modalBlock.style.cssText = `
              padding: 0;
            `
          };
        })
      })

      return Users;
  });
};

get();
