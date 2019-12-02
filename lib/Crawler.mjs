import Parser from 'rss-parser';
import { CRAWLER, DATABASE, DIRECTORY } from '../config';
import Log from './Log';
import Database from './Database';
import Indexer from './Indexer';
export const Crawler = {};
export default Crawler;

Crawler.LOG_COLOUR = "green";

Crawler.crawlLock = false;

Crawler.init = () => CRAWLER.SOURCES.forEach(async URL => Crawler.controller(URL));

Crawler.controller = async (URL, refreshRate = CRAWLER.REFRESH_RATE) => {
    let parser = new Parser();
    Log.update("crawler", "controller", `Refreshing ${URL} at ${+ new Date()} (${refreshRate}).`, Crawler.LOG_COLOUR);
    try {
        // Get all feeds.
        let feeds = (await parser.parseURL(URL)).items;
        // Get feeds which are new.
        let newFeeds = Database.new(DATABASE.FEED_FILE, feeds);
        // If there are new feeds.
        if (newFeeds.length > 0) {
            // Speed up refresh rate.
            refreshRate = Math.round(refreshRate * 0.9);
            // Get the next ID value from feed file.
            let nextID = Database.fetch(DATABASE.FEED_FILE).length;
            // Push the new feeds into the feed file.
            Database.push(DATABASE.FEED_FILE, newFeeds);
            // For every new feed.
            newFeeds.forEach((item, index) => {
                // Lemmatize the items content.
                let wordList = Indexer.lemmatize(item.content + " " + item.title);
                // Index at the next ID.
                Indexer.index(index + nextID, wordList);
                Log.update("indexer", "index", `Indexing article from ${URL}.`, Indexer.LOG_COLOUR);
            });               
        } else {
            refreshRate = Math.round(refreshRate * 1.1);
        }
    } catch(error) {
        Log.update("crawler", "request", `Unable to reach ${URL}.`, "red");
    }
    await timeout(refreshRate);
    Crawler.controller(URL, refreshRate);
}

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));