$(document).ready(() => {
    $('#login-form').submit((e) => {
        e.preventDefault();

        const email = $('#email').val();
        const password = $('#password').val();
        const rememberMe = $('#rememberMe').is(':checked');

        const data = {
            email,
            password
        };

        $.ajax({
            type: 'POST',
            url: 'http:localhost:4000/login',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: (data) => {
                if (data.token) {
                    alert('Login Successful!');

                    if (rememberMe) {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('userId', data.userId);
                    }
                    else {
                        sessionStorage.setItem('token', data.token);
                        sessionStorage.setItem('userId', data.userId);
                    }
                    
                    window.location.href = '/index.html';
                }
            },
            error: (err) => {
                try {
                    const errorMessage = err.responseJSON.message;
                    const error = $('#error');
                    error.text(errorMessage);
                    error.removeClass('hidden');
                } catch (e) {
                    const error = $('#error');
                    error.text("Something went wrong");
                    error.removeClass('hidden');
                }
            }
        });
    });
});
