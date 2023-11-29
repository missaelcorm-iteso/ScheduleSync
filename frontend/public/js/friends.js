$(document).ready(() => {
    const fetchFriends = () => {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:4000/relationships',
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

        friends.forEach((friend) => {
            const listItem = `<li class="list-group">${friend.name}</li>`;
            friendsList.append(listItem);
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
