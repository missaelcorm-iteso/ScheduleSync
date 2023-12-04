$(document).ready(() => {
    $('#add-friend-form').submit((e) => {
        e.preventDefault();

        const email = $('#friendEmail');

        $.ajax({
            type: 'POST',
            url: `${API_URL}/relationships`,
            contentType: 'application/json',
            headers: {
                Authorization: `${token}`
            },
            data: JSON.stringify({ email: email.val() }),
            success: () => {
                email.val('');
                alert('Friend added successfully');
            },
            error: (err) => {
                try {
                    const errorMessage = err.responseJSON.message;
                    $('#error').text(errorMessage).removeClass('hidden');
                } catch (e) {
                    $('#error').text('Something went wrong').removeClass('hidden');
                }
            }
        });
    });
});
