const token = localStorage.getItem('token');
const path_no_auth = ['/login.html', '/register.html', '/index.html'];

// If the user is not logged in, redirect to the login page
if (!token && path_no_auth.indexOf(window.location.pathname) === -1) {
    alert('You must be logged in to view this page.');
    window.location.replace('./login.html');
}

$(function() {
    // Load the navbar using jQuery
    $('#navbar-placeholder').load('./assets/templates/navbar.html');
});