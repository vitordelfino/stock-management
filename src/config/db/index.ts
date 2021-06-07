import { resolve } from 'path';
import { createConnections, useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';

import { dbConnections, server } from '../globals';
useContainer(Container);
const connection = createConnections([
  {
    name: dbConnections.mongo.name,
    type: 'mongodb',
    url: dbConnections.mongo.conn,
    entities: [resolve(__dirname, '../../apps/**/*.entity.ts')],
    useNewUrlParser: true,
    useUnifiedTopology: true,
    synchronize: server.env === 'dev', // Se o ambiente for dev, o typeorm se incarrega de gerar e alterar as tabelas
  },
]);

export default connection;
