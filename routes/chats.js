app.route('/chats').get(chat.listChats);
app.route('/chats/:roomid').get(chat.getRoomChats).post(chat.newRoomChatMessage);
app.route('/chats/:userid').get(chat.getUserChatMessages);
app.route('/chats/:messageid').get(chat.getChatMessage);
app.route('/chats/:messageid/edit').post(chat.editMessage);
app.route('/chats/:messageid/delete').post(chat.deleteMessage);
app.route('/chats/:messageid/delete/undo').post(chat.undoDelete);
