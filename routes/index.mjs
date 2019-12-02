import express from 'express';
import Database from '../lib/Database';
import Indexer from '../lib/Indexer';
import { DATABASE } from '../config';
import removePunctuation from 'remove-punctuation';
import { start } from 'repl';

const router = express.Router();

router.get('/', (request, response) => {
    let results = [];
    if (request.query.search) {
        let startDate;
        let endDate;
        try {
            if (request.query.search.includes("STARTDATE:")) {
                let wordArray = request.query.search.split(" ")
                let date = wordArray[wordArray.indexOf("STARTDATE:") + 1];
                startDate = new Date(date.split('/')[2], date.split('/')[1] - 1, date.split('/')[0]);
                request.query.search.replace("STARTDATE:", "").replace(startDate, "");
            }
            if (request.query.search.includes("ENDDATE:")) {
                let wordArray = request.query.search.split(" ");
                let date = wordArray[wordArray.indexOf("ENDDATE:") + 1];
                endDate = new Date(date.split('/')[2], date.split('/')[1] - 1, date.split('/')[0]);
                request.query.search.replace("ENDDATE:", "").replace(endDate, "");
            }
        } catch(error) {
            console.log(error);
        }

        let search = [];
        if (request.query.search.includes("AND")) search = request.query.search.split("AND");
        else search = [request.query.search];
        let links = [];
        search.forEach(query => {
            let queryArray = query.split(" ");
            let negate;
            let negateResponse;
            queryArray.forEach((word, index) => { if (word === "NOT") negate = queryArray[index + 1]; });
            if (negate) query = query.replace("NOT", "").replace(negate, "");
            let response = Database.query(query);
            if (negate) negateResponse = Database.query(negate);
            if (negateResponse) { response.forEach(id => { if (negateResponse.includes(id)) response.remove(id); }) };
            links.push(response);
        });

        let intersection = links.reduce((a, b) => a.filter(c => b.includes(c)));
        let queryArray = Indexer.lemmatize(request.query.search);
        let TFIDFIDArray = Database.TFIDF(intersection, queryArray);
        results = Database.collate(TFIDFIDArray);

        let resultsStart = [];
        let resultsEnd = [];

        if (startDate) {
            results.forEach((result, index) => {
                let date = new Date(result.pubDate);
                if (date > startDate) { resultsStart.push(result); }
            });
            results = resultsStart;
        }

        if (endDate) { 
            results.forEach((result, index) => {
                let date = new Date(result.pubDate);
                if (date < endDate) { resultsEnd.push(result); }
            });
            results = resultsEnd;
        }
    }
    response.render('home', { "results": results });
});

export const indexRouter = router;

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};