import { effect } from './efffect';
import { handler } from './proxy';

const data = {status: true, text: 'hello'};
const obj = new Proxy<{
    status: boolean;
    text: string;
}>(data, handler);


effect(() => {
    console.log('exe');
    document.body.innerText = obj.status ? obj.text : 'not'
});

