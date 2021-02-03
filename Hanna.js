const Discord = require('discord.js');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
const youtubeSearch = require('yt-search');
const ytdl = require('ytdl-core-discord');
const lyrics = require('./cogs/lyrics');
const spotifyTracker = require('./cogs/spotifyTracker');
const util = require('util');

const colors = {
    'primary': '#f175a9',
    'secondary': '#deadb8',
    'error': '#ff5959',
    'success': '#35ff35',
    'warning': '#fecb01'
}
const codeBlock = '```';

const hanna = new Discord.Client({
    autoReconnect: true,
    retryLimit: Infinity,
    fetchAllMembers: false,
    intents: Discord.Intents.NON_PRIVILEGED
});

hanna.queues = new Map();
var serverOptions = {
    'prefix': 'han!',
    'language': 'en'
}

const activities_list = [
    Date.now(),
    `try ${serverOptions.prefix}help`,
    "Darling 💜",
    "under development..."
];

hanna.on('ready', () => {
    console.log(`Logged as ${hanna.user.tag}`);

    serverOptions.prefix = '!';
    serverOptions.language = 'en';

    var index = 0;
    setInterval(function () {
        var daysUp = '';
        if (index == 0) {
            daysUp = Math.ceil((Date.now() - activities_list[index]) / (1000 * 3600 * 24)).toString();
            daysUp += `${daysUp > 1 ? ' days' : ' day'} online.`;
        }
        hanna.user.setActivity(index == 0 ? daysUp : activities_list[index], { type: 'STREAMING', url: 'https://www.twitch.tv/uiriansan' });
        index == activities_list.length - 1 ? index = 0 : index++;
    }, 15000);
});

function generateRandomExcept(len, exc) {
    var num = Math.floor(Math.random() * (len)) + 1;
    return (exc.includes(num)) ? generateRandomExcept(len, exc) : num;
}

