import path from 'path';

export const SERVER = {
    'PORT': 80,
    'VIEW_ENGINE': 'ejs'
};

export const DIRECTORY = {
    'VIEWS': path.join(path.resolve(), 'views'),
    'PUBLIC': path.join(path.resolve(), 'public'),
    'DATABASE': path.join(path.resolve(), 'database'),
    'ROUTES': path.join(path.resolve(), 'routes')
};

export const ROUTES = {
    'INDEX': {
        'name': 'index',
        'path': '/'
    },
    'SEARCH': {
        'name': 'search',
        'path': '/search'
    }
}

export const DATABASE = {
    'FEED_FILE': 'feed.json',
    'INDEX_FILE': 'index.json'
}

export const CRAWLER = {
    // 'REFRESH_RATE': 600000,
    'REFRESH_RATE': 10000,
    'SOURCES': [
        "https://latesthackingnews.com/feed",
        "http://feeds.feedburner.com/ehacking",
        "http://feeds.feedburner.com/TheHackersNews",
        "https://feeds.feedburner.com/eset/blog/",
        "https://www.hackerone.com/blog.rss"
    ]
};