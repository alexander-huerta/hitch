import React, { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Paper,
  Divider,
  TextField,
  List,
  Fab,
} from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import Message from './Message.jsx';
import UserContacted from './UserContacted.jsx';
import { AuthContext } from '../contexts/index.jsx';
import dummyData from '../../../messagesDummyData';

function Messages() {
  const [usersContacted, setUsersContacted] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userContactedId, setUserContactedId] = useState(null);
  const {
    currentUser,
    addMessage,
    getMessages,
    getProfile,
    updateUsersContacted,
  } = useContext(AuthContext);
  const didMount = useRef(false);
  const messagesEndRef = useRef();
  const location = useLocation();
  const profile = location.state;

  useEffect(() => {
    if (didMount.current && profile) {
      let userAlreadyContacted = false;
      for (let i = 0; i < usersContacted.length; i += 1) {
        if (usersContacted[i].userId === profile.userId) {
          userAlreadyContacted = true;
          break;
        }
      }
      if (!userAlreadyContacted) {
        const newContact = {
          name: profile.name, userId: profile.userId, image: profile.image.url,
        };
        updateUsersContacted(currentUser.uid, newContact)
          .then(() => {
            const userContact = {
              name: currentUser.displayName, userId: currentUser.uid, image: currentUser.photoURL,
            };
            updateUsersContacted(newContact.userId, userContact)
              .then(() => {
                setUsersContacted(usersContacted => [...usersContacted, newContact]);
              });
          })
          .catch(err => console.log(err));
      }
    } else {
      didMount.current = true;
      if (profile) {
        setUserContactedId(profile.userId);
      }
      getProfile(currentUser.uid)
        .then(result => {
          let { usersContacted } = result.data();
          if (usersContacted === undefined) {
            setUsersContacted([]);
          } else {
            setUsersContacted(usersContacted);
          }
        });
    }
  }, [usersContacted]);

  useEffect(() => {
    if (userContactedId !== null) {
      getMessages(userContactedId + currentUser.uid, (updatedMessages) => {
        setMessages(updatedMessages);
      });
    }
  }, [userContactedId]);

  const sendMessage = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const messageToSend = {
      message: data.get('message'),
      senderId: currentUser.uid,
      chatd: [userContactedId + currentUser.uid, currentUser.uid + userContactedId],
      time: new Date(),
    };
    addMessage(messageToSend)
      .catch((err) => console.log(err));
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView();
  };

  useEffect(() => {
    if (userContactedId !== null && messages.length > 0) {
      scrollToBottom();
    }
  }, [userContactedId]);

  const userContactedOnClick = (id) => {
    setUserContactedId(id);
  };

  return (
    <div>
      <Grid container component={Paper}>
        <Grid item xs={3} style={{ borderRight: '1px solid #e0e0e0' }}>
          <List>
            {usersContacted.map((user) => (
              <UserContacted user={user} key={user.userId} userContactedOnClick={userContactedOnClick} />
            ))}
          </List>
        </Grid>
        {userContactedId
        && (
        <Grid item xs={9}>
          <List style={{ height: '70vh', overflowY: 'auto' }}>
            {messages.map((message, index) => (
              <Message message={message} key={index} userId={currentUser.uid} />
            ))}
            <div ref={messagesEndRef} />
          </List>
          <Divider />
          <Grid container component="form" onSubmit={sendMessage} style={{ padding: '20px' }}>
            <Grid item xs={11}>
              <TextField id="message" name="message" autoComplete="off" required fullWidth />
            </Grid>
            <Grid item xs={1} align="right">
              <Fab type="submit" color="primary" aria-label="add">Send</Fab>
            </Grid>
          </Grid>
        </Grid>
        )}
      </Grid>
    </div>
  );
}

export default Messages;