hanna.on('message', msg => {
    if (!msg.content.startsWith(serverOptions.prefix)) return;

    if (msg.channel.type === 'dm') return msg.reply(new Discord.MessageEmbed().setColor(colors.primary).setAuthor(hanna.user.username, hanna.user.avatarURL().toString(), hanna.user.avatarURL().toString()).setTitle('Darling no ecchi').setDescription("Hanna doesn't answer dms\n💜"))

    const args = msg.content.trim().split(/ +/g);
    const cmd = args[0].slice(serverOptions.prefix.length).toLowerCase();

    if (['ping', 'latency'].includes(cmd)) {
        const embed = new Discord.MessageEmbed()
            .setColor(colors.primary)
            .setAuthor(hanna.user.username, hanna.user.avatarURL().toString(), hanna.user.avatarURL().toString())
            .setDescription(`<@${msg.author.id}>\n\n🏓 ** Pong!**\n\n${codeBlock}⌚ ${Date.now() - msg.createdTimestamp}ms | 🤖 ${Math.round(hanna.ws.ping)}ms${codeBlock}`);
        msg.channel.send(embed);
    } else if (['clear', 'delete'].includes(cmd)) {
        if (msg.member.hasPermission("MANAGE_MESSAGES")) {
            msg.channel.messages.fetch().then(function (list) {
                msg.channel.bulkDelete(args[1] ? args[1] : list);
                messageCount = args[1] ? args[1] : list.size;
                const embed = new Discord.MessageEmbed()
                    .setColor(colors.primary)
                    .setAuthor(hanna.user.username, hanna.user.avatarURL().toString(), hanna.user.avatarURL().toString())
                    .setDescription(`<@${msg.author.id}>\n\n✅ **${messageCount} messages deleted!**`)
                msg.channel.send(embed);
            }, function (err) { msg.channel.send("ERROR: ERROR CLEARING CHANNEL.") })
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor(colors.primary)
                .setThumbnail('https://http.cat/101')
                .setAuthor(hanna.user.username, hanna.user.avatarURL().toString(), hanna.user.avatarURL().toString())
                .setDescription(`<@${msg.author.id}>\n\n🎫 **Not enough permissions.**`)
            msg.channel.send(embed);
        }
    } else if (['gen', 'generate', 'create'].includes(cmd)) {
        if (args[1]) {
            if (args[1].toLowerCase() == 'cat') {
                msg.channel.startTyping();
                axios.get('https://aws.random.cat/meow').then(function (response) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(colors.primary)
                        .setAuthor(hanna.user.username, hanna.user.avatarURL().toString(), hanna.user.avatarURL().toString())
                        .setTitle("💜 Here's your cutie!")
                        .setImage(response.data.file)
                        .setDescription(`<@${msg.author.id}>`)
                    msg.channel.send(embed);
                }).catch(function (e) {
                    console.log(e);
                });
                msg.channel.stopTyping();
            } else if (args[1].toLowerCase() == 'dog') {
                msg.channel.startTyping();
                axios.get('https://random.dog/woof.json').then(function (response) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(colors.primary)
                        .setAuthor(hanna.user.username, hanna.user.avatarURL().toString(), hanna.user.avatarURL().toString())
                        .setTitle("💜 Here's your cutie!")
                        .setDescription(`<@${msg.author.id}>`)
                        .setImage(response.data.url)
                    msg.channel.send(embed);
                }).catch(function (e) {
                    console.log(e);
                });
                msg.channel.stopTyping();
            } else if (args[1].toLowerCase() == 'fox') {
                msg.channel.startTyping();
                axios.get('https://randomfox.ca/floof/').then(function (response) {
                    const embed = new Discord.MessageEmbed()
                        .setColor(colors.primary)
                        .setAuthor(hanna.user.username, hanna.user.avatarURL().toString(), hanna.user.avatarURL().toString())
                        .setTitle("💜 Here's your cutie!")
                        .setDescription(`<@${msg.author.id}>`)
                        .setImage(response.data.image)
                    msg.channel.send(embed);
                }).catch(function (e) {
                    console.log(e);
                });
                msg.channel.stopTyping();
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(colors.primary)
                    .setAuthor(hanna.user.username, hanna.user.avatarURL().toString(), hanna.user.avatarURL().toString())
                    .setTitle("Oops...")
                    .setDescription(`<@${msg.author.id}>\n\nUse **gen *animal,***\nwhere "animal" can be:\n\n🐱 cat\n🐶 dog\n🦊 fox`)
                msg.channel.send(embed);
            }
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor(colors.primary)
                .setAuthor(hanna.user.username, hanna.user.avatarURL().toString(), hanna.user.avatarURL().toString())
                .setTitle("Oops...")
                .setThumbnail('https://http.cat/404')
                .setDescription(`<@${msg.author.id}>\n\nUse **gen *animal,***\nwhere "animal" can be:\n\n🐱 cat\n🐶 dog\n🦊 fox`)
            msg.channel.send(embed);
        }
    } else if (cmd == 'help') {
        sendHelp(msg, null, args[1]);
    } else if (cmd == 'play') {
        const song = args.slice(1).join(' ');

        if (!msg.member.voice.channel)
            return msg.channel.send('Not in a voice channel.');

        const permissions = msg.member.voice.channel.permissionsFor(msg.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return msg.channel.send(
                "I need the permissions to join and speak in your voice channel!"
            );
        }

        youtubeSearch(song, async (err, response) => {
            if (err) throw err;
            if (response && response.videos.length > 0) {
                const song = response.videos[0];

                if (!hanna.queues.get(msg.guild.id)) {
                    q = {
                        volume: 100,
                        muted: false,
                        connection: connection,
                        dispatcher: null,
                        songs: []
                    };

                    hanna.queues.set(msg.guild.id, q);
                    q.songs.push(song);

                    try {
                        var connection = await msg.member.voice.channel.join();
                        q.connection = connection;
                        play(msg, q.songs[0]);
                    } catch (e) {
                        hanna.queues.delete(msg.guild.id);
                        return console.error(e);
                    }
                } else {
                    let q = hanna.queues.get(msg.guild.id);
                    q.songs.push(song);
                    return msg.channel.send(`${song.title} has been added to the queue!`);
                }
            }
        });


    } else if (['np', 'nowplaying', 'nowplay'].includes(cmd)) {
        let q = hanna.queues.get(msg.guild.id);
        if (q) msg.reply(q.songs[0].title);
    } else if (['disconnect', 'stop'].includes(cmd)) {
        let q = hanna.queues.get(msg.guild.id);
        if (q) {
            q.connection.disconnect();
            hanna.queues.delete(msg.guild.id);
        }
    } else if (cmd == 'createdata') {
        let q = hanna.queues.get(msg.guild.id);
        fs.writeFile('./assets/data.json', q ? util.inspect(q) : JSON.stringify(hanna.queues), function (err, data) {
            if (err) return;
        });
    } else if (['next', 'skip', 'prox', 'proxima', 'song++'].includes(cmd)) {
        let q = hanna.queues.get(msg.guild.id);
        if (q && q.songs.length > 1) {
            q.dispatcher.end();
        }
    } else if (['pause'].includes(cmd)) {
        let q = hanna.queues.get(msg.guild.id);
        if (q) q.dispatcher.pause();
    } else if (['resume'].includes(cmd)) {
        let q = hanna.queues.get(msg.guild.id);
        if (q) q.dispatcher.resume();
    } else if (cmd == 'getq') {
        let q = hanna.queues.get(msg.guild.id);
        if (q) {
            msg.reply(JSON.stringify(q.songs).toString());
        }
    } else if (['lyrics', 'lyric', 'letra', 'lyr'].includes(cmd)) {
        let q = hanna.queues.get(msg.guild.id);
        if (args[1]) {
            getLyrics(msg, args.slice(1).join(' '));
        } else if (q) {
            getLyrics(msg, q.songs[0].title.replace(/ *\[[^\]]*]/g, '').replace(/ *\([^)]*\) */g, ''));
        } else {

        }
    } else if (['queue', 'q', 'songs', 'songlist'].includes(cmd)) {
        let q = hanna.queues.get(msg.guild.id);

        if (q) {
            var songs = `${codeBlock}md`;
            q.songs.forEach(function (element, i) {
                let current = i == 0 ? '\n──────────\n' : '';
                songs += `\n\n${current}[${element.timestamp}](${element.title.substr(0, 46)})\n${element.author.name} | ${numberSeparator(element.views)} views${current}`;
            });
            songs += `${codeBlock}`;

            const embed = new Discord.MessageEmbed()
                .setColor(colors.primary)
                .setTitle(`Playing next`)
                .setAuthor(hanna.user.username, hanna.user.avatarURL().toString(), hanna.user.avatarURL().toString())
                .setDescription(`<@${msg.author.id}>\n\n${songs}`)
                .setThumbnail(q.songs[0].thumbnail)
            msg.channel.send(embed);
        }
    } else if (['mute'].includes(cmd)) {
        let q = hanna.queues.get(msg.guild.id);
        q.dispatcher.setVolumeLogarithmic(0.0);
        q.muted = true;
    } else if (['unmute'].includes(cmd)) {
        let q = hanna.queues.get(msg.guild.id);
        q.dispatcher.setVolumeLogarithmic(q.volume / 100);
        q.muted = false;
    } else if (['status'].includes(cmd)) {
        let q = hanna.queues.get(msg.guild.id);
        if (q) {
            const muted = q.muted;
            const isPaused = q.dispatcher.paused;
            const queueSize = q.songs.length;
            const embed = new Discord.MessageEmbed()
                .setColor(colors.primary)
                .setTitle(`Playing status`)
                .setAuthor(hanna.user.username, hanna.user.avatarURL().toString(), hanna.user.avatarURL().toString())
                .setDescription(`<@${msg.author.id}>\n`)
                .addFields({ name: isPaused ? '⏸ Hanna is paused' : '▶️ Hanna is playing', value: isPaused ? `Type "${serverOptions.prefix}resume"` : '...' },
                    { name: muted ? '🔇 Hanna is muted' : '🔊 Hanna is singing', value: muted ? `Type "${serverOptions.prefix}unmute"` : `You can adjust the volume with "${serverOptions.prefix}volume <value>"` },
                    { name: `🎶 ${queueSize} songs on queue`, value: `Type "${serverOptions.prefix}queue"` })
            msg.channel.send(embed);
        } else {
            msg.reply("Hanna isn't playing on this server...");
        }
    } else if (['shuffle', 'ramdom', 'randomize', 'rdm'].includes(cmd)) {
        let q = hanna.queues.get(msg.guild.id);
        if (!q) return;

        shuffle(q.songs);
    } else {
        sendHelp(msg, cmd, null);
    }
});

