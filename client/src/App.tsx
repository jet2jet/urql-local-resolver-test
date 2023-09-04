import * as React from 'react';
import { Client, Provider, fetchExchange } from 'urql';
import { Entity, cacheExchange } from '@urql/exchange-graphcache';

import TodoList from './TodoList';
import TodoDetail from './TodoDetail';

import * as schema from '../../schema.json';

const client = new Client({
  url: 'http://localhost:4000',
  exchanges: [
    cacheExchange({
      schema,
      keys: {
        TodoContainer: (_data) => null,
      },
      resolvers: {
        TodoContainer: {
          todo: (parent, args, cache, _info) => {
            const cached = cache.resolve(parent as Entity, 'todo', args);
            if (cached != null) {
              return cached;
            }
            if (args.id != null) {
              return {
                __typename: 'Todo',
                id: args.id,
              };
            }
            return undefined;
          },
        },
      },
    }),
    fetchExchange,
  ],
});

function App() {
  const [detailed, setDetailed] = React.useState(false);
  const [id, setId] = React.useState<string | null>(null);
  const onChangeDetailedCheckbox = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDetailed(e.target.checked);
    },
    []
  );
  const refInput = React.useRef<HTMLInputElement>(null);
  const onSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (refInput.current == null) {
      return;
    }
    setId(refInput.current.value);
  }, []);

  return (
    <Provider value={client}>
      <section>
        <h2>List</h2>
        <p>
          <label>
            <input type="checkbox" onChange={onChangeDetailedCheckbox} />{' '}
            Request detailed data
          </label>
        </p>
        <TodoList detailed={detailed} />
      </section>
      <section>
        <h2>Detail</h2>
        <form onSubmit={onSubmit}>
          <p>
            ID: <input ref={refInput} type="text" />{' '}
            <input type="submit" value="Get" />
          </p>
        </form>
        {id != null && <TodoDetail id={id} />}
      </section>
    </Provider>
  );
}

export default App;
