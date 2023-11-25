$(document).ready(function () {
    const fileInput=$('input[type="file"]');
    const filenameDisplay = $('.filename');


    fileInput.on('change', function () {
        const filename = this.value.split('\\').pop();
        filenameDisplay.text(filename);
    });
});
//this should disappear after the pdf is loaded, at least I hope.

$(document).ready(function () {
    const userId = '123'; //Replace with the actual user ID
  const scheduleContainer = $('#scheduleContainer');


  function fetchSchedule() {
    $.ajax({
      url: `/user/get-schedule?userId=${userId}`,
      type: 'GET',
      success: function (result) {
        scheduleContainer.html(`<h3>Schedule:</h3><p>${result.data}</p>`);
      },
      error: function (error) {
        console.error('Error fetching schedule:', error);
      }
    });
  }

  fetchSchedule();
});