$(document).ready(() => {
    $('#register-form').submit((e) => {
        e.preventDefault();

        const name = $('#name').val();
        const email = $('#email').val();
        const password = $('#password').val();

        const data = {
            name,
            email,
            password
        };

        $.ajax({
            type: 'POST',
            url: 'http://localhost:4000/users',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: (data) => {
                window.location.href = '/index.html';
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
