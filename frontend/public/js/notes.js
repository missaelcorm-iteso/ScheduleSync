$(document).ready(() => {

    const fetchNotes = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'http://localhost:4000/notes',
                method: 'GET',
                headers: {
                    Authorization: `${token}`
                },
                contentType: 'application/json',
                success: (notes) => {
                    renderNotesList(notes);
                    resolve(notes);
                },
                error: (error) => {
                    console.error('Error fetching notes:', error);
                    reject(error);
                }
            });
        });
    };

    const renderNotesList = (notes) => {
        const notesList = $('#notesList');
        notesList.empty();

        notes.forEach((note) => {
            const listItem = `<li class="list-group-item">${note.taskName} - ${note.description}</li>`;
            notesList.append(listItem);
        });
    };

    fetchNotes().then((notes) => {
    }).catch((error) => {
        console.error('Error fetching notes:', error);
    });

});
