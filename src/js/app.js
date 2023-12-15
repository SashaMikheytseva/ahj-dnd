import Card from './Card';
import Columns from './Columns';
import Control from './mouseControl';

const container = document.querySelector('.container');
const start = new Control(container);
start.bindToDOM();
