import React, { useState, useReducer, useEffect } from 'react';
import { Form, Input, Header, Divider, TextArea, Button, Grid, Message } from 'semantic-ui-react';
import { isEmpty } from 'ramda';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AcklenHeart from './assets/AcklenHeart';

function App() {
  const [input, setInputValue] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      token: '',
      key: 'someKey',
      value: 'Add data to be saved here',
    }
  );
  const [itemValue, setValue] = useState('');
  useEffect(() => {
    const existingToken = localStorage.getItem('token');
    if(!existingToken){
      fetch('https://data-clouds.herokuapp.com/api/token', {
        method: 'GET',
      })
        .then((response) => response.text())
        .then((result) => {
          setInputValue({ token: result });
          localStorage.setItem('token', result);
        })
    } else {
      setInputValue({token: existingToken});
    }
  }, [])
  const { token, value, key } = input;

  const handleInputChange = event => {
    setInputValue({ [event.target.name]: event.target.value });
  };
  const createItem = () => {
    fetch(`https://data-clouds.herokuapp.com/api/value/${key}`, {
      method: 'PUT',
      headers: {
        'token': token
      },
      body: value
    })
      .then(result => {
        if (result.status === 200) {
          toast.success('Value has been saved.')
        } else {
          toast.error('Please, validate all fields have been filled.');
        }
      });
    setInputValue({ value: '' });
  };
  const getItem = () => {
    fetch(`https://data-clouds.herokuapp.com/api/value/${key}`, {
      method: 'GET',
      headers: { 'token': token }
    })
      .then((response) => response.text())
      .then((result) => setValue(result))
  };
  return (
    <div style={{ margin: '1em' }}>
      <ToastContainer />
      <Header textAlign='center' style={{fontSize: '20px'}}>
        MemStash
      </Header>
      <Form>
        <Form.Group widths='equal'>
          <Form.Field
            label='Token'
            value={token}
            name='token'
            onChange={handleInputChange}
            control={Input}
            placeholder='Enter a token'
          />
          <Form.Field
            value={key}
            name='key'
            label='Key'
            onChange={handleInputChange}
            control={Input}
            placeholder='Enter a key to identify value'
          />
        </Form.Group>
        <Form.Field
          value={value}
          name='value'
          label='Value'
          onChange={handleInputChange}
          control={TextArea}
          placeholder='Enter data to be saved'
        />
      </Form>
      <Divider hidden />
      <Grid columns={2} stackable textAlign='center'>
        <Grid.Row>
          <Grid.Column>
            <Button type='button' onClick={createItem} disabled={isEmpty(key && value)}>Test Put</Button>
          </Grid.Column>
          <Grid.Column>
            <Button type='button' onClick={getItem} disabled={isEmpty(key)}>Test Get</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Divider hidden />
      <Grid columns={2} stackable textAlign='center'>
        <Grid.Row verticalAlign='middle'>
          <Grid.Column>
            <Header>
              PUT Curl
              </Header>
            <Message compact>
              {`
                  curl -H "Content-Type: text/plain" -H "token: ${token}" --request PUT --data "${value}" https://data-clouds.herokuapp.com/api/value/${key}
                `}
            </Message>
          </Grid.Column>
          <Divider vertical hidden />
          <Grid.Column>
            <Header>
              GET Curl
              </Header>
            <Message compact>
              {`
                curl -H "token: ${token}" --request GET https://data-clouds.herokuapp.com/api/value/${key}
              `}
            </Message>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Divider hidden />
      {!isEmpty(itemValue) &&
        <span>
          {
            itemValue
          }
        </span>
      }
      <Header textAlign='center' style={{fontSize: '11px', position: 'fixed', bottom: '12px', left: '0px', right: '0px'}}>
        Made with <AcklenHeart /> by Acklen Avenue
      </Header>
    </div>
  );
}

export default App;
