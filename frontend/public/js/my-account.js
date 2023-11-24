$(document).ready(function() {

    const userInfoTemplate = `
    <div class="profile-picture-container">
    <img src="./assets/images/default-profile-picture.jpg" alt="Profile Picture" class="profile-picture img-thumbnail mb-2 rounded-circle">
</div>
<p><strong>Name:</strong> {{name}}</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>Birthdate:</strong> {{birthdate}}</p>
<button class="btn btn-primary">Edit Information</button>
`;

    const compiledTemplate = Handlebars.compile(userInfoTemplate);

    $.ajax({
        type: "GET",
        url: `http://localhost:4000/users/${userId}`,
        contentType: "application/json",
        headers: {
            Authorization: `${token}`
        },
        success: (data) => {
            const html = compiledTemplate(data);
            $('#userInfo').html(html);

            // Attach the event handler to the button
            $('#userInfo button').on('click', (e) => {
                // Hide the display info, show the edit form
                e.preventDefault();
                
                $('#userInfo').hide();
                $('#editForm').show();

                $('#name').val(data.name);
                $('#email').val(data.email);
                $('#birthdate').val(data.birthdate);
            });

            $('#editForm .btn-success').on('click', (e) => {            
                // After saving, update the display info and hide the edit form
                $('#userInfo').show();
                $('#editForm').hide();
            
                const profilePictureInput = $('#profilePicture')[0];
                if (profilePictureInput.files.length > 0) {
                    const newProfilePicture = URL.createObjectURL(profilePictureInput.files[0]);
                    $('#userInfo').find('img').attr('src', newProfilePicture);
                }

                const name = $('#name').val();
                const email = $('#email').val();
                const birthdate = $('#birthdate').val();
                const new_password = $('#new_password').val();
                const confirm_new_password = $('#confirm_new_password').val();

                if(new_password === "" && confirm_new_password !== "") {
                    alert('Please enter a new password');
                    return;
                }

                if(new_password !== "" && confirm_new_password === "") {
                    alert('Please confirm your new password');
                    return;
                }

                if (new_password.length > 0 && new_password.length < 6) {
                    alert('Password must be at least 6 characters long');
                    return;
                }

                if (new_password !== confirm_new_password) {
                    alert('Passwords do not match');
                    return;
                }

                const data = {
                    name,
                    email,
                    birthdate
                };

                if(new_password !== "" && confirm_new_password !== "" && new_password === confirm_new_password) {
                    data.new_password = new_password;
                }

                $.ajax({
                    type: "PUT",
                    url: `http://localhost:4000/users/${userId}`,
                    contentType: "application/json",
                    headers: {
                        Authorization: `${token}`
                    },
                    data: JSON.stringify(data),
                    success: (data) => {
                        alert('User information updated successfully');
                        window.location.reload();
                    },
                    error: (err) => {
                        console.error(err);
                    }
                });
            });

            $('#editForm .btn-secondary').on('click', (e) => {
                // If the user cancels editing, revert to display info and hide the edit form
                $('#userInfo').show();
                $('#editForm').hide();
            });
        },
        error: (err) => {
            console.error(err);
        }
    });
  });
  