function numberSeparator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function shuffle(array, playingIndex = 0) {
    var currentIndex = array.length, temporaryValue, randomIndex, currentPlaying = array[playingIndex];
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    // Keep the current playing song alwways on the same position in array
    let currentPlayingLocation = array.indexOf(currentPlaying);
    let aux = array[playingIndex];
    array[playingIndex] = array[currentPlayingLocation];
    array[currentPlayingLocation] = aux;

    return array;
}

async function sendHelp(msg, command = null, category = null) {
    category = category ? category.toLowerCase() : category;
    if (category == 'moderation') {
        getHelp(msg, 'moderation');
    } else if (category == 'music') {
        getHelp(msg, 'music');
    } else if (category == 'fun') {
        getHelp(msg, 'fun');
    } else if (category == 'utils') {
        getHelp(msg, 'utils');
    } else if (category == null) {
        const embed = new Discord.MessageEmbed()
            .setColor(colors.primary)
            .setTitle(command ? '404: command not found' : 'Help')
            .setThumbnail(command ? 'https://http.cat/404' : '')
            .setAuthor(hanna.user.username, hanna.user.avatarURL().toString(), hanna.user.avatarURL().toString())
            .setDescription(`<@${msg.author.id}>\n\nUse **${serverOptions.prefix}help *category***, or react to this message.\n\n**Categories:**\n${codeBlock}🧱 Moderation\n🎶 Music\n🧭 Utils\n🕹️ Fun${codeBlock}`)
        const message = await msg.channel.send(embed);
        await message.react('🧱');
        await message.react('🎶');
        await message.react('🧭');
        await message.react('🕹️');

        const filter = (reaction, user) => {
            return ['🧱', '🎶', '🧭', '🕹️'].includes(reaction.emoji.name) && user.id === msg.author.id;
        };

        message.awaitReactions(filter, { max: 1, time: 30000 })
            .then(collected => {
                const reaction = collected.first();

                message.delete();
                if (reaction.emoji.name === '🧱') {
                    getHelp(msg, 'moderation');
                } else if (reaction.emoji.name === '🎶') {
                    getHelp(msg, 'music');
                } else if (reaction.emoji.name === '🧭') {
                    getHelp(msg, 'utils');
                } else if (reaction.emoji.name === '🕹️') {
                    getHelp(msg, 'fun');
                }
                msg.delete();
            })
            .catch(collected => {
                return
            });
    } else {
        const embed = new Discord.MessageEmbed()
            .setColor(colors.primary)
            .setTitle('Oops...')
            .setAuthor(hanna.user.username, hanna.user.avatarURL().toString(), hanna.user.avatarURL().toString())
            .setDescription(`<@${msg.author.id}>\n\n**Category not found.**`)
            .setThumbnail('https://http.cat/404')
        msg.channel.send(embed);
    }
}

