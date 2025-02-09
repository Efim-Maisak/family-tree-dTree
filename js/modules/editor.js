export const quill = new Quill('#person-info-input', {
    modules: {
      toolbar: [
        [{ header: [2, 3, 4, false] }],
        [{ align: '' }, { align: 'center' }, { align: 'right' }],
        ['bold', 'italic', 'underline'],
        ['link'],
        [{ list: 'ordered' }, { list: 'bullet' }]
      ],
    },
    placeholder: 'Напишите больше о человеке...',
    theme: 'snow',
  });