import fs from 'fs/promises';

async function runTests(dir) {
    const files = await fs.readdir(dir);
    const tests = files.filter(file => /.+\.test\.js/.test(file));
    tests.forEach(test => {
        console.log(`running ${test}`);
        import(`${dir}${test}`);
    });
}

runTests('./objects/');
