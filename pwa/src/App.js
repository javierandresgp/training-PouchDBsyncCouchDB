import 'bootstrap/dist/css/bootstrap.min.css';
import {
  deleteTodo,
  readTodo,
  readTodos,
  updateTodo,
} from './helpers/apiRequests';
import { Container } from 'react-bootstrap';
import Badge from 'react-bootstrap/Badge';
import { Entry } from './components/Entry';
import { List } from './components/List';

import { useEffect, useState } from 'react';
import { localInfo, localShowDocs } from './helpers/pouchRequests';
import { EntryPouch } from './components/EntryPouch';
import { ListPouch } from './components/ListPouch';

function App() {
  const [online, setOnline] = useState(null);
  const [todos, setTodos] = useState(null);
  const [pouchTodos, setPouchTodos] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [pending, setPending] = useState([]);
  const [viewObj, setViewObj] = useState(null);

  useEffect(() => {
    setOnline(navigator.onLine);
  }, []);

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    if (todos) {
      classify();
    }
  }, [todos]);

  useEffect(() => {
    localInfo();
  }, []);

  useEffect(() => {
    getPouchTodos();
  }, []);

  const getPouchTodos = async () => {
    const r = await localShowDocs();
    console.log('r', r);
    //setPouchTodos(await localShowDocs());
  };

  const getTodos = async () => {
    setTodos(await readTodos());
  };

  const classify = () => {
    setCompleted(todos?.filter((todo) => todo.completed));
    setPending(todos?.filter((todo) => !todo.completed));
  };

  const getObj = async (id) => {
    setViewObj(JSON.stringify(await readTodo(id)));
  };

  const update = async (aObj) => {
    const obj = { ...aObj, completed: true };
    const r = await updateTodo(obj);
    if (r) {
      getTodos();
    }
  };

  const remove = async (id) => {
    const r = await deleteTodo(id);
    if (r) {
      getTodos();
    }
  };

  console.log('online: ', online);
  console.log('pouchTodos: ', pouchTodos);

  return (
    <Container className='text-center'>
      <h2 className='mt-5 mb-1'>My To Do List</h2>
      <h5>pouchRequests</h5>
      <h6 className='mt-1 mb-5'>
        <Badge pill bg={online ? 'success' : 'warning'} text='dark'>
          {online ? 'online' : 'offline'}
        </Badge>
      </h6>
      <EntryPouch getTodos={getTodos} />
      <ListPouch
        todos={todos}
        getTodos={getTodos}
        classify={classify}
        pending={pending}
        getObj={getObj}
        update={update}
        remove={remove}
        completed={completed}
        viewObj={viewObj}
      />
      <hr className='mt-5' />
      <hr />
      <hr className='mb-5' />
      <h2 className='mt-5 mb-1'>My To Do List</h2>
      <h5>apiRequests</h5>
      <h6 className='mt-1 mb-5'>
        <Badge pill bg={online ? 'success' : 'warning'} text='dark'>
          {online ? 'online' : 'offline'}
        </Badge>
      </h6>
      <Entry getTodos={getTodos} />
      <List
        todos={todos}
        getTodos={getTodos}
        classify={classify}
        pending={pending}
        getObj={getObj}
        update={update}
        remove={remove}
        completed={completed}
        viewObj={viewObj}
      />
    </Container>
  );
}

export default App;
