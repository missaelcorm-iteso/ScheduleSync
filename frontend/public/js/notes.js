$(document).ready(() => {

    const fetchNotes = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${API_URL}/notes`,
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

        const templateSource = $('#noteTemplate').html();
        const template = Handlebars.compile(templateSource);

        notes.forEach((note) => {
            const listItem = template(note);
            notesList.append(listItem);
        });

        if(notes.length === 0){
            const listItem = `<div class="card"><div class="card-body">You have no notes</div></div>`;
            notesList.append(listItem);
        }

        $('.delete-note').on('click', (e) => {
            e.preventDefault();
            const noteId = $(e.target).data('id');

            $.ajax({
                url: `${API_URL}/notes/${noteId}`,
                method: 'DELETE',
                headers: {
                    Authorization: `${token}`
                },
                contentType: 'application/json',
                success: (response) => {
                    alert('Note deleted successfully');
                    fetchNotes(renderNotesList);//Refresh notes list
                },
                error: (error) => {
                    console.error('Error deleting note:', error);
                }
            })
        })
    };

    fetchNotes().then((notes) => {
    }).catch((error) => {
        console.error('Error fetching notes:', error);
    });

});
