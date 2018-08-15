const socket = io();

function scrollToBottom() {
  const messages = jQuery('#messages');
  const newMessage = messages.children('li:last-child');

  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', function () {
  console.log('Connected to the server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from the server');
});

socket.on('newMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');

  const template = jQuery('#message-template').html();
  const html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime,
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  const messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function () {
      messageTextBox.val('')
  });
});
