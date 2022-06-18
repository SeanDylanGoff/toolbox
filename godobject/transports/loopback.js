import { clone } from '../../objects/clone.js';

const createTransport = () => {
    const clients = {};

    const createSide = (self, other) => {
        const peer = {
            statistics: {
                sent: {
                    bytes: 0,
                },
            },
            transmit: data => {
                data = JSON.stringify(data);

                peer.statistics.sent.bytes += data.length;
                data = JSON.parse(data);

                setTimeout(() => {
                    clients[other].listeners.forEach(l => l(data));
                }, 100);
            },
            addEventListener: listener =>
                clients[self].listeners.push(listener),
            listeners: [],
            id: self,
        };
        return peer;
    };

    clients.a = createSide('a', 'b');
    clients.b = createSide('b', 'a');

    return clients;
};

export default createTransport;
