$(document).ready(() => {
    const fetchFriends = () => {
        $.ajax({
            type: 'GET',
            url: `${API_URL}/relationships`,
            headers: { Authorization: `${token}` },
            success: (friends) => {
                renderFriendsList(friends);
            },
            error: (err) => {
                handleFriendError(err);
            }
        });
    };

    const renderFriendsList = (friends) => {
        const friendsList = $('#friendsList');
        friendsList.empty();
    
        const templateSource = $("#friend-template").html();
        const template = Handlebars.compile(templateSource);
    
        friends.forEach((friend) => {
            const listItem = template(friend);
            friendsList.append(listItem);
        });
    
        if(friends.length === 0){
            const listItem = `<div class="card"><div class="card-body">You have no friends</div></div>`;
            friendsList.append(listItem);
        }
    
        $('.delete-friend').on('click', (e) => {
            e.preventDefault();
            const friendId = $(e.target).data('id');
    
            $.ajax({
                url: `${API_URL}/relationships/${friendId}`,
                method: 'DELETE',
                headers: {
                    Authorization: `${token}`
                },
                contentType: 'application/json',
                success: (data) => {
                    alert('Friend deleted successfully');
                    fetchFriends().then(renderFriendsList); // Refresh the friends list
                },
                error: (error) => {
                    console.error('Error deleting friend:', error);
                }
            });
        });
    };

    const handleFriendError = (err) => {
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
    };

    fetchFriends();



});