function getHelp(msg, category) {
    fs.readFile('assets/help.json', 'utf-8', function (err, data) {
        if (err) throw err;
        const obj = JSON.parse(data);

        obj.find(function (post, index) {
            if (post.category == category) {
                var commands = '';
                obj[index].commands.forEach(element => {
                    commands += `${codeBlock}fix\n${element.command}${codeBlock}${element.desc}\n\n`;
                });

                const embed = new Discord.MessageEmbed()
                    .setColor(colors.primary)
                    .setTitle(`Help | ${obj[index].emoji} ${category.charAt(0).toUpperCase() + category.slice(1)}`)
                    .setAuthor(hanna.user.username, hanna.user.avatarURL().toString(), hanna.user.avatarURL().toString())
                    .setDescription(`<@${msg.author.id}>\n\n${commands.replace(/%prefix%/g, serverOptions.prefix)}`)
                msg.channel.send(embed);
            }
        });
    });
}

async function play(msg, song) {
    q = hanna.queues.get(msg.guild.id);
    if (!song) {
        q.connection.play(await ytdl('https://www.youtube.com/watch?v=m5AMdCpBdEA', { highWaterMark: 1 << 25, filter: "audioonly" }), { type: "opus" })
            .on('finish', () => {
                q.connection.channel.leave();
                hanna.queues.delete(msg.guild.id);
            });
        const members = q.connection.channel.members;
        const goodbye = ['Sayonara', 'Goodbye', 'Adiós', 'さよなら', 'Adeus', 'Ciao', 'Tchauzinho'];
        const embed = new Discord.MessageEmbed()
            .setColor(colors.primary)
            .setTitle(goodbye[generateRandomExcept(goodbye.length, [])] + ',')
            .setAuthor(hanna.user.username, hanna.user.avatarURL().toString(), hanna.user.avatarURL().toString())
            .setDescription(`<@${members.first().id}>`)
        msg.channel.send(embed);
        return;
    }

    q.dispatcher = q.connection.play(await ytdl(song.url, { highWaterMark: 1 << 25, filter: "audioonly" }), { type: "opus" })
        .on('finish', () => {
            q.songs.shift();
            play(msg, q.songs[0]);
        })
        .on('error', error => console.error(error));
    q.dispatcher.setVolumeLogarithmic(q.volume / 100);
    msg.channel.send(`**Now playing:**\n\n${song.title}`);
}

