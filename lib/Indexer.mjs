import Lemmatizer from 'javascript-lemmatizer';
import removePunctuation from 'remove-punctuation';
import fs from 'fs';
import { CRAWLER, DATABASE, DIRECTORY } from '../config';
import Database from './Database';
export const Indexer = {};
export default Indexer;

Indexer.LOG_COLOUR = "blue";

Indexer.lemmatize = (content) => {
    let lemmatizer = new Lemmatizer();
    let data = [];
    removePunctuation(content).replace(/[0-9]/g, '').split(" ").forEach(item => data.push(lemmatizer.only_lemmas(item.toLowerCase())));
    return [...new Set([].concat.apply([], data))];
};

Indexer.index = (id, data = []) => {
    let response = Database.fetch(DATABASE.INDEX_FILE);
    data.forEach(item => response[item] = (item in response) ? [...new Set([...response[item], id])] : [id]);
    fs.writeFileSync(`${DIRECTORY.DATABASE}/${DATABASE.INDEX_FILE}`, JSON.stringify(response));
};