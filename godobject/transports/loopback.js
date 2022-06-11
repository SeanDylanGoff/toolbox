import { clone } from '../../objects/clone.js';

const createTransport = () => {
    const clients = {};

    const createSide = (self, other) => ({
        transmit: data => {
            data = clone(data);
            clients[other].listeners.forEach(l => l(data));
        },
        addEventListener: listener => clients[self].listeners.push(listener),
        listeners: [],
        id: self,
    });

    clients.a = createSide('a', 'b');
    clients.b = createSide('b', 'a');

    return clients;
};

export default createTransport;
