import fs from 'fs';
import Indexer from './Indexer';
import Crawler from './Crawler';
import striptags from 'striptags';
import Log from './Log';
import { DIRECTORY, DATABASE } from '../config';
export const Database = {};
export default Database;

Database.LOG_COLOUR = "red";

Database.fetch = file => JSON.parse(fs.readFileSync(`${DIRECTORY.DATABASE}/${file}`));

Database.replace = (file, data = []) => {
    let response = Database.fetch(file);
    let merge = response.concat(data);
    let unique = merge.filter((item, index) => merge.indexOf(item) === index);
    if (response.length < unique.length) fs.writeFileSync(`${DIRECTORY.DATABASE}/${file}`, JSON.stringify(unique));
    return unique.length - response.length;
};

Database.push = (file, data = []) => fs.writeFileSync(`${DIRECTORY.DATABASE}/${file}`, JSON.stringify([...Database.fetch(file), ...data]));

Database.new = (file, data = []) => {
    let response = [];
    data.forEach(item => {
        let found = false
        Database.fetch(file).forEach(feed => { if (item.guid === feed.guid) found = true });
        if (!(found)) response.push(item);
    });
    return response;
}

Database.query = content => {
    Log.update("database", "query", `Querying database for "${content}".`, Database.LOG_COLOUR);
    content = Indexer.lemmatize(content);
    let results = []
    content.forEach(item => results.push(...Database.find(item)));
    return results.byCount();
};

Database.find = word => {
    let response = Database.fetch(DATABASE.INDEX_FILE);
    if (word in response) return response[word];
    else return [];
};

Database.collate = data => {
    Log.update("database", "collate", `Collating articles for ${data.length} results.`, Database.LOG_COLOUR);
    let results = [];
    let response = Database.fetch(DATABASE.FEED_FILE);
    data.forEach(index => results.push(response[index]));
    return results;
};

Database.TFIDF = (IDArray, queryArray) => {
    let index = Database.fetch(DATABASE.INDEX_FILE);
    let feed = Database.fetch(DATABASE.FEED_FILE);
    const IDF = {};
    const TFIDF = {};
    queryArray.forEach(query => { if (query in index) IDF[query] = Math.log(feed.length / index[query].length); });
    IDArray.forEach(id => {
        let TFIDFValue = 0;
        let article = feed[id];
        let wordArray = Indexer.lemmatize(article.title + " " + article.content);
        Object.keys(IDF).forEach(query => {
            let wordCount = 0;
            wordArray.forEach(word => { if (query === word) wordCount += 1; });
            TFIDFValue += (wordCount / wordArray.length) * IDF[query];
            return true;
        });
        TFIDF[id] = TFIDFValue;
    });
    return (Object.keys(TFIDF).sort((a, b) => TFIDF[a] - TFIDF[b])).reverse();
}

// Database.collate = data => {
//     Log.update("database", "collate", `Collating articles for ${data.length} results.`, Database.LOG_COLOUR);
//     let results = [];
//     let response = Database.fetch(DATABASE.FEED_FILE);
//     data.forEach(link => response.forEach(feed => { if (feed.link === link) results.push(feed) }));
//     results.forEach(feed => feed.content = striptags(feed.content));
//     return results;
// };

Array.prototype.byCount= function(){
    var itm, a= [], L= this.length, o= {};
    for(var i= 0; i<L; i++){
        itm= this[i];
        if(!itm) continue;
        if(o[itm]== undefined) o[itm]= 1;
        else ++o[itm];
    }
    for(var p in o) a[a.length]= p;
    return a.sort(function(a, b){
        return o[b]-o[a];
    });
}