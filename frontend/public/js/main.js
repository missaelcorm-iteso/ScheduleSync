const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
const path_no_auth = ['/', '/login.html', '/register.html', '/index.html'];
//const API_URL = 'https://schedulesync.onrender.com';
const API_URL = 'http://localhost:4000';

// If the user is not logged in, redirect to the login page
if (!token && path_no_auth.indexOf(window.location.pathname) === -1) {
    alert('You must be logged in to view this page.');
    window.location.replace('./login.html');
}

$(function() {

    const template = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="index.html">ScheduleSync</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul id="navbar-items" class="navbar-nav">
        <li class="nav-item"> <a class="nav-link" href="index.html">Home</a> </li>
        {{# if token}}
        <li class="nav-item"> <a class="nav-link" href="my-account.html">My Account</a> </li>
        <li class="nav-item"> <a class="nav-link" href="today.html">Today</a> </li>
        <li class="nav-item"> <a class="nav-link" href="todo.html">ToDo</a> </li>
        <li class="nav-item"> <a class="nav-link" href="add-task.html">Add Task</a> </li>
        <li class="nav-item"> <a class="nav-link" href="friends.html">Friends</a> </li>
        <li class="nav-item"> <a class="nav-link" href="add-friend.html">Add a Friend</a> </li>
        <li class="nav-item"> <a class="nav-link" href="add-note.html">Add Note</a> </li>
        <li class="nav-item"> <a class="nav-link" href="notes.html">Notes</a> </li>
        <li class="nav-item"> <a class="nav-link" href="#">Logout</a> </li>
        {{else}}
        <li class="nav-item"> <a class="nav-link" href="login.html">Login</a> </li>
        <li class="nav-item"> <a class="nav-link" href="register.html">Register</a> </li>
        {{/ if}}
      </ul>
    </div>
  </nav>`;
    const compiledNavbar = Handlebars.compile(template);

    const context = {
        token
    };

    const html = compiledNavbar(context);
    $('#navbar-placeholder').html(html);

    $('#body').removeAttr('hidden');

    $('#navbar-items').on('click', 'li.nav-item:nth-child(10)', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userId');

        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login.html';
    });

});