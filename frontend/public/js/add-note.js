$(document).ready(() => {
    $('#add-note-form').submit((e) => {
        e.preventDefault();

        const taskName = $('#title').val();
        const description = $('#content').val();

        const data = {
            taskName: taskName,
            description: description
        };

        $.ajax({
            type: 'POST',
            url: 'http://localhost:4000/notes',
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
