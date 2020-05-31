import React, { useReducer, useEffect } from 'react';
import { Form, Input, Header, Divider, TextArea, Button, Grid, Message, Icon, Container } from 'semantic-ui-react';
import { isEmpty } from 'ramda';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AcklenHeart from './assets/AcklenHeart';

function App() {
  const [input, setInputValue] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      token: '',
      key: '',
      value: '',
    }
  );
  const generateToken = () => {
    fetch('https://data-clouds.herokuapp.com/token', {
      method: 'GET',
    })
      .then((response) => response.text())
      .then((result) => {
        setInputValue({ token: result });
        localStorage.setItem('token', result);
      })
  };
  useEffect(() => {
    const existingToken = localStorage.getItem('token');
    if (!existingToken) {
      generateToken();
    } else {
      setInputValue({ token: existingToken });
    }
  }, [])
  const { token, value, key } = input;

  const handleInputChange = event => {
    setInputValue({ [event.target.name]: event.target.value });
  };
  const createItem = () => {
    fetch(`https://data-clouds.herokuapp.com/values/${key}`, {
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
    fetch(`https://data-clouds.herokuapp.com/values/${key}`, {
      method: 'GET',
      headers: { 'token': token }
    })
      .then((response) => response.text())
      .then((result) => setInputValue({ value: result }))
  };
  return (
    <Container style={{ margin: '1em'}}>
      <ToastContainer />
      <div>
        <Header textAlign='center' style={{ fontSize: '20px' }}>
          MemStash
        </Header>
        <Form>
          <Form.Group widths='equal'>
            <Form.Field>
              <label>Token</label>
              <Input
                icon={<Icon name='recycle' inverted circular link onClick={generateToken} />}
                value={token}
                name='token'
                onChange={handleInputChange}
                placeholder='Enter a token'
              />
            </Form.Field>
            <Form.Field
              value={key}
              name='key'
              label='Key'
              onChange={handleInputChange}
              control={Input}
              placeholder='Enter a key to associate with the value'
            />
          </Form.Group>
          <Form.Field
            value={value}
            name='value'
            label='Value'
            onChange={handleInputChange}
            control={TextArea}
            placeholder='Enter a value to be saved with the key'
          />
        </Form>
        <Divider hidden />
        <Grid columns={2} stackable textAlign='center'>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column>
              <Button primary type='button' onClick={createItem} disabled={isEmpty(key && value)}>Test Put</Button>
              <Header>
                PUT Curl
              </Header>
              <Form>
                <Form.TextArea
                  readOnly
                  value={`curl -H "Content-Type: text/plain" -H "token: ${token}" --request PUT --data "${value}" https://data-clouds.herokuapp.com/values/${key}`}
                  style={{ minHeight: 100 }}
                />
              </Form>
            </Grid.Column>
            <Grid.Column>
              <Button primary type='button' onClick={getItem} disabled={isEmpty(key)}>Test Get</Button>
              <Header>
                GET Curl
                </Header>
              <Form>
                <Form.TextArea
                  readOnly
                  value={`curl -H "token: ${token}" --request GET https://data-clouds.herokuapp.com/values/${key}`}
                  style={{ minHeight: 100 }}
                />
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider hidden />
      </div>
      <Header textAlign='center' style={{ fontSize: '11px', bottom: '10px', left: '0px', right: '0px', padding: '5em 0em', height: '40px' }}>
        Made with
        <span style={{ verticalAlign: 'middle', marginLeft: '.3em', marginRight: '.3em' }} ><AcklenHeart /></span> by <a href='https://acklenavenue.com'>Acklen Avenue</a>
      </Header>
    </Container>
  );
}

export default App;
