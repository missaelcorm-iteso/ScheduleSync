$(document).ready(() => {
    $('#login-form').submit((e) => {
        e.preventDefault();

        const email = $('#email').val();
        const password = $('#password').val();

        const data = {
            email,
            password
        };

        $.ajax({
            type: 'POST',
            url: 'http://localhost:4000/login',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: (data) => {
                if (data.token) {
                    alert('Login Successful!');

                    localStorage.setItem('token', data.token);
                    window.location.href = '/index.html';
                }
            },
            error: (err) => {
                const errorMessage = err.responseJSON.message;
                const error = $('#error');
                error.text(errorMessage);
                error.removeClass('hidden');
            }
        });
    });
});
