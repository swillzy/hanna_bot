const cheerio = require("cheerio");
const axios = require('axios');

const fetchHtml = async url => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (e) {
        console.error(
            `ERROR: An error occurred while trying to fetch the URL: ${url}\n${e}`
        );
    }
};

const lyricSearch = async query => {
    query = query.replace(/ /g, '+');
    const searchURL = `https://www.google.com/search?gws_rd=ssl&site=&source=hp&q=${query}&oq=${query}&hl=en`;

    const html = await fetchHtml(searchURL);
    const selector = cheerio.load(html);

    const searchResults = selector('body').find('.xpd > .kCrYT > a');

    const urls = searchResults.map((i, el) => {
        const elementSelector = selector(el);
        if (elementSelector.attr('href').toString().startsWith('/url?q=https://www.musixmatch.com') &&
            !elementSelector.find('.UPmit').text().includes('translation')) return elementSelector.attr('href').toString().split('?q=').pop().split('&sa=').shift();
    }).get();

    return urls;
};

const lyricParse = async url => {
    const html = await fetchHtml(url);
    const selector = cheerio.load(html);

    const result = selector('body').find('.mxm-lyrics span');

    const urls = result.map((i, el) => {
        const elementSelector = selector(el);
        l = elementSelector.find('p.mxm-lyrics__content > span.lyrics__content__ok').text();
        return l;
    });
    return urls;
}

const getLyric = async query => {
    try {
        const url = await lyricSearch(query.toString());
        const lyricURL = url[Object.keys(url)[0]];
        const l = await lyricParse(lyricURL.toString());
        const track = lyricURL.split('/lyrics/').pop().replace(/-/g, ' ').replace('/', ' | ');
        const lyric = l['0'];
        return { "track": track, "lyric": lyric.toString().trim() };
    } catch (e) {
        return {"error": e};
    }
}

exports.getLyric = getLyric;
