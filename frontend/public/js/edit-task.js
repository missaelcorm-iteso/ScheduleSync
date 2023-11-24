$(document).ready(() => {


    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const _id = urlParams.get('id');
    const _title = urlParams.get('title');
    const _location = urlParams.get('location');
    const _description = urlParams.get('description');
    const _start_date = moment(
        urlParams.get('start_date'), 'MM/DD/YYYY, h:mm a'
        ).format('yyyy-MM-DDThh:mm');
    const _end_date = moment(
        urlParams.get('end_date'), 'MM/DD/YYYY, h:mm a'
        ).format('yyyy-MM-DDThh:mm');
    const _is_private = urlParams.get('is_private') === 'true';
    const _is_completed = urlParams.get('is_completed') === 'true';

    const title = $('#title');
    const location = $('#location');
    const description = $('#description');
    const start_date = $('#start_date');
    const end_date = $('#end_date');
    const is_private_e = $('#is_private');
    const is_private = is_private_e.is(":checked");
    const is_completed_e = $('#is_completed');
    const is_completed = is_completed_e.is(":checked");

    title.val(_title);
    if (_location !== 'undefined')
        location.val(_location);
    if (_description !== 'undefined')
        description.val(_description);
    start_date.val(_start_date);
    if (_end_date !== 'Invalid date')
        end_date.val(_end_date);
    is_private_e.prop('checked', _is_private);
    is_completed_e.prop('checked', _is_completed);

    $('#edit-task-form').submit((e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

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
            type: 'PUT',
            url: `http://localhost:4000/activities/${_id}`,
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

                alert('Task edited successfully');
                window.location.href = '/todo.html';
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