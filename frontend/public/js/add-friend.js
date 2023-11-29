$(document).ready(() => {
    $('#add-friend-form').submit((e) => {
        e.preventDefault();

        const name = $('#friendName');

        const data = {
            name: name.val()
        };

        $.ajax({
            type: 'POST',
            url: 'http://localhost:4000/relationships',
            contentType: 'application/json',
            headers: {
                Authorization: `${token}`
            },
            data: JSON.stringify(data),
            success: (data) => {
                name.val('');
                alert('Friend added successfully');
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
