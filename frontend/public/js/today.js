$(document).ready(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    $.ajax({
        url: `http://localhost:4000/users/${userId}/activities`,
        method: 'GET',
        headers: {
            Authorization: `${token}`
        },
        contentType: 'application/json',
        success: (tasks) => {
            console.log(tasks);
            var templateSource = $('#task-template').html();
            var template = Handlebars.compile(templateSource);

            // Render each task and append to the taskAccordion
            tasks.forEach((task, index) => {
                if(task.start_date > moment().subtract(1, 'days').unix() && task.start_date < moment().add(1, 'days').unix()){
                    task.id = index + 1;
                    task.start_date = moment(task.start_date*1000).format('MM/DD/YYYY, h:mm a');
                    if(task.end_date)
                        task.end_date = moment(task.end_date*1000).format('MM/DD/YYYY, h:mm a');
    
                    if(task.is_completed)
                        task.status = 'Completed';
                    else
                        task.status = 'Pending';
                    var html = template(task);
                    $('#taskAccordion').append(html);
                }
            });

            // Enable Bootstrap tooltips
            $('[data-toggle="tooltip"]').tooltip();
        },
        error: (error) => {
          console.error('Error fetching tasks:', error);
        }
      });

    });
