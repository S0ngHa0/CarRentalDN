import React, { useEffect, useState } from 'react';
import Talk from 'talkjs';
import Modal from 'react-modal';
import userApi from "../../apis/userApi";
   
    function ChatComponent({ otherUser: initialOtherUser }) {
        const [otherUser, setOtherUser] = useState(initialOtherUser); // khởi tạo otherUser và setOtherUser
    
        useEffect(() => {
            (async () => {
                try {
                    const response = await userApi.getProfile();
                    console.log(response);
                    const userData = response.user; // Lưu dữ liệu người dùng vào biến trung gian
                    setOtherUser(userData); // Cập nhật otherUser với dữ liệu từ biến trung gian
                    console.log(userData); // In dữ liệu người dùng từ biến trung gian
                } catch (error) {
                    console.log('Failed to fetch profile user:' + error);
                }
            })();
        }, []);
        
    
        useEffect(() => {
            if (!otherUser) {
                return; // otherUser is not defined, so we exit early
            }
        
            Talk.ready.then(() => {
                var me = new Talk.User({
                    id: otherUser.id.toString(),
                    name: otherUser.username,
                    email: otherUser.email,
                    // photoUrl: "USER_PHOTO_URL",
                    welcomeMessage: "Welcome to TalkJS!"
                });
        
                var other = new Talk.User({
                    id: "1", // Chuyển đổi id sang chuỗi
                    name: "Owner1",
                    email: "OwnercarrentalDN@gmail.com",
                    // photoUrl: otherUser.photoUrl,
                    welcomeMessage: "Welcome to TalkJS!"
                });
        
                var session = new Talk.Session({
                    appId: "tyZKanWy",
                    me: me
                });
                var conversation = session.getOrCreateConversation(Talk.oneOnOneId(me, other));
                conversation.setParticipant(me);
                conversation.setParticipant(other);
        
                var inbox = session.createInbox({selected: conversation});
                inbox.mount(document.getElementById("talkjs-container"));
            });
        }, [otherUser]); // Thêm otherUser vào dependency array        
    
        return (
            <div style={{position: 'fixed', bottom: '80px', right: '0', zIndex: 1000}}>
                <div id="talkjs-container" style={{height: '500px'}}></div>
            </div>
        );
    }
    export default ChatComponent;