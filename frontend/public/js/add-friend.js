$(document).ready(() => {
    $('#add-friend-form').submit((e) => {
        e.preventDefault();

        const name = $('#friendName');

        $.ajax({
            type: 'POST',
            url: 'http://localhost:4000/relationships',
            contentType: 'application/json',
            headers: {
                Authorization: `${token}`
            },
            data: JSON.stringify({ name: name.val() }),
            success: () => {
                name.val('');
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
