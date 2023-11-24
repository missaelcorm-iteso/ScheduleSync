$(document).ready(() => {

    const fetchData = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `http://localhost:4000/activities/today`,
                method: 'GET',
                headers: {
                    Authorization: `${token}`
                },
                contentType: 'application/json',
                success: (tasks) => {
                    var templateSource = $('#task-template').html();
                    var template = Handlebars.compile(templateSource);

                    // Render each task and append to the taskAccordion
                    tasks.forEach((task, index) => {
                        task.id = index + 1;
                        task.start_date = moment(task.start_date * 1000).format('MM/DD/YYYY, h:mm a');
                        if (task.end_date)
                            task.end_date = moment(task.end_date * 1000).format('MM/DD/YYYY, h:mm a');

                        if (task.is_completed)
                            task.status = 'Completed';
                        else
                            task.status = 'Pending';
                        var html = template(task);
                        $('#taskAccordion').append(html);
                    });

                    // Enable Bootstrap tooltips
                    $('[data-toggle="tooltip"]').tooltip();
                    resolve(tasks);
                },
                error: (error) => {
                    console.error('Error fetching tasks:', error);
                    reject(error);
                }
            });
        });
    };

    fetchData().then((tasks) => {
        $('.taskAccordion').on('click', (e) => {
            const taskId = e.currentTarget.id.split('-')[1];
            const task = tasks[taskId - 1];
            const completeButton = $(`#complete-button-${taskId}`);
            const deleteButton = $(`#delete-button-${taskId}`);
            const editButton = $(`#edit-button-${taskId}`);

            completeButton.on('click', (e) => {
                e.preventDefault();

                if (task.is_completed) {
                    return;
                }

                $.ajax({
                    url: `http://localhost:4000/activities/${task._id}/complete`,
                    method: 'POST',
                    headers: {
                        Authorization: `${token}`
                    },
                    contentType: 'application/json',
                    success: (data) => {
                        window.location.href = '/today.html';
                    },
                    error: (error) => {
                        console.error('Error completing task:', error);
                    }
                });
            });

            deleteButton.on('click', (e) => {
                e.preventDefault();

                $.ajax({
                    url: `http://localhost:4000/activities/${task._id}`,
                    method: 'DELETE',
                    headers: {
                        Authorization: `${token}`
                    },
                    contentType: 'application/json',
                    success: (data) => {
                        window.location.href = '/today.html';
                    },
                    error: (error) => {
                        console.error('Error deleting task:', error);
                    }
                });
            });

            editButton.on('click', (e) => {
                e.preventDefault();

                window.location.href = `/edit-task.html?id=${task._id}&title=${task.title}&location=${task.location}&description=${task.description}&start_date=${task.start_date}&end_date=${task.end_date}&is_private=${task.is_private}&is_completed=${task.is_completed}`;
            });

            // console.log(task);
        });
    }).catch((error) => {
        console.error('Error fetching tasks:', error);
    });

});
