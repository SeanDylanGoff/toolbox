const createTransport = () => {
    const clients = {};

    const createSide = (self, other) => {
        const peer = {
            transmit: (channel, data) => {
                let payload = JSON.stringify({ channel, data });

                const length = payload.length;
                payload = JSON.parse(payload);

                setTimeout(() => {
                    clients[other].listeners[channel].forEach(l =>
                        l(data, length)
                    );
                }, 100);

                return length;
            },
            addEventListener: (channel, listener) => {
                clients[self].listeners[channel] ||= [];
                clients[self].listeners[channel].push(listener);
            },
            listeners: {},
            id: self,
        };
        return peer;
    };

    clients.a = createSide('a', 'b');
    clients.b = createSide('b', 'a');

    return clients;
};

export default createTransport;
