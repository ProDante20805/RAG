import { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Paper,
  FormControl,
  InputLabel,
  Select,
  ListSubheader,
  CircularProgress,
} from '@mui/material';

import PromptField from 'components/prompt';

import { b2bBuyerPersonas, b2cBuyerPersonas } from 'constants/personas';
import { emailTypes } from 'constants/archetypes';

import instance from 'utils/axios';

export default function Explorer({ title, description }) {
  const [exclusion, setExclusion] = useState('');
  const [inclusion, setInClusion] = useState('');
  const [personas, setPersonas] = useState('');
  const [email, setEmailType] = useState('');
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(false);

  const handleBuyerPersonas = (e) => {
    setPersonas(e.target.value);
  };

  const handleEmailTypes = (e) => {
    setEmailType(e.target.value);
  };

  const updateRecipientName = (e) => {
    setRecipient(e.target.value);
  };

  const updateContent = (e) => {
    setContent(e.target.value);
  };

  const handleKeywords = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'exclusion':
        setExclusion(value);
        break;
      case 'inclusion':
        setInClusion(value);
        break;
      default:
        break;
    }
  };

  const sendMessage = async () => {
    const archytype = localStorage.getItem('archetype');
    const payload = {
      archytype,
      recipient,
      email,
      personas,
      inclusion,
      exclusion,
      content,
    };

    if (content.length) {
      const chats = messages;
      setIsTyping(true);
      chats.push({ role: 'user', content });
      setMessages(chats);
      setContent('');
      const {
        data: { answer },
      } = await instance.post('/explorer/email', payload);
      chats.push({ role: 'ai', content: answer });
      setMessages(chats);
      setIsTyping(false);
    } else {
      setError(true);
      return;
    }
  };

  const formatBoard = () => {
    setMessages([]);
  };

  return (
    <Box>
      <div className="explorer-header mb-10">
        <p className="font-bold text-3xl mb-2">Email Explorer</p>
        <p className="text-xl">
          Draft relevant and compelling email copy to your target audience
        </p>
      </div>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item md={3}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Recipient Name"
            variant="outlined"
            sx={{ mb: 2 }}
            onChange={updateRecipientName}
          />
          <TextField
            fullWidth
            select
            id="outlined-basic"
            label="Email Type"
            variant="outlined"
            value={email}
            sx={{ mb: 2 }}
            onChange={handleEmailTypes}
          >
            {emailTypes.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item} emails
              </MenuItem>
            ))}
          </TextField>
          <FormControl fullWidth sx={{ minWidth: '100%', mb: 2 }}>
            <InputLabel>Personas</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={personas}
              label="B2B Buyer Personas"
              onChange={handleBuyerPersonas}
            >
              <ListSubheader sx={{ fontSize: '1.2rem', color: '#abcced' }}>
                B2B Buyer Personas
              </ListSubheader>
              {b2bBuyerPersonas.map(({ title }, index) => (
                <MenuItem value={title} key={index}>
                  {title}
                </MenuItem>
              ))}
              <ListSubheader sx={{ fontSize: '1.2rem', color: '#abcced' }}>
                B2C Buyer Personas
              </ListSubheader>
              {b2cBuyerPersonas.map(({ title }, index) => (
                <MenuItem value={title} key={index}>
                  {title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="inclusion"
            multiline
            fullWidth
            rows={4}
            id="outlined-basic"
            label="Keywords / inclusion"
            variant="outlined"
            sx={{ mb: 2 }}
            onChange={handleKeywords}
          />
          <TextField
            name="exclusion"
            multiline
            fullWidth
            rows={4}
            id="outlined-basic"
            label="Exclusion words"
            variant="outlined"
            sx={{ mb: 2 }}
            onChange={handleKeywords}
          />
        </Grid>
        <Grid item md={9}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '500px',
              width: '100%',
              boxShadow: 6,
              marginBottom: 4,
              borderRadius: 2,
              padding: 1,
              overflow: 'auto',
              '::-webkit-scrollbar': {
                width: '10px',
              },
              '::-webkit-scrollbar-thumb': {
                height: '50px',
                borderRadius: '10px',
                backgroundColor: 'darkgrey',
              },
            }}
          >
            {messages && messages.length
              ? messages?.map(({ role, content }, index) => (
                  <PromptField
                    prompt={content}
                    key={index}
                    left={role === 'ai'}
                  />
                ))
              : ''}
            {isTyping && <CircularProgress disableShrink />}
          </Box>
          <TextField
            fullWidth
            id="outlined-basic"
            variant="outlined"
            sx={{ width: '78%' }}
            value={content}
            onChange={updateContent}
          />
          <Button
            variant="contained"
            size="large"
            sx={{
              width: '80px',
              height: '56px',
              fontWeight: 700,
              mx: 1,
              backgroundColor: '#FA437F',
            }}
            onClick={sendMessage}
          >
            Send
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              width: '120px',
              height: '56px',
              fontWeight: 700,
              mx: 1,
              borderColor: '#FA437F',
              color: '#FA437F',
              px: 2,
            }}
            onClick={formatBoard}
          >
            New Chat
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ width: '100%' }}>
        <p className="font-bold text-3xl mb-2">Templates</p>
        <p className="text-xl mb-12">
          Use these preconfigured prompt templates for help
        </p>
        <Grid container spacing={4}>
          <Grid item={4}>
            <Paper
              sx={{ height: '150px', width: '300px', textAlign: 'center' }}
            ></Paper>
          </Grid>
          <Grid item={4} sx={{ height: '200px' }}>
            <Paper
              sx={{ height: '150px', width: '300px', textAlign: 'center' }}
            ></Paper>
          </Grid>
          <Grid item={4} sx={{ height: '200px' }}>
            <Paper
              sx={{ height: '150px', width: '300px', textAlign: 'center' }}
            ></Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
