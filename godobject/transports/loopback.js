import { clone } from '../../objects/clone.js';

const createTransport = () => {
    const clients = {};

    const createSide = (self, other) => ({
        transmit: data => {
            data = JSON.stringify(data);

            setTimeout(() => {
                clients[other].listeners.forEach(l => l(data));
            }, 100);
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
