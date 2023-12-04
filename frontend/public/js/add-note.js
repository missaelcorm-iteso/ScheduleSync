$(document).ready(() => {
    $('#add-note-form').submit((e) => {
        e.preventDefault();

        const noteName = $('#title').val();
        const description = $('#content').val();

        const data = {
            noteName: noteName,
            description: description
        };

        $.ajax({
            type: 'POST',
            url: `${API_URL}/notes`,
            contentType: 'application/json',
            headers: {
                Authorization: `${token}`
            },
            data: JSON.stringify(data),
            success: (data) => {
                alert('Note added successfully');
            },
            error: (err) => {
                try {
                    const errorMessage = err.responseJSON.message;
                    const error = $('#error');
                    error.text(errorMessage);
                    error.removeClass('hidden');
                } catch (e) {
                    const error = $('#error');
                    error.text('Something went wrong');
                    error.removeClass('hidden');
                }
            }
        });
    });
});
