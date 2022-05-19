import * as distributedStore from 'src/distributedStore';
import io from 'socket.io-client';

function getFullHost(url) {
    return url.match(/(http(?:s?):\/\/.*?)(?:\/|$)/)[1];
}

let targetURL, cynovaStudioAPIURL, socket;

import { compile as compilers } from 'src/interfaces';

function compile(type, config, preview) {
    try {
        const key = preview ? 'preview' : 'config';
        const compiler = compilers[type];

        const compiled = compiler({ config });
        return compiled;
    } catch (e) {
        console.log('compiler error', e);
        return undefined;
    }
}

async function initServerSync(_targetURL) {
    if (!_targetURL) {
        return
    }
    if (targetURL && getFullHost(targetURL) === getFullHost(_targetURL)) {
        return;
    }
    targetURL = getFullHost(_targetURL) + '/';
    console.log('init server sync', targetURL)
}

distributedStore.watch('components.*.rules.*.config|selector', path => {
    const partial = path.slice(0, 4);
    if (partial.length !== 4) {
        return;
    }
    const rule = distributedStore.getByPath([partial]);
    const deleted = !rule?.config;
    let compiled;
    if (!deleted) {
        compiled = compile(rule.type, rule.config);
        if (rule?.config && compiled) {
            distributedStore.setByPath([partial, 'compiled'], compiled);
        }
    }
    if (compiled || deleted) {
        fetch(targetURL + '__studio_write', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: partial,
                compiled,
                type: rule?.type,
                config: rule?.config,
                selector: rule?.selector,
                deleted
            })
        })
    }
});
distributedStore.watch('components.*.config', path => {
    const partial = path.slice(0, 2);
    if (partial.length !== 2) {
        return;
    }
    const config = distributedStore.getByPath([partial, 'config']);

    fetch(targetURL + '__studio_write_config', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path: partial, config })
    })
});

export default initServerSync;
