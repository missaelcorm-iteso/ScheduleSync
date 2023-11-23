$(document).ready(() => {
    $('#add-task-form').submit((e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const title = $('#title');
        const location = $('#location');
        const description = $('#description');
        const start_date = $('#start_date');
        const end_date = $('#end_date');
        const is_private_e = $('#is_private');
        const is_private = is_private_e.is(":checked");
        const is_completed_e = $('#is_completed');
        const is_completed = is_completed_e.is(":checked");

        const data = {
            title: title.val(),
            location: location.val(),
            description: description.val(),
            start_date: new Date(start_date.val()).getTime()/1000,
            end_date: end_date.val() === "" ? 0 : new Date(end_date.val()).getTime()/1000,
            is_private,
            is_completed
        };

        if(data.end_date === 0) delete data.end_date;

        $.ajax({
            type: 'POST',
            url: 'http://localhost:4000/activities',
            contentType: 'application/json',
            headers: {
                Authorization: `${token}`
            },
            data: JSON.stringify(data),
            success: (data) => {
                title.val('');
                location.val('');
                description.val('');
                start_date.val('');
                end_date.val('');
                is_private_e.prop('checked', false);
                is_completed_e.prop('checked', false);

                alert('Task added successfully');
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