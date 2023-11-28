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
        url: `${API_URL}/users/${userId}`,
        contentType: "application/json",
        headers: {
            Authorization: `${token}`
        },
        success: (data) => {
            const profilePicture = () => {
                return new Promise((resolve, reject) => {
                    $.ajax({
                        type: "GET",
                        url: `${API_URL}/users/${userId}/uploads`,
                        contentType: "application/json",
                        headers: {
                            Authorization: `${token}`
                        },
                        success: (data) => {
                            resolve(data);
                        },
                        error: (err) => {
                            console.error(err);
                            reject(err);
                        }
                    });
                });
            };

            profilePicture().then((data) => {
                if (data.length > 0) {
                    const profilePicture = data[data.length - 1];
                    const profilePictureUrl = `${API_URL}/assets/${profilePicture.filename}`;
                    $('#userInfo').find('img').attr('src', profilePictureUrl);
                }
            }).catch((err) => {
                console.error(err);
            });

            const birthdate = new Date(data.birthdate).toISOString().split('T')[0];
            data.birthdate = new Date(data.birthdate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
                $('#birthdate').val(birthdate);
            });

            $('#editForm .btn-success').on('click', (e) => {            
                // After saving, update the display info and hide the edit form
                $('#userInfo').show();
                $('#editForm').hide();
            
                const profilePictureInput = $('#profilePicture')[0];
                if (profilePictureInput.files.length > 0) {
                    const profilePicture = profilePictureInput.files[0];
                    const formData = new FormData();
                    formData.append('file', profilePicture);

                    $.ajax({
                        type: "POST",
                        url: `${API_URL}/users/${userId}/upload`,
                        contentType: false,
                        processData: false,
                        headers: {
                            Authorization: `${token}`
                        },
                        data: formData,
                        success: (data) => {
                            alert('Profile picture uploaded successfully');
                        },
                        error: (err) => {
                            console.error(err);
                        }
                    });
                }

                const name = $('#name').val();
                const email = $('#email').val();
                const birthdate = $('#birthdate').val();
                const new_password = $('#new-password').val();
                const confirm_new_password = $('#confirm-new-password').val();

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
                    url: `${API_URL}/users/${userId}`,
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
  