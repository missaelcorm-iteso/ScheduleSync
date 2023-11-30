$(document).ready(() => {
    $('#register-form').submit((e) => {
        e.preventDefault();

        const name = $('#name').val();
        const email = $('#email').val();
        const password = $('#password').val();
        const confirmPassword = $('#confirm-password').val();
        const birthdate = $('#birthdate').val();

        if (password !== confirmPassword) {
            const error = $('#error');
            error.text('Passwords do not match');
            error.removeClass('hidden');
            return;
        }

        if (password.length < 6) {
            const error = $('#error');
            error.text('Password must be at least 6 characters long');
            error.removeClass('hidden');
            return;
        }

        const data = {
            name,
            email,
            password,
            birthdate
        };

        $.ajax({
            type: 'POST',
            url: `${API_URL}/users`,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: (data) => {
                alert('Account created successfully');
                window.location.href = '/login.html';
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