async function getLyrics(msg, query) {
    const lrc = await lyrics.getLyric(query + 'musixmatch');

    if (lrc.error) {
        const embed = new Discord.MessageEmbed()
            .setColor(colors.primary)
            .setTitle(`Oops...`)
            .setAuthor(hanna.user.username, hanna.user.avatarURL().toString(), hanna.user.avatarURL().toString())
            .setDescription(`<@${msg.author.id}>\n\nWe couldn't find the lyrics :\ `)
        msg.channel.send(embed);
        return;
    }
    const desc = `<@${msg.author.id}>\n\n${lrc.lyric.trim()}`;
    const charLimit = 2000;
    let lyricEmbeds = [];

    let rg = /\n\s*\n/gi
    let oc = desc.split(rg);

    let c = 0;
    oc.map((ele, index) => {
        ele = '\n\n' + ele;
        if (index == 0) {
            lyricEmbeds.push(ele);
        } else if (lyricEmbeds[c].length + ele.length + 50 > charLimit) {
            lyricEmbeds.push(ele);
            c++;
        } else {
            lyricEmbeds[c] += ele
        }
    });

    lyricEmbeds.map((ele, index) => {
        msg.channel.startTyping();
        const embed = new Discord.MessageEmbed()
            .setColor(colors.primary)
            .setTitle(`${index != 0 ? '' : lrc.track}`)
            .setAuthor(index != 0 ? '' : hanna.user.username, index != 0 ? '' : hanna.user.avatarURL().toString(), index != 0 ? '' : hanna.user.avatarURL().toString())
            .setDescription(`${ele}${lyricEmbeds.length == 1 ? '' : '\n\n█████████████████ Part ' + (index + 1) + ' out of ' + lyricEmbeds.length + ' █████████████████'}`)
        msg.channel.send(embed);
        msg.channel.stopTyping();
    });
}

hanna.login(process.env.CLIENT_TOKEN);