import React, { useState, useReducer, useEffect } from 'react';
import { Form, Input, Header, Divider, TextArea, Message } from 'semantic-ui-react';
import { isEmpty } from 'ramda';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [input, setInputValue] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      newToken: '',
      key: '',
      newKey: '',
      value: '',
      token: ''
    }
  );
  const [itemValue, setValue] = useState('');
  useEffect(() => {
    fetch('https://data-clouds.herokuapp.com/api/token', {
      method: 'GET',
    })
      .then((response) => response.text())
      .then((result) => setInputValue({ newToken: result }))
  }, [])
  const { newToken, token, key, value, newKey } = input;

  const handleInputChange = event => {
    setInputValue({ [event.target.name]: event.target.value });
  };
  const createItem = () => {
    fetch(`https://data-clouds.herokuapp.com/api/value/${newKey}`, {
      method: 'PUT',
      headers: {
        'token': newToken
      },
      body: value
    })
    .then(result => {
      if(result.status === 200){
        toast.success('Value has been saved.')
      } else {
        toast.error('Please, validate all fields have been filled.');
      }
    })
  };
  const getItem = () => {
    fetch(`https://data-clouds.herokuapp.com/api/value/${key}`, {
      method: 'GET',
      headers: { 'token': token }
    })
      .then((response) => response.text())
      .then((result)=> setValue(result))
  };
  return (
    <div style={{ margin: '1em' }}>
      <ToastContainer />
      <Header content='Create Key and Value' />
      <Form>
        <Form.Group widths='equal'>
          <Form.Field
            value={newToken}
            name='newToken'
            label='Token'
            onChange={handleInputChange}
            control={Input}
            placeholder='Enter a token'
          />
          <Form.Field
            value={newKey}
            name='newKey'
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
        <Form.Button type='button' onClick={createItem} disabled={isEmpty(newToken)}>Create</Form.Button>
      </Form>
      <Divider hidden />
      <Header content='Get Value' />
      <Form>
        <Form.Group widths='equal'>
          <Form.Field
            value={token}
            name='token'
            label='Token'
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
        <Form.Button type='button' onClick={getItem} disabled={isEmpty(token)}>Get</Form.Button>
      </Form>
      <Divider hidden />
      {!isEmpty(itemValue) &&
        <span>
          {
            itemValue
          }
        </span>
      }
    </div>
  );
}

export default App;